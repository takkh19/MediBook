
import Database from "better-sqlite3";

const db = new Database("medibook.db");

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'patient'
      CHECK(role IN ('patient', 'doctor', 'admin')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS doctors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER UNIQUE,
    name TEXT NOT NULL,
    specialty TEXT NOT NULL,
    clinic TEXT NOT NULL,
    experience INTEGER DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id)
  );

  CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id INTEGER NOT NULL,
    doctor_id INTEGER NOT NULL,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'confirmed'
      CHECK(status IN ('pending', 'confirmed', 'cancelled')),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (patient_id) REFERENCES users(id),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id)
  );

  CREATE UNIQUE INDEX IF NOT EXISTS unique_active_appointment
  ON appointments (doctor_id, date, time)
  WHERE status != 'cancelled';
`);

// Preserve existing appointments while adding booking-specific patient details.
const appointmentColumns = db.prepare("PRAGMA table_info(appointments)").all();
const appointmentColumnNames = new Set(appointmentColumns.map((column) => column.name));
if (!appointmentColumnNames.has("patient_name")) {
  db.exec("ALTER TABLE appointments ADD COLUMN patient_name TEXT");
}
if (!appointmentColumnNames.has("patient_email")) {
  db.exec("ALTER TABLE appointments ADD COLUMN patient_email TEXT");
}

const demoDoctors = [
  {
    name: "გიორგი მაისურაძე",
    specialty: "ნევროლოგი",
    clinic: "მედიქლაბი",
    experience: 12,
  },
  {
    name: "მარიამ კაპანაძე",
    specialty: "დერმატოლოგი",
    clinic: "ავერსის კლინიკა",
    experience: 7,
  },
  {
    name: "ლევან ჯაფარიძე",
    specialty: "ორთოპედი",
    clinic: "მედიქლაბი",
    experience: 15,
  },
  {
    name: "თამარ გელაშვილი",
    specialty: "პედიატრი",
    clinic: "ევექსის კლინიკა",
    experience: 10,
  },
  {
    name: "ანა ჩხეიძე",
    specialty: "ენდოკრინოლოგი",
    clinic: "MediBook კლინიკა",
    experience: 9,
  },
  {
    name: "დავით აბაშიძე",
    specialty: "კარდიოლოგი",
    clinic: "MediBook კლინიკა",
    experience: 14,
  },
];

const findDoctor = db.prepare(`
  SELECT id FROM doctors
  WHERE name = ? AND specialty = ?
`);

const insertDoctor = db.prepare(`
  INSERT INTO doctors (name, specialty, clinic, experience)
  VALUES (?, ?, ?, ?)
`);

const seedDoctors = db.transaction(() => {
  for (const doctor of demoDoctors) {
    const exists = findDoctor.get(
      doctor.name,
      doctor.specialty
    );

    if (!exists) {
      insertDoctor.run(
        doctor.name,
        doctor.specialty,
        doctor.clinic,
        doctor.experience
      );
    }
  }
});

seedDoctors();

db.exec(`
  CREATE TABLE IF NOT EXISTS doctor_schedule (
    doctor_id INTEGER NOT NULL,
    weekday INTEGER NOT NULL CHECK (weekday BETWEEN 0 AND 6),
    time TEXT NOT NULL,
    PRIMARY KEY (doctor_id, weekday, time),
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS doctor_schedule_settings (
    doctor_id INTEGER PRIMARY KEY,
    configured INTEGER NOT NULL DEFAULT 1,
    FOREIGN KEY (doctor_id) REFERENCES doctors(id) ON DELETE CASCADE
  );
`);

// არსებული ექიმებისთვის საწყისი სამუშაო გრაფიკი.
// 0 = კვირა, 1 = ორშაბათი, ... 6 = შაბათი.
const defaultTimes = [
  "10:00", "11:00", "12:00",
  "14:00", "15:00", "16:00"
];

const initializeSchedules = db.transaction(() => {
  const doctors = db.prepare("SELECT id FROM doctors").all();

  const hasSettings = db.prepare(`
    SELECT doctor_id FROM doctor_schedule_settings
    WHERE doctor_id = ?
  `);

  const insertSettings = db.prepare(`
    INSERT INTO doctor_schedule_settings (doctor_id)
    VALUES (?)
  `);

  const insertSlot = db.prepare(`
    INSERT OR IGNORE INTO doctor_schedule (doctor_id, weekday, time)
    VALUES (?, ?, ?)
  `);

  for (const doctor of doctors) {
    if (hasSettings.get(doctor.id)) continue;

    insertSettings.run(doctor.id);

    for (let weekday = 1; weekday <= 5; weekday++) {
      for (const time of defaultTimes) {
        insertSlot.run(doctor.id, weekday, time);
      }
    }
  }
});

initializeSchedules();


export default db;
