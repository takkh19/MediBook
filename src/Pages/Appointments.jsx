
import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
import SiteHeader from "../components/SiteHeader/SiteHeader";

const doctors = [
  { id: "1", name: "ნინო ბერიძე", specialty: "კარდიოლოგი" },
  { id: "2", name: "გიორგი მაისურაძე", specialty: "დერმატოლოგი" },
  { id: "3", name: "ანა ლომიძე", specialty: "ნევროლოგი" },
  { id: "4", name: "დავით კაპანაძე", specialty: "ოჯახის ექიმი" },
  { id: "5", name: "მარიამ ჯაფარიძე", specialty: "პედიატრი" },
  { id: "6", name: "ლევან გელაშვილი", specialty: "ორთოპედი" },
];

function Appointment() {
  const [searchParams] = useSearchParams();
 const [selectedDoctorId, setSelectedDoctorId] = useState(
  searchParams.get("doctor") || ""
);
  const [patientName, setPatientName] = useState("");
  const [email, setEmail] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const selectedDoctor = doctors.find(
    (doctor) => doctor.id === selectedDoctorId
  );

  function handleSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    setMessage("თქვენი მოთხოვნა წარმატებით მომზადდა. ეს დემო ფორმაა და მონაცემები არ იგზავნება.");
  }

  return (
    <div className="app">
      <SiteHeader />

      <main>
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
              <h2>მოთხოვნა მომზადებულია</h2>
              <p>{message}</p>
              <p>ექიმი: {selectedDoctor?.name || "არ არის არჩეული"}</p>
              <p>პაციენტი: {patientName}</p>
              <p>თარიღი: {date}</p>
              <p>დრო: {time}</p>
              <Link className="button" to="/doctors">
                ექიმების სიაში დაბრუნება
              </Link>
            </article>
          ) : (
            <form className="appointment-form" onSubmit={handleSubmit}>
              <label htmlFor="doctor">ექიმი</label>
              <select
                id="doctor"
                value={selectedDoctorId}
                onChange={(event) => setSelectedDoctorId(event.target.value)}
              >
                <option value="">აირჩიე ექიმი</option>
                {doctors.map((doctor) => (
                  <option key={doctor.id} value={doctor.id}>
                    {doctor.name} — {doctor.specialty}
                  </option>
                ))}
              </select>

              <label htmlFor="patientName">პაციენტის სახელი და გვარი</label>
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
                onChange={(event) => setDate(event.target.value)}
                min={new Date().toISOString().split("T")[0]}
                required
              />

              <label htmlFor="time">ვიზიტის დრო</label>
              <select
                id="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                required
              >
                <option value="">აირჩიე დრო</option>
                <option value="10:00">10:00</option>
                <option value="11:00">11:00</option>
                <option value="12:00">12:00</option>
                <option value="14:00">14:00</option>
                <option value="15:00">15:00</option>
                <option value="16:00">16:00</option>
              </select>

              <button className="button" type="submit">
                ვიზიტის მოთხოვნა
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
