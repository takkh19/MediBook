
/* global process */

import "dotenv/config";
import bcrypt from "bcryptjs";
import db from "../database.js";

const [email, password, name = "MediBook Admin"] = process.argv.slice(2);

if (!email || !password) {
  console.error("Usage: node scripts/createAdmin.js <email> <password> [name]");
  process.exit(1);
}

if (
  !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
  password.length < 8 ||
  !/[0-9]/.test(password) ||
  !/[^A-Za-z0-9]/.test(password)
) {
  console.error("Invalid email or weak password");
  process.exit(1);
}

const normalizedEmail = email.trim().toLowerCase();

const existing = db
  .prepare("SELECT id FROM users WHERE email = ?")
  .get(normalizedEmail);

if (existing) {
  console.error("Email already exists. Choose a different email.");
  process.exit(1);
}

const hash = await bcrypt.hash(password, 12);

db.prepare(`
  INSERT INTO users (name, email, password_hash, role)
  VALUES (?, ?, ?, 'admin')
`).run(name, normalizedEmail, hash);

console.log("Admin account created successfully.");
db.close();
