
import { useEffect, useState } from "react";
import { apiRequest } from "./services/api";
import { getCurrentUser } from "./utils/auth";
import Layout from "./components/Layout/Layout";
import StatCard from "./components/StatCard/StatCard";
import "./Dashboard.css";

const WEEKDAYS = [
  "კვირა",
  "ორშაბათი",
  "სამშაბათი",
  "ოთხშაბათი",
  "ხუთშაბათი",
  "პარასკევი",
  "შაბათი",
];

const TIMES = [
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

function Dashboard() {
  const [data, setData] = useState({
    stats: null,
    appointments: [],
    patients: [],
    doctors: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ექიმის ანგარიშის დაკავშირება
  const [email, setEmail] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [notice, setNotice] = useState("");
  const [saving, setSaving] = useState(false);

  // სამუშაო გრაფიკის მართვა
  const [scheduleDoctorId, setScheduleDoctorId] = useState("");
  const [scheduleSlots, setScheduleSlots] = useState([]);
  const [scheduleLoading, setScheduleLoading] = useState(false);
  const [scheduleMessage, setScheduleMessage] = useState("");
  const [scheduleSaving, setScheduleSaving] = useState(false);

  async function refresh() {
    const [
      stats,
      appointments,
      patients,
      doctors,
    ] = await Promise.all([
      apiRequest("/api/admin/stats"),
      apiRequest("/api/appointments/mine"),
      apiRequest("/api/admin/patients"),
      apiRequest("/api/admin/doctor-accounts"),
    ]);

    setData({
      stats,
      appointments: appointments.appointments || [],
      patients: patients.patients || [],
      doctors: doctors.doctors || [],
    });
  }

  useEffect(() => {
    let active = true;

    Promise.all([
      apiRequest("/api/admin/stats"),
      apiRequest("/api/appointments/mine"),
      apiRequest("/api/admin/patients"),
      apiRequest("/api/admin/doctor-accounts"),
    ])
      .then(([stats, appointments, patients, doctors]) => {
        if (!active) return;

        setData({
          stats,
          appointments: appointments.appointments || [],
          patients: patients.patients || [],
          doctors: doctors.doctors || [],
        });
      })
      .catch((err) => {
        if (active) setError(err.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const upcoming = data.appointments
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

  async function linkDoctor(event) {
    event.preventDefault();
    setSaving(true);
    setNotice("");

    try {
      await apiRequest("/api/admin/link-doctor", {
        method: "POST",
        body: JSON.stringify({
          doctorId: Number(doctorId),
          email: email.trim().toLowerCase(),
        }),
      });

      await refresh();

      setNotice(
        "ექიმის ანგარიში წარმატებით დაკავშირდა. " +
        "მომხმარებელმა ხელახლა უნდა გაიაროს ავტორიზაცია."
      );

      setEmail("");
      setDoctorId("");
    } catch (err) {
      setNotice(err.message);
    } finally {
      setSaving(false);
    }
  }

  // ------------------------------------------
  // ექიმის სამუშაო გრაფიკის ჩატვირთვა
  // ------------------------------------------

  async function loadSchedule(id) {
    setScheduleDoctorId(id);
    setScheduleSlots([]);
    setScheduleMessage("");

    if (!id) return;

    setScheduleLoading(true);

    try {
      const result = await apiRequest(
        `/api/schedule/admin/${id}`
      );

      setScheduleSlots(result.slots || []);
    } catch (err) {
      setScheduleMessage(
        `გრაფიკის ჩატვირთვა ვერ მოხერხდა: ${err.message}`
      );
    } finally {
      setScheduleLoading(false);
    }
  }

  // ------------------------------------------
  // კონკრეტული საათის მონიშვნა ან მოხსნა
  // ------------------------------------------

  function toggleScheduleSlot(weekday, time) {
    const exists = scheduleSlots.some(
      (slot) =>
        slot.weekday === weekday &&
        slot.time === time
    );

    if (exists) {
      setScheduleSlots((previous) =>
        previous.filter(
          (slot) =>
            !(
              slot.weekday === weekday &&
              slot.time === time
            )
        )
      );
    } else {
      setScheduleSlots((previous) => [
        ...previous,
        { weekday, time },
      ]);
    }
  }

  // ------------------------------------------
  // სამუშაო გრაფიკის შენახვა
  // ------------------------------------------

  async function saveSchedule() {
    if (!scheduleDoctorId) {
      setScheduleMessage("ჯერ აირჩიე ექიმი.");
      return;
    }

    setScheduleSaving(true);
    setScheduleMessage("");

    try {
      const result = await apiRequest(
        `/api/schedule/admin/${scheduleDoctorId}`,
        {
          method: "PUT",
          body: JSON.stringify({
            slots: scheduleSlots,
          }),
        }
      );

      setScheduleSlots(result.slots || []);

      setScheduleMessage(
        "სამუშაო გრაფიკი წარმატებით შენახულია."
      );
    } catch (err) {
      setScheduleMessage(
        `შენახვა ვერ მოხერხდა: ${err.message}`
      );
    } finally {
      setScheduleSaving(false);
    }
  }

  return (
    <Layout>
      <header className="dashboard-header">
        <div className="header-title">
          <h1>ადმინისტრატორის პანელი</h1>
          <p>
            მოგესალმებით, {getCurrentUser()?.name}.
            მართეთ ვიზიტები და ექიმები.
          </p>
        </div>
      </header>

      <main className="dashboard-main">
        <section className="stats-section">
          <div className="section-heading">
            <h2>მთავარი მიმოხილვა</h2>
          </div>

          {loading ? (
            <p role="status">მონაცემები იტვირთება...</p>
          ) : error ? (
            <p role="alert">{error}</p>
          ) : (
            <>
              {/* სტატისტიკა */}
              <div className="stats-grid">
                <StatCard
                  title="ვიზიტი"
                  value={data.stats?.appointments ?? 0}
                  change="სულ ვიზიტები"
                  icon="calendar"
                />

                <StatCard
                  title="ექიმი"
                  value={data.stats?.doctors ?? 0}
                  change="ექიმების ჩანაწერები"
                  icon="stethoscope"
                />

                <StatCard
                  title="პაციენტი"
                  value={data.stats?.patients ?? 0}
                  change="რეგისტრირებული პაციენტები"
                  icon="users"
                />

                <StatCard
                  title="მომავალი ვიზიტი"
                  value={upcoming.length}
                  change="აქტიური ვიზიტები"
                  icon="clock"
                />
              </div>

              {/* უახლოესი ვიზიტები */}
              <section className="products-section">
                <h2>უახლოესი ვიზიტები</h2>

                <div className="appointments-list">
                  {upcoming.length === 0 ? (
                    <p>მომავალი ვიზიტები არ არის.</p>
                  ) : (
                    upcoming.map((appointment) => (
                      <article
                        className="appointment-row"
                        key={appointment.id}
                      >
                        <div className="appointment-patient">
                          <strong>
                            {appointment.patient_name ||
                              "პაციენტი უცნობია"}
                          </strong>
                          <span>
                            {appointment.doctor_name}
                          </span>
                        </div>

                        <div className="appointment-details">
                          <span>
                            {appointment.date},{" "}
                            {appointment.time}
                          </span>

                          <span className="appointment-status confirmed">
                            {appointment.status === "confirmed"
                              ? "დადასტურებული"
                              : appointment.status}
                          </span>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>

              {/* პაციენტები */}
              <section className="products-section">
                <h2>
                  რეგისტრირებული პაციენტები (
                  {data.patients.length})
                </h2>

                <div className="appointments-list">
                  {data.patients.length === 0 ? (
                    <p>პაციენტები ჯერ არ არიან.</p>
                  ) : (
                    data.patients.map((patient) => (
                      <article
                        className="appointment-row"
                        key={patient.id}
                      >
                        <div className="appointment-patient">
                          <strong>{patient.name}</strong>
                          <span>{patient.email}</span>
                        </div>
                      </article>
                    ))
                  )}
                </div>
              </section>

              {/* სამუშაო გრაფიკის მართვა */}
              <section className="products-section">
                <h2>ექიმების სამუშაო გრაფიკი</h2>

                <p>
                  აირჩიე ექიმი და მონიშნე სამუშაო
                  დღეები და საათები. ამ გრაფიკს ექიმი
                  მხოლოდ ნახავს, ხოლო პაციენტი
                  შეძლებს თავისუფალი საათების დაჯავშნას.
                </p>

                <div
                  className="appointment-form"
                  style={{ marginTop: "20px" }}
                >
                  <label>
                    აირჩიე ექიმი
                    <select
                      value={scheduleDoctorId}
                      onChange={(event) =>
                        loadSchedule(event.target.value)
                      }
                    >
                      <option value="">
                        აირჩიე ექიმი
                      </option>

                      {data.doctors.map((doctor) => (
                        <option
                          key={doctor.id}
                          value={doctor.id}
                        >
                          {doctor.name}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>

                {scheduleDoctorId && (
                  <>
                    {scheduleLoading && (
                      <p role="status">
                        გრაფიკი იტვირთება...
                      </p>
                    )}

                    {!scheduleLoading && (
                      <>
                        <div
                          style={{
                            display: "grid",
                            gap: "16px",
                            marginTop: "24px",
                          }}
                        >
                          {WEEKDAYS.map(
                            (day, weekday) => (
                              <div
                                key={day}
                                style={{
                                  border:
                                    "1px solid #dce3ea",
                                  borderRadius: "12px",
                                  padding: "18px",
                                }}
                              >
                                <h3>{day}</h3>

                                <div
                                  style={{
                                    display: "flex",
                                    flexWrap: "wrap",
                                    gap: "14px",
                                    marginTop: "14px",
                                  }}
                                >
                                  {TIMES.map((time) => {
                                    const checked =
                                      scheduleSlots.some(
                                        (slot) =>
                                          slot.weekday ===
                                            weekday &&
                                          slot.time ===
                                            time
                                      );

                                    return (
                                      <label
                                        key={time}
                                        style={{
                                          display: "flex",
                                          alignItems:
                                            "center",
                                          gap: "6px",
                                          cursor:
                                            "pointer",
                                        }}
                                      >
                                        <input
                                          type="checkbox"
                                          checked={
                                            checked
                                          }
                                          disabled={
                                            scheduleSaving
                                          }
                                          onChange={() =>
                                            toggleScheduleSlot(
                                              weekday,
                                              time
                                            )
                                          }
                                        />
                                        <span>
                                          {time}
                                        </span>
                                      </label>
                                    );
                                  })}
                                </div>
                              </div>
                            )
                          )}
                        </div>

                        <button
                          className="button"
                          type="button"
                          onClick={saveSchedule}
                          disabled={scheduleSaving}
                          style={{
                            marginTop: "24px",
                          }}
                        >
                          {scheduleSaving
                            ? "ინახება..."
                            : "სამუშაო გრაფიკის შენახვა"}
                        </button>
                      </>
                    )}

                    {scheduleMessage && (
                      <p
                        role="status"
                        style={{
                          marginTop: "12px",
                        }}
                      >
                        {scheduleMessage}
                      </p>
                    )}
                  </>
                )}
              </section>

              {/* ექიმის ანგარიშის დაკავშირება */}
              <section className="products-section">
                <h2>
                  ექიმის ანგარიშის დაკავშირება
                </h2>

                <p>
                  ჯერ დაარეგისტრირე ახალი ანგარიში
                  ჩვეულებრივი რეგისტრაციით, შემდეგ
                  მიუთითე მისი ელფოსტა და შესაბამისი
                  ექიმი. უკვე არსებული პაციენტის
                  ანგარიშის გადაყვანისას მისი
                  პაციენტის როლი შეიცვლება.
                </p>

                <form
                  className="appointment-form"
                  onSubmit={linkDoctor}
                >
                  <label>
                    ექიმი
                    <select
                      value={doctorId}
                      onChange={(event) =>
                        setDoctorId(event.target.value)
                      }
                      required
                    >
                      <option value="">
                        აირჩიე ექიმი
                      </option>

                      {data.doctors.map((doctor) => (
                        <option
                          key={doctor.id}
                          value={doctor.id}
                        >
                          {doctor.name}
                          {doctor.account_email
                            ? ` (${doctor.account_email})`
                            : ""}
                        </option>
                      ))}
                    </select>
                  </label>

                  <label>
                    რეგისტრირებული ანგარიშის ელფოსტა
                    <input
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(event.target.value)
                      }
                      placeholder="doctor@example.com"
                      required
                    />
                  </label>

                  <button
                    className="button"
                    type="submit"
                    disabled={saving}
                  >
                    {saving
                      ? "მუშავდება..."
                      : "ექიმის ანგარიშის დაკავშირება"}
                  </button>
                </form>

                {notice && (
                  <p role="status">{notice}</p>
                )}

                <h3>ექიმების ანგარიშები</h3>

                <div className="appointments-list">
                  {data.doctors.map((doctor) => (
                    <article
                      className="appointment-row"
                      key={doctor.id}
                    >
                      <div className="appointment-patient">
                        <strong>
                          {doctor.name}
                        </strong>
                        <span>
                          {doctor.account_email ||
                            "ანგარიში არ არის დაკავშირებული"}
                        </span>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            </>
          )}
        </section>
      </main>
    </Layout>
  );
}

export default Dashboard;
