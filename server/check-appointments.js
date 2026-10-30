import db from "./database.js";

const appointments = db.prepare(`
  SELECT
    a.id,
    a.date,
    a.time,
    u.name AS patient_name,
    u.email AS patient_email,
    d.name AS doctor_name
  FROM appointments a
  JOIN users u ON u.id = a.patient_id
  JOIN doctors d ON d.id = a.doctor_id
  ORDER BY a.id DESC
`).all();

console.table(appointments);
db.close();