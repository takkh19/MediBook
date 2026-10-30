
import { Router } from "express";
import { z } from "zod";
import db from "../database.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

const scheduleSchema = z.object({
  slots: z.array(
    z.object({
      weekday: z.number().int().min(0).max(6),
      time: z.string().regex(
        /^([01]\d|2[0-3]):[0-5]\d$/
      ),
    })
  ).max(500),
});

function getSchedule(doctorId) {
  return db.prepare(`
    SELECT weekday, time
    FROM doctor_schedule
    WHERE doctor_id = ?
    ORDER BY weekday, time
  `).all(doctorId);
}

// Admin ხედავს ნებისმიერი ექიმის გრაფიკს.
router.get(
  "/admin/:doctorId",
  requireAuth,
  requireRole("admin"),
  (req, res) => {
    const doctorId = Number(req.params.doctorId);

    const doctor = db.prepare(
      "SELECT id, name FROM doctors WHERE id = ?"
    ).get(doctorId);

    if (!doctor) {
      return res.status(404).json({
        message: "ექიმი ვერ მოიძებნა",
      });
    }

    res.json({
      doctor,
      slots: getSchedule(doctorId),
    });
  }
);

// მხოლოდ Admin ცვლის გრაფიკს.
router.put(
  "/admin/:doctorId",
  requireAuth,
  requireRole("admin"),
  (req, res) => {
    const doctorId = Number(req.params.doctorId);
    const parsed = scheduleSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        message: "გრაფიკის მონაცემები არასწორია",
      });
    }

    const doctor = db.prepare(
      "SELECT id FROM doctors WHERE id = ?"
    ).get(doctorId);

    if (!doctor) {
      return res.status(404).json({
        message: "ექიმი ვერ მოიძებნა",
      });
    }

    const uniqueSlots = [
      ...new Map(
        parsed.data.slots.map(slot => [
          `${slot.weekday}-${slot.time}`,
          slot,
        ])
      ).values(),
    ];

    // არ დავუშვათ უკვე დაჯავშნილი მომავალი
    // ვიზიტის სამუშაო გრაფიკიდან ამოღება.
    const upcoming = db.prepare(`
      SELECT date, time
      FROM appointments
      WHERE doctor_id = ?
        AND status != 'cancelled'
        AND datetime(date || ' ' || time) >= datetime('now')
    `).all(doctorId);

    const allowed = new Set(
      uniqueSlots.map(s => `${s.weekday}-${s.time}`)
    );

    for (const appointment of upcoming) {
      const [year, month, day] = appointment.date
        .split("-")
        .map(Number);

      const weekday = new Date(
        Date.UTC(year, month - 1, day)
      ).getUTCDay();

      if (!allowed.has(`${weekday}-${appointment.time}`)) {
        return res.status(409).json({
          message:
            "ამ გრაფიკით არსებული მომავალი ვიზიტი გაუქმდებოდა. " +
            "დატოვე მისი დღე და საათი.",
        });
      }
    }

    const save = db.transaction(() => {
      db.prepare(`
        INSERT OR IGNORE INTO doctor_schedule_settings
        (doctor_id) VALUES (?)
      `).run(doctorId);

      db.prepare(`
        DELETE FROM doctor_schedule WHERE doctor_id = ?
      `).run(doctorId);

      const insert = db.prepare(`
        INSERT INTO doctor_schedule
        (doctor_id, weekday, time)
        VALUES (?, ?, ?)
      `);

      for (const slot of uniqueSlots) {
        insert.run(doctorId, slot.weekday, slot.time);
      }
    });

    save();

    res.json({
      message: "გრაფიკი შენახულია",
      slots: getSchedule(doctorId),
    });
  }
);

// Doctor ხედავს მხოლოდ საკუთარ გრაფიკს.
router.get(
  "/mine",
  requireAuth,
  requireRole("doctor"),
  (req, res) => {
    const doctor = db.prepare(`
      SELECT id, name
      FROM doctors
      WHERE user_id = ?
    `).get(req.user.id);

    if (!doctor) {
      return res.status(404).json({
        message: "ექიმის ანგარიში არ არის დაკავშირებული",
      });
    }

    res.json({
      doctor,
      slots: getSchedule(doctor.id),
    });
  }
);

export default router;
