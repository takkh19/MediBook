
import { Link } from "react-router-dom";
import { getCurrentUser } from "../utils/auth";
import SiteHeader from "../components/SiteHeader/SiteHeader";

function MyAppointments() {
  const currentUser = getCurrentUser();

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

 const myAppointments = (() => {
  try {
    const saved = JSON.parse(
      localStorage.getItem("medibook-appointments") || "[]"
    );

    if (!Array.isArray(saved)) return [];

    return saved.filter(
      (appointment) => appointment.userId === currentUser.id
    );
  } catch {
    return [];
  }
})();

  return (
    <div className="app">
      <SiteHeader />

      <main className="doctors-section">
        <h1>ჩემი ვიზიტები</h1>

        {myAppointments.length === 0 ? (
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
                <h2>{appointment.doctorName}</h2>
                <p>პაციენტი: {appointment.patientName}</p>
                <p>თარიღი: {appointment.date}</p>
                <p>დრო: {appointment.time}</p>
                <p>სტატუსი: მოთხოვნა მიღებულია</p>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyAppointments;
