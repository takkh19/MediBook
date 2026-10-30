
import { Router } from "express";
import { z } from "zod";
import db from "../database.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

const bookingSchema = z.object({
  doctorId: z.number().int().positive(),
  patientName: z.string().trim().min(3).max(120),
  email: z.email().max(254),
  date: z.iso.date(),
  time: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
});

const workingHours = ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00"];

router.get("/available", (req, res) => {
  const result = bookingSchema.pick({
    doctorId: true,
    date: true,
  }).safeParse({
    doctorId: Number(req.query.doctorId),
    date: req.query.date,
  });

  if (!result.success) {
    return res.status(400).json({ message: "Invalid query parameters" });
  }

  const { doctorId, date } = result.data;

  const doctor = db.prepare("SELECT id FROM doctors WHERE id = ?").get(doctorId);

  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  const booked = db.prepare(`
    SELECT time FROM appointments
    WHERE doctor_id = ? AND date = ? AND status != 'cancelled'
  `).all(doctorId, date);

  const bookedTimes = new Set(booked.map(item => item.time));

  const availableSlots = workingHours.filter(time =>
    !bookedTimes.has(time) &&
    new Date(`${date}T${time}:00`) > new Date()
  );

  res.json({ doctorId, date, availableSlots });
});

router.post("/", requireAuth, requireRole("patient"), (req, res) => {
  const result = bookingSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ message: "Invalid booking data" });
  }

  const { doctorId, patientName, email, date, time } = result.data;

  if (
    !workingHours.includes(time) ||
    new Date(`${date}T${time}:00`) <= new Date()
  ) {
    return res.status(400).json({ message: "Invalid appointment time" });
  }

  const doctor = db.prepare("SELECT id FROM doctors WHERE id = ?").get(doctorId);

  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  try {

    const insert = db.prepare(`
  INSERT INTO appointments (
    patient_id,
    doctor_id,
    patient_name,
    patient_email,
    date,
    time,
    status
  )
  VALUES (?, ?, ?, ?, ?, ?, ?)
`).run(req.user.id, doctorId, patientName, email, date, time, "confirmed");


    return res.status(201).json({
      id: insert.lastInsertRowid,
      doctorId,
      patientId: req.user.id,
      date,
      time,
      status: "confirmed",
    });
  } catch (error) {
    if (error.code?.startsWith("SQLITE_CONSTRAINT")) {
      return res.status(409).json({
        message: "This time slot is already booked",
      });
    }

    console.error(error);
    return res.status(500).json({ message: "Booking failed" });
  }
});

router.get("/mine", requireAuth, (req, res) => {
  let appointments;

  if (req.user.role === "patient") {
    appointments = db.prepare(`
      SELECT a.*, d.name AS doctor_name, d.specialty
      FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      WHERE a.patient_id = ?
      ORDER BY a.date DESC, a.time DESC
    `).all(req.user.id);
  } else if (req.user.role === "doctor") {
    appointments = db.prepare(`
      SELECT a.*, COALESCE(NULLIF(TRIM(a.patient_name), ''), u.name) AS patient_name, COALESCE(NULLIF(TRIM(a.patient_email), ''), u.email) AS patient_email
      FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      JOIN users u ON u.id = a.patient_id
      WHERE d.user_id = ?
      ORDER BY a.date DESC, a.time DESC
    `).all(req.user.id);
  } else {
    appointments = db.prepare(`
      SELECT a.*, d.name AS doctor_name, COALESCE(NULLIF(TRIM(a.patient_name), ''), u.name) AS patient_name, COALESCE(NULLIF(TRIM(a.patient_email), ''), u.email) AS patient_email
      FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      JOIN users u ON u.id = a.patient_id
      ORDER BY a.date DESC, a.time DESC
    `).all();
  }

  res.json({ appointments });
});

export default router;
