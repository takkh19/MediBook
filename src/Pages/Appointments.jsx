
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useState, useRef } from "react";
import { z } from "zod";
import SiteHeader from "../components/SiteHeader/SiteHeader";
import { useDoctors } from "../hooks/useDoctors";
import { getAvailableSlots } from "../utils/appointmentSlots";
import { getCurrentUser } from "../utils/auth";

const appointmentSchema = z.object({
  doctorId: z.string().min(1, "გთხოვთ, აირჩიოთ ექიმი."),
  patientName: z.string().trim().min(3, "შეიყვანეთ სახელი და გვარი."),
  email: z.string().trim().email("შეიყვანეთ სწორი ელფოსტა."),
  date: z.string().min(1, "აირჩიეთ ვიზიტის თარიღი."),
  time: z.string().min(1, "აირჩიეთ ვიზიტის დრო."),
});
function Appointment() {
  const currentUser = getCurrentUser();
  const navigate = useNavigate();
  const { doctors } = useDoctors();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const [selectedDoctorId, setSelectedDoctorId] = useState(
    searchParams.get("doctor") || ""
  );
  const [patientName, setPatientName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isBookingServiceUnavailable] = useState(true);
  const [formError, setFormError] = useState("");
  const submissionLock = useRef(false);
  const selectedDoctor = doctors.find(
    (doctor) => String(doctor.id) === selectedDoctorId
  );
  const availableSlots = getAvailableSlots(
    selectedDoctorId,
    date
  );



async function handleSubmit(event) {
  event.preventDefault();

  const currentUser = getCurrentUser();

  if (!currentUser) {
    navigate("/auth");
    return;
  }

  if (submissionLock.current) return;

  const result = appointmentSchema.safeParse({
    doctorId: selectedDoctorId,
    patientName,
    email,
    date,
    time,
  });

  if (!result.success) {
    setFormError(result.error.issues[0].message);
    return;
  }

  if (!selectedDoctor) {
    setFormError("გთხოვთ, აირჩიოთ სიაში არსებული ექიმი.");
    return;
  }

  if (!getAvailableSlots(selectedDoctorId, date).includes(time)) {
    setFormError(
      "არჩეული დრო მიუწვდომელია. გთხოვთ, აირჩიოთ სხვა დრო."
    );
    setTime("");
    return;
  }

  const bookingKey =
    `medibook-booking-${date}-${selectedDoctorId}-${time}`;

  if (localStorage.getItem(bookingKey)) {
    setFormError(
      "ეს დრო უკვე დაჯავშნილია. გთხოვთ, აირჩიოთ სხვა დრო."
    );
    return;
  }

  submissionLock.current = true;
  setIsSubmitting(true);
  setFormError("");

  try {
    await new Promise((resolve) => setTimeout(resolve, 800));

    if (!getAvailableSlots(selectedDoctorId, date).includes(time)) {
      setFormError("არჩეული დრო უკვე დაკავებულია.");
      setTime("");
      return;
    }

    const savedAppointments = JSON.parse(
      localStorage.getItem("medibook-appointments") || "[]"
    );

    if (!Array.isArray(savedAppointments)) {
      throw new Error("Invalid appointments data");
    }

    const newAppointment = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      doctorId: selectedDoctorId,
      doctorName: selectedDoctor.name,
      patientName: result.data.patientName,
      email: result.data.email,
      date,
      time,
    };

    localStorage.setItem(
      "medibook-appointments",
      JSON.stringify([...savedAppointments, newAppointment])
    );

    localStorage.setItem(
      bookingKey,
      JSON.stringify(newAppointment)
    );

    setSubmitted(true);
  } catch {
    setFormError("დაჯავშნა ვერ მოხერხდა. გთხოვთ, სცადოთ ხელახლა.");
  } finally {
    setIsSubmitting(false);
    submissionLock.current = false;
  }
}


  return (
    <div className="app">
      <SiteHeader />

      <main>
        {isBookingServiceUnavailable && (
          <div
            role="alert"
            style={{
              padding: "14px 20px",
              margin: "0 0 20px",
              backgroundColor: "#fff3cd",
              color: "#664d03",
              border: "1px solid #ffecb5",
              borderRadius: "8px",
              textAlign: "center",
            }}

          >
            <strong>⚠️ ონლაინ დაჯავშნის სერვისი დროებით მიუწვდომელია.</strong>
            <p style={{ margin: "6px 0 0" }}>
              ვიზიტის დასაგეგმად დაგვიკავშირდით:{" "}
              <a href="tel:5555555555">555 55 55 55</a>
            </p>
          </div>
        )}
        <section className="doctors-section" aria-labelledby="appointment-title">
          <div className="section-heading">
            <div>
              <span className="eyebrow">ონლაინ დაჯავშნა</span>
              <h1 id="appointment-title">დაგეგმე ვიზიტი</h1>
              <p>შეავსე ფორმა სასურველი ვიზიტის მოთხოვნისთვის.</p>
            </div>
          </div>

          {submitted ? (
            <article className="step-card" aria-live="polite">
              <h2>
                <span
                  className="confirmation-pulse"
                  aria-hidden="true"
                ></span>
                ვიზიტის მოთხოვნა მიღებულია
              </h2>

              <p>
                გმადლობთ! თქვენი მოთხოვნა წარმატებით მომზადდა.
                ეს დემო ვერსიაა — რეალური დაჯავშნა ჯერ არ ხორციელდება.
              </p>

              <p>ექიმი: {selectedDoctor?.name || "არ არის არჩეული"}</p>
              <p>პაციენტი: {patientName}</p>
              <p>თარიღი: {date}</p>
              <p>დრო: {time}</p>

              <Link className="button" to="/doctors">
                ექიმების სიაში დაბრუნება
              </Link>
            </article>
          ) : !currentUser ? (
            <div className="appointment-login-notice">
              <h2>ვიზიტის დასაგეგმად გაიარე ავტორიზაცია</h2>
              <p>
                ექიმთან ვიზიტის დასაჯავშნად საჭიროა ანგარიშში შესვლა.
              </p>
              <Link to="/auth" className="button">
                შესვლა / რეგისტრაცია
              </Link>
            </div>
          ) : (
            <form className="appointment-form" onSubmit={handleSubmit}>
              {formError && (
                <p role="alert" style={{ color: "#b42318" }}>
                  {formError}
                </p>
              )}

              <label htmlFor="doctor">ექიმი</label>
              <select
                id="doctor"
                value={selectedDoctorId}
                onChange={(event) => {
                  setSelectedDoctorId(event.target.value);
                  setTime("");
                }}
              >
                <option value="">აირჩიე ექიმი</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} — {doctor.specialty}
                  </option>
                ))}
              </select>

              <label htmlFor="patientName">
                პაციენტის სახელი და გვარი
              </label>
              <input
                id="patientName"
                value={patientName}
                onChange={(event) => setPatientName(event.target.value)}
                required
                placeholder="მაგ. ნინო ნადირაძე"
              />

              <label htmlFor="email">ელფოსტა</label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
                placeholder="name@example.com"
              />

              <label htmlFor="date">ვიზიტის თარიღი</label>
              <input
                id="date"
                type="date"
                value={date}
                min={new Date().toLocaleDateString("en-CA")}
                onChange={(event) => {
                  setDate(event.target.value);
                  setTime("");
                }}
                required
              />

              <label htmlFor="time">ვიზიტის დრო</label>
              <select
                id="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                required
                disabled={!selectedDoctorId || !date}
              >
                <option value="">აირჩიე თავისუფალი დრო</option>
                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>

              {selectedDoctorId && date && availableSlots.length === 0 && (
                <p role="status">
                  ამ თარიღისთვის თავისუფალი დრო არ არის.
                  აირჩიე სხვა თარიღი.
                </p>
              )}

              <button
                className="button"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "მუშავდება..." : "ვიზიტის მოთხოვნა"}
              </button>
            </form>
          )}
        </section>
      </main>

      <footer className="site-footer">
        <p>© 2026 MediBook. ყველა უფლება დაცულია.</p>
        <a href="mailto:info@medibook.ge">დაგვიკავშირდით</a>
      </footer>
    </div>
  );
}

export default Appointment;
