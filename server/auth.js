/* global process */
import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { z } from "zod";
import db from "./database.js";

const router = Router();

const registerSchema = z.object({
  name: z.string().trim().min(2),
  email: z.email().trim().toLowerCase(),
  password: z.string()
    .min(8)
    .regex(/[0-9]/, "Password must contain a number")
    .regex(/[^A-Za-z0-9]/, "Password must contain a special character"),
});

const loginSchema = z.object({
  email: z.email().trim().toLowerCase(),
  password: z.string().min(1),
});

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };
}

function createToken(user) {
  return jwt.sign(
    { sub: String(user.id) },
    process.env.JWT_SECRET,
    { expiresIn: "2h", algorithm: "HS256" }
  );
}

router.post("/register", async (req, res) => {
  const result = registerSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid registration data",
      errors: result.error.flatten(),
    });
  }

  const { name, email, password } = result.data;

  const existingUser = db
    .prepare("SELECT id FROM users WHERE email = ?")
    .get(email);

  if (existingUser) {
    return res.status(409).json({
      message: "Email is already registered",
    });
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const insert = db.prepare(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, 'patient')
    `).run(name, email, passwordHash);

    const user = db
      .prepare("SELECT id, name, email, role FROM users WHERE id = ?")
      .get(insert.lastInsertRowid);

    return res.status(201).json({
      message: "Registration successful",
      user: publicUser(user),
      token: createToken(user),
    });
  } catch (error) {
    if (error.code === "SQLITE_CONSTRAINT_UNIQUE") {
      return res.status(409).json({
        message: "Email is already registered",
      });
    }

    console.error("Registration error:", error);
    return res.status(500).json({
      message: "Registration failed",
    });
  }
});

router.post("/login", async (req, res) => {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      message: "Invalid login data",
    });
  }

  const { email, password } = result.data;

  const user = db
    .prepare("SELECT * FROM users WHERE email = ?")
    .get(email);

  const validPassword = user
    ? await bcrypt.compare(password, user.password_hash)
    : false;

  if (!validPassword) {
    return res.status(401).json({
      message: "Invalid email or password",
    });
  }

  return res.json({
    message: "Login successful",
    user: publicUser(user),
    token: createToken(user),
  });
});

export default router;
