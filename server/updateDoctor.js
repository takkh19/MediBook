
import db from "./database.js";

const doctor = db.prepare(`
  SELECT id, name
  FROM doctors
  WHERE name = ?
`).get("Nino Beridze");

if (!doctor) {
  console.log("ექიმი Nino Beridze ვერ მოიძებნა.");
} else {
  db.prepare(`
    UPDATE doctors
    SET name = ?, specialty = ?, clinic = ?
    WHERE id = ?
  `).run(
    "ნინო ბერიძე",
    "კარდიოლოგი",
    "მედიკლინიკა",
    doctor.id
  );

  console.log("ექიმის მონაცემები წარმატებით განახლდა!");
}

db.close();
