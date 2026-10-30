/* global process */
import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({
  origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
}));

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    message: "MediBook API is running",
  });
});

app.listen(PORT, () => {
  console.log(`MediBook API running at http://localhost:${PORT}`);
});