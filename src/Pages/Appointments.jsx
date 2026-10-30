
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import SiteHeader from "../components/SiteHeader/SiteHeader";
import { useDoctors } from "../hooks/useDoctors";
import { getCurrentUser, getToken } from "../utils/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

const appointmentSchema = z.object({
  doctorId: z.string().min(1, "გთხოვთ, აირჩიოთ ექიმი."),
  patientName: z.string().trim().min(3, "შეიყვანეთ სახელი და გვარი."),
  email: z.email("შეიყვანეთ სწორი ელფოსტა."),
  date: z.string().min(1, "აირჩიეთ ვიზიტის თარიღი."),
  time: z.string().min(1, "აირჩიეთ ვიზიტის დრო."),
});

function Appointment() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { doctors } = useDoctors();

  const currentUser = getCurrentUser();

  const [selectedDoctorId, setSelectedDoctorId] = useState(
    searchParams.get("doctor") || ""
  );
  const [patientName, setPatientName] = useState("");
  const [email, setEmail] = useState(
    getCurrentUser()?.email || ""
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");

  const submissionLock = useRef(false);

  const selectedDoctor = doctors.find(
    (doctor) => String(doctor.id) === selectedDoctorId
  );

  const today = new Date();
  const todayString = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0"),
  ].join("-");

  useEffect(() => {
    if (!selectedDoctorId || !date) {
      return;
    }

    const controller = new AbortController();

    async function loadAvailableSlots() {
      setLoadingSlots(true);
      setAvailableSlots([]);
      setFormError("");

      try {
        const response = await fetch(
          `${API_URL}/api/appointments/available?doctorId=${encodeURIComponent(selectedDoctorId)}&date=${encodeURIComponent(date)}`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error("თავისუფალი დროების მიღება ვერ მოხერხდა.");
        }

        const data = await response.json();

        if (!controller.signal.aborted) {
          setAvailableSlots(
            Array.isArray(data) ? data : data.availableSlots || data.slots || []
          );
        }
      } catch (error) {
        if (error.name !== "AbortError") {
          setFormError(error.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoadingSlots(false);
        }
      }
    }

    loadAvailableSlots();

    return () => controller.abort();
  }, [selectedDoctorId, date]);

  async function handleSubmit(event) {
    event.preventDefault();

    if (!currentUser) {
      navigate("/auth");
      return;
    }

    if (currentUser.role !== "patient") {
      setFormError("ვიზიტის დაჯავშნა მხოლოდ პაციენტს შეუძლია.");
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

    if (date < todayString) {
      setFormError("წარსული თარიღის არჩევა შეუძლებელია.");
      return;
    }

    if (!availableSlots.includes(time)) {
      setFormError("არჩეული დრო მიუწვდომელია.");
      return;
    }

    const token = getToken();

    if (!token) {
      setFormError("სესია დასრულებულია. გთხოვთ, ხელახლა შეხვიდეთ.");
      return;
    }

    submissionLock.current = true;
    setIsSubmitting(true);
    setFormError("");

    try {
      const response = await fetch(`${API_URL}/api/appointments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          doctorId: Number(selectedDoctorId),
          patientName: result.data.patientName,
          email: result.data.email,
          date,
          time,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          setTime("");
          setAvailableSlots((previous) =>
            previous.filter((slot) => slot !== time)
          );
          throw new Error(
            "ეს დრო უკვე დაჯავშნილია. გთხოვთ, აირჩიოთ სხვა დრო."
          );
        }

        throw new Error(
          data.error || data.message || "დაჯავშნა ვერ მოხერხდა."
        );
      }

      setSubmitted(true);
    } catch (error) {
      setFormError(
        error.message || "დაჯავშნა ვერ მოხერხდა. სცადეთ ხელახლა."
      );
    } finally {
      submissionLock.current = false;
      setIsSubmitting(false);
    }
  }

  return (
    <div className="app">
      <SiteHeader />

      <main>
        <section
          className="doctors-section"
          aria-labelledby="appointment-title"
        >
          <div className="section-heading">
            <div>
              <span className="eyebrow">ონლაინ დაჯავშნა</span>
              <h1 id="appointment-title">დაგეგმე ვიზიტი</h1>
              <p>აირჩიე ექიმი, თარიღი და თავისუფალი დრო.</p>
            </div>
          </div>

          {submitted ? (
            <article className="step-card" aria-live="polite">
              <h2>ვიზიტი წარმატებით დაიჯავშნა!</h2>

              <p>
                თქვენი ჯავშანი შენახულია MediBook-ის მონაცემთა ბაზაში.
              </p>

              <p>ექიმი: {selectedDoctor?.name}</p>
              <p>პაციენტი: {patientName}</p>
              <p>თარიღი: {date}</p>
              <p>დრო: {time}</p>

              <Link className="button" to="/my-appointments">
                ჩემი ვიზიტების ნახვა
              </Link>
            </article>
          ) : !currentUser ? (
            <div className="appointment-login-notice">
              <h2>ვიზიტის დასაჯავშნად გაიარე ავტორიზაცია</h2>
              <p>გთხოვთ, შეხვიდეთ პაციენტის ანგარიშში.</p>

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
                  setAvailableSlots([]);
                }}
                required
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
                min={todayString}
                onChange={(event) => {
                  setDate(event.target.value);
                  setTime("");
                  setAvailableSlots([]);
                }}
                required
              />

              <label htmlFor="time">ვიზიტის დრო</label>
              <select
                id="time"
                value={time}
                onChange={(event) => setTime(event.target.value)}
                required
                disabled={
                  !selectedDoctorId ||
                  !date ||
                  loadingSlots ||
                  isSubmitting
                }
              >
                <option value="">
                  {loadingSlots
                    ? "იტვირთება..."
                    : "აირჩიე თავისუფალი დრო"}
                </option>

                {availableSlots.map((slot) => (
                  <option key={slot} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>

              {selectedDoctorId &&
                date &&
                !loadingSlots &&
                availableSlots.length === 0 && (
                  <p role="status">
                    ამ თარიღისთვის თავისუფალი დრო არ არის.
                  </p>
                )}

              <button
                className="button"
                type="submit"
                disabled={isSubmitting || loadingSlots}
              >
                {isSubmitting ? "მუშავდება..." : "ვიზიტის დაჯავშნა"}
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
