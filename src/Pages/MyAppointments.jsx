
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCurrentUser, getToken } from "../utils/auth";
import SiteHeader from "../components/SiteHeader/SiteHeader";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:3001";

function MyAppointments() {
  const currentUser = getCurrentUser();

  const [myAppointments, setMyAppointments] = useState([]);
  const [loading, setLoading] = useState(Boolean(currentUser));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentUser) return;

    const controller = new AbortController();

    async function loadAppointments() {
      setLoading(true);
      setError("");

      try {
        const token = getToken();

        if (!token) {
          throw new Error(
            "ავტორიზაციის სესია ვერ მოიძებნა. შედი ხელახლა."
          );
        }

        const response = await fetch(
          `${API_URL}/api/appointments/mine`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            signal: controller.signal,
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "ვიზიტების მიღება ვერ მოხერხდა."
          );
        }

        if (!Array.isArray(data.appointments)) {
          throw new Error("სერვერმა არასწორი მონაცემები დააბრუნა.");
        }

        if (!controller.signal.aborted) {
          setMyAppointments(data.appointments);
        }
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(
            err.message || "ვიზიტების ჩატვირთვა ვერ მოხერხდა."
          );
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    loadAppointments();

    return () => controller.abort();
  }, [currentUser?.id]);

  if (!currentUser) {
    return (
      <div className="app">
        <SiteHeader />

        <main className="doctors-section">
          <h1>ჩემი ვიზიტები</h1>
          <p>ვიზიტების სანახავად საჭიროა შესვლა.</p>

          <Link to="/auth" className="button">
            შესვლა / რეგისტრაცია
          </Link>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <SiteHeader />

      <main className="doctors-section">
        <h1>ჩემი ვიზიტები</h1>

        {loading ? (
          <p role="status">ვიზიტები იტვირთება...</p>
        ) : error ? (
          <div className="step-card">
            <p role="alert" style={{ color: "#b42318" }}>
              {error}
            </p>

            <button
              className="button"
              type="button"
              onClick={() => window.location.reload()}
            >
              ხელახლა ცდა
            </button>
          </div>
        ) : myAppointments.length === 0 ? (
          <div className="step-card">
            <p>ჯერჯერობით დაჯავშნილი ვიზიტები არ გაქვს.</p>

            <Link to="/appointments" className="button">
              ვიზიტის დაგეგმვა
            </Link>
          </div>
        ) : (
          <div className="doctor-grid">
            {myAppointments.map((appointment) => (
              <article className="step-card" key={appointment.id}>
                <h2>{appointment.doctor_name}</h2>

                <p>
                  სპეციალობა: {appointment.specialty || "არ არის მითითებული"}
                </p>

                <p>თარიღი: {appointment.date}</p>

                <p>დრო: {appointment.time}</p>

                <p>
                  სტატუსი:{" "}
                  {appointment.status === "confirmed"
                    ? "დადასტურებულია"
                    : appointment.status === "pending"
                    ? "მოლოდინშია"
                    : appointment.status === "cancelled"
                    ? "გაუქმებულია"
                    : appointment.status}
                </p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyAppointments;
