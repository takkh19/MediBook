
/* global process */
import doctorsRouter from "./routes/doctors.js";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import db from "./database.js";
import authRouter from "./auth.js";
import { requireAuth, requireRole } from "./middleware/auth.js";
import appointmentsRouter from "./routes/appointments.js";
import adminRouter from "./routes/admin.js";

dotenv.config();

if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) {
  throw new Error("JWT_SECRET must contain at least 32 characters");
}

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
}));

app.use(express.json({ limit: "20kb" }));

app.get("/api/health", (req, res) => {
  const database = db.prepare("SELECT 1 AS connected").get();

  res.json({
    status: "ok",
    database: database.connected === 1 ? "connected" : "error",
  });
});

app.use("/api/auth", authRouter);

app.get("/api/auth/me", requireAuth, (req, res) => {
  res.json({ user: req.user });
});

app.get(
  "/api/admin/check",
  requireAuth,
  requireRole("admin"),
  (req, res) => {
    res.json({ message: "Admin access granted" });
  }
);

app.get(
  "/api/doctor/check",
  requireAuth,
  requireRole("doctor"),
  (req, res) => {
    res.json({ message: "Doctor access granted" });
  }
);
app.use("/api/admin", adminRouter);
app.use("/api/doctors", doctorsRouter);
app.use("/api/appointments", appointmentsRouter);

app.listen(PORT, () => {
  console.log(`MediBook API running at http://localhost:${PORT}`);
});
