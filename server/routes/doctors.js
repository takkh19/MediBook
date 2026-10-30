
import { Router } from "express";
import { z } from "zod";
import db from "../database.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

const doctorSchema = z.object({
  name: z.string().trim().min(2),
  specialty: z.string().trim().min(2),
  clinic: z.string().trim().min(2),
  experience: z.number().int().min(0).max(70).default(0),
});

router.get("/", (req, res) => {
  const doctors = db.prepare(`
    SELECT id, name, specialty, clinic, experience
    FROM doctors
    ORDER BY id DESC
  `).all();

  res.json({ doctors });
});

router.get("/:id", (req, res) => {
  const doctor = db.prepare(`
    SELECT id, name, specialty, clinic, experience
    FROM doctors
    WHERE id = ?
  `).get(req.params.id);

  if (!doctor) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  res.json(doctor);
});

router.post("/", requireAuth, requireRole("admin"), (req, res) => {
  const result = doctorSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid doctor data",
    });
  }

  const { name, specialty, clinic, experience } = result.data;

  const insert = db.prepare(`
    INSERT INTO doctors (name, specialty, clinic, experience)
    VALUES (?, ?, ?, ?)
  `).run(name, specialty, clinic, experience);

  res.status(201).json({
    id: insert.lastInsertRowid,
    ...result.data,
  });
});

router.put("/:id", requireAuth, requireRole("admin"), (req, res) => {
  const result = doctorSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid doctor data",
    });
  }

  const { name, specialty, clinic, experience } = result.data;

  const update = db.prepare(`
    UPDATE doctors
    SET name = ?, specialty = ?, clinic = ?, experience = ?
    WHERE id = ?
  `).run(name, specialty, clinic, experience, req.params.id);

  if (update.changes === 0) {
    return res.status(404).json({ message: "Doctor not found" });
  }

  res.json({ id: Number(req.params.id), ...result.data });
});

router.delete("/:id", requireAuth, requireRole("admin"), (req, res) => {
  try {
    const deleted = db.prepare(
      "DELETE FROM doctors WHERE id = ?"
    ).run(req.params.id);

    if (deleted.changes === 0) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    res.json({ message: "Doctor deleted" });
  } catch (error) {
    if (error.code?.startsWith("SQLITE_CONSTRAINT")) {
      return res.status(409).json({
        message: "Doctor has related records and cannot be deleted",
      });
    }

    console.error(error);
    res.status(500).json({ message: "Failed to delete doctor" });
  }
});

export default router;
