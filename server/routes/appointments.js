
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

const availabilitySchema = bookingSchema.pick({
  doctorId: true,
  date: true,
});

function getWeekday(date) {
  const [year, month, day] = date.split("-").map(Number);

  return new Date(
    Date.UTC(year, month - 1, day)
  ).getUTCDay();
}

function getWorkingHours(doctorId, date) {
  const weekday = getWeekday(date);

  return db.prepare(`
    SELECT time
    FROM doctor_schedule
    WHERE doctor_id = ? AND weekday = ?
    ORDER BY time
  `)
    .all(doctorId, weekday)
    .map((row) => row.time);
}

function isPastSlot(date, time) {
  return new Date(`${date}T${time}:00`) <= new Date();
}

// -------------------------------------------
// GET /api/appointments/available
// პაციენტისთვის თავისუფალი საათების დაბრუნება
// -------------------------------------------

router.get("/available", (req, res) => {
  const result = availabilitySchema.safeParse({
    doctorId: Number(req.query.doctorId),
    date: req.query.date,
  });

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid query parameters",
    });
  }

  const { doctorId, date } = result.data;

  const doctor = db.prepare(`
    SELECT id
    FROM doctors
    WHERE id = ?
  `).get(doctorId);

  if (!doctor) {
    return res.status(404).json({
      message: "Doctor not found",
    });
  }

  const booked = db.prepare(`
    SELECT time
    FROM appointments
    WHERE doctor_id = ?
      AND date = ?
      AND status != 'cancelled'
  `).all(doctorId, date);

  const bookedTimes = new Set(
    booked.map((appointment) => appointment.time)
  );

  const workingHours = getWorkingHours(doctorId, date);

  const availableSlots = workingHours.filter((time) => {
    return (
      !bookedTimes.has(time) &&
      !isPastSlot(date, time)
    );
  });

  return res.json({
    doctorId,
    date,
    availableSlots,
  });
});

// -------------------------------------------
// POST /api/appointments
// ახალი ვიზიტის დაჯავშნა
// -------------------------------------------

router.post(
  "/",
  requireAuth,
  requireRole("patient"),
  (req, res) => {
    const result = bookingSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({
        message: "Invalid booking data",
      });
    }

    const {
      doctorId,
      patientName,
      email,
      date,
      time,
    } = result.data;

    const doctor = db.prepare(`
      SELECT id
      FROM doctors
      WHERE id = ?
    `).get(doctorId);

    if (!doctor) {
      return res.status(404).json({
        message: "Doctor not found",
      });
    }

    const workingHours = getWorkingHours(doctorId, date);

    if (
      !workingHours.includes(time) ||
      isPastSlot(date, time)
    ) {
      return res.status(400).json({
        message:
          "ეს დრო ექიმის სამუშაო გრაფიკში არ შედის ან უკვე გასულია",
      });
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
      `).run(
        req.user.id,
        doctorId,
        patientName,
        email,
        date,
        time,
        "confirmed"
      );

      return res.status(201).json({
        id: insert.lastInsertRowid,
        doctorId,
        patientId: req.user.id,
        patientName,
        email,
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

      return res.status(500).json({
        message: "Booking failed",
      });
    }
  }
);

// -------------------------------------------
// GET /api/appointments/mine
// როლის მიხედვით ვიზიტების დაბრუნება
// -------------------------------------------

router.get("/mine", requireAuth, (req, res) => {
  let appointments;

  if (req.user.role === "patient") {
    // პაციენტი ხედავს მხოლოდ საკუთარ ვიზიტებს.
    appointments = db.prepare(`
      SELECT
        a.*,
        d.name AS doctor_name,
        d.specialty
      FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      WHERE a.patient_id = ?
      ORDER BY a.date DESC, a.time DESC
    `).all(req.user.id);

  } else if (req.user.role === "doctor") {
    // ექიმი ხედავს მხოლოდ მასთან დაჯავშნილ ვიზიტებს.
    appointments = db.prepare(`
      SELECT
        a.*,
        COALESCE(
          NULLIF(TRIM(a.patient_name), ''),
          u.name
        ) AS patient_name,
        COALESCE(
          NULLIF(TRIM(a.patient_email), ''),
          u.email
        ) AS patient_email
      FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      JOIN users u ON u.id = a.patient_id
      WHERE d.user_id = ?
      ORDER BY a.date DESC, a.time DESC
    `).all(req.user.id);

  } else if (req.user.role === "admin") {
    // Admin ხედავს ყველა ვიზიტს.
    appointments = db.prepare(`
      SELECT
        a.*,
        d.name AS doctor_name,
        COALESCE(
          NULLIF(TRIM(a.patient_name), ''),
          u.name
        ) AS patient_name,
        COALESCE(
          NULLIF(TRIM(a.patient_email), ''),
          u.email
        ) AS patient_email
      FROM appointments a
      JOIN doctors d ON d.id = a.doctor_id
      JOIN users u ON u.id = a.patient_id
      ORDER BY a.date DESC, a.time DESC
    `).all();

  } else {
    return res.status(403).json({
      message: "Access denied",
    });
  }

  return res.json({ appointments });
});

export default router;
