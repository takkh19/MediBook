
import { useEffect, useState } from "react";
import Layout from "../components/Layout/Layout";
import { apiRequest } from "../services/api";
import { getCurrentUser } from "../utils/auth";
import "../Dashboard.css";

const WEEKDAYS = [
  "კვირა",
  "ორშაბათი",
  "სამშაბათი",
  "ოთხშაბათი",
  "ხუთშაბათი",
  "პარასკევი",
  "შაბათი",
];

function formatLocalDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getWeekday(dateString) {
  const [year, month, day] = dateString.split("-").map(Number);

  return new Date(
    Date.UTC(year, month - 1, day)
  ).getUTCDay();
}

function DoctorDashboard() {
  const [appointments, setAppointments] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [doctorName, setDoctorName] = useState("");

  const [selectedDate, setSelectedDate] = useState(
    formatLocalDate(new Date())
  );

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        // ექიმის ვიზიტები და გრაფიკი იტვირთება ერთად.
        const [appointmentsData, scheduleData] = await Promise.all([
          apiRequest("/api/appointments/mine"),
          apiRequest("/api/schedule/mine"),
        ]);

        if (!active) return;

        setAppointments(appointmentsData.appointments || []);
        setSchedule(scheduleData.slots || []);
        setDoctorName(scheduleData.doctor?.name || "");
      } catch (err) {
        if (active) {
          setError(err.message);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  // მომავალი ვიზიტები
  const upcoming = appointments
    .filter(
      (appointment) =>
        appointment.status !== "cancelled" &&
        new Date(
          `${appointment.date}T${appointment.time}:00`
        ) > new Date()
    )
    .sort((a, b) =>
      `${a.date}${a.time}`.localeCompare(
        `${b.date}${b.time}`
      )
    );

  // არჩეული დღის სამუშაო საათები
  const selectedWeekday = getWeekday(selectedDate);

  const daySlots = schedule
    .filter(
      (slot) => slot.weekday === selectedWeekday
    )
    .sort((a, b) => a.time.localeCompare(b.time));

  // არჩეული დღის დაჯავშნილი ვიზიტები
  const selectedAppointments = appointments.filter(
    (appointment) =>
      appointment.date === selectedDate &&
      appointment.status !== "cancelled"
  );

  function getAppointmentAt(time) {
    return selectedAppointments.find(
      (appointment) => appointment.time === time
    );
  }

  return (
    <Layout>
      <header className="dashboard-header">
        <div className="header-title">
          <h1>ექიმის სამუშაო პანელი</h1>

          <p>
            მოგესალმებით, {getCurrentUser()?.name}.
            {doctorName && ` ექიმი: ${doctorName}.`}
          </p>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="stats-section">
          {loading ? (
            <p role="status">მონაცემები იტვირთება...</p>
          ) : error ? (
            <p role="alert">{error}</p>
          ) : (
            <>
              {/* კვირის სამუშაო გრაფიკი */}
              <section className="products-section">
                <h2>ჩემი სამუშაო საათები</h2>

                <p>
                  სამუშაო გრაფიკს განსაზღვრავს
                  ადმინისტრატორი. აქ მისი მხოლოდ
                  ნახვა შეგიძლიათ.
                </p>

                <div className="appointments-list">
                  {WEEKDAYS.map((day, weekday) => {
                    const times = schedule
                      .filter(
                        (slot) =>
                          slot.weekday === weekday
                      )
                      .map((slot) => slot.time)
                      .sort();

                    return (
                      <article
                        className="appointment-row"
                        key={day}
                      >
                        <div className="appointment-patient">
                          <strong>{day}</strong>

                          <span>
                            {times.length > 0
                              ? times.join(", ")
                              : "დასვენება"}
                          </span>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </section>

              {/* კონკრეტული დღის განრიგი */}
              <section className="products-section">
                <h2>ჩემი დღის განრიგი</h2>

                <div
                  className="appointment-form"
                  style={{ marginTop: "16px" }}
                >
                  <label>
                    აირჩიე თარიღი

                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(event) =>
                        setSelectedDate(event.target.value)
                      }
                    />
                  </label>
                </div>

                <h3 style={{ marginTop: "20px" }}>
                  {selectedDate} — {WEEKDAYS[selectedWeekday]}
                </h3>

                <div className="appointments-list">
                  {daySlots.length === 0 ? (
                    <p>
                      ამ დღეს სამუშაო საათები
                      განსაზღვრული არ არის.
                    </p>
                  ) : (
                    daySlots.map((slot) => {
                      const appointment =
                        getAppointmentAt(slot.time);

                      return (
                        <article
                          className="appointment-row"
                          key={slot.time}
                        >
                          <div className="appointment-patient">
                            <strong>{slot.time}</strong>

                            <span>
                              {appointment
                                ? appointment.patient_name ||
                                  "პაციენტი"
                                : "თავისუფალი დრო"}
                            </span>
                          </div>

                          <div className="appointment-details">
                            {appointment ? (
                              <span className="appointment-status confirmed">
                                დაჯავშნილი
                              </span>
                            ) : (
                              <span>
                                თავისუფალი
                              </span>
                            )}
                          </div>
                        </article>
                      );
                    })
                  )}
                </div>
              </section>

              {/* მომავალი ვიზიტები */}
              <section className="products-section">
                <div className="section-heading">
                  <h2>
                    მომავალი ვიზიტები: {upcoming.length}
                  </h2>

                  <p>
                    სულ ვიზიტები: {appointments.length}
                  </p>
                </div>

                <div className="appointments-list">
                  {upcoming.length === 0 ? (
                    <p>
                      ამჟამად მომავალი ვიზიტები არ არის.
                    </p>
                  ) : (
                    upcoming.map((appointment) => (
                      <article
                        className="appointment-row"
                        key={appointment.id}
                      >
                        <div className="appointment-patient">
                          <strong>
                            {appointment.patient_name ||
                              "პაციენტი"}
                          </strong>

                          <span>პაციენტი</span>
                        </div>

                        <div className="appointment-details">
                          <span>
                            {appointment.date},{" "}
                            {appointment.time}
                          </span>

                          <span className="appointment-status confirmed">
                            {appointment.status ===
                            "confirmed"
                              ? "დადასტურებული"
                              : appointment.status}
                          </span>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>

              {/* ვიზიტების ისტორია */}
              <section className="products-section">
                <h2>ვიზიტების ისტორია</h2>

                <div className="appointments-list">
                  {appointments.length === 0 ? (
                    <p>ვიზიტები ჯერ არ არის.</p>
                  ) : (
                    appointments.map((appointment) => (
                      <article
                        className="appointment-row"
                        key={appointment.id}
                      >
                        <div className="appointment-patient">
                          <strong>
                            {appointment.patient_name ||
                              "პაციენტი"}
                          </strong>

                          <span>
                            {appointment.date},{" "}
                            {appointment.time}
                          </span>
                        </div>

                        <span>
                          {appointment.status}
                        </span>
                      </article>
                    ))
                  )}
                </div>
              </section>
            </>
          )}
        </section>
      </main>
    </Layout>
  );
}

export default DoctorDashboard;
