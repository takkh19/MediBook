
import { useEffect, useState } from "react";
import { useDoctorStore } from "./store/useDoctorStore";
import { getCurrentUser, getToken } from "./utils/auth";

import Layout from "./components/Layout/Layout";
import Header from "./components/Header/Header";
import StatCard from "./components/StatCard/StatCard";
import "./Dashboard.css";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:3001";

function Dashboard() {
    const doctors = useDoctorStore((state) => state.doctors);
    const loadDoctors = useDoctorStore((state) => state.loadDoctors);

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const currentUser = getCurrentUser();

    useEffect(() => {
        loadDoctors();
    }, [loadDoctors]);

    useEffect(() => {
        const controller = new AbortController();

        async function loadAppointments() {
            setLoading(true);
            setError("");

            try {
                const token = getToken();

                if (!token) {
                    throw new Error("ავტორიზაცია აუცილებელია.");
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
                    setAppointments(data.appointments);
                }
            } catch (err) {
                if (err.name !== "AbortError" && !controller.signal.aborted) {
                    setError(err.message || "ვიზიტების ჩატვირთვა ვერ მოხერხდა.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        }

        if (currentUser?.role === "admin") {
            loadAppointments();
        }

        return () => controller.abort();
    }, [currentUser?.id, currentUser?.role]);

    const upcoming = appointments
        .filter(
            (appointment) =>
                appointment.status !== "cancelled" &&
                new Date(`${appointment.date}T${appointment.time}:00`) >
                new Date()
        )
        .sort(
            (a, b) =>
                new Date(`${a.date}T${a.time}:00`) -
                new Date(`${b.date}T${b.time}:00`)
        );

    return (
        <Layout>
            <Header />

            <main className="dashboard-main">
                <section className="stats-section" aria-label="სტატისტიკა">
                    <div className="section-heading">
                        <h2>მთავარი მიმოხილვა</h2>
                        <p>სამედიცინო ვიზიტების მართვის პანელი</p>
                    </div>

                    {currentUser?.role !== "admin" ? (
                        <p role="alert">
                            ეს გვერდი მხოლოდ ადმინისტრატორისთვისაა.
                        </p>
                    ) : loading ? (
                        <p role="status">მონაცემები იტვირთება...</p>
                    ) : error ? (
                        <p role="alert">{error}</p>
                    ) : (
                        <>
                            <div className="stats-grid">
                                <StatCard
                                    title="ვიზიტი"
                                    value={appointments.length}
                                    change="სულ ვიზიტები"
                                    icon="calendar"
                                />

                                <StatCard
                                    title="ექიმი"
                                    value={doctors.length}
                                    change="რეგისტრირებული ექიმი"
                                    icon="stethoscope"
                                />

                                <StatCard
                                    title="პაციენტი"
                                    value="—"
                                    change="პაციენტების სტატისტიკა"
                                    icon="users"
                                />

                                <StatCard
                                    title="მოლოდინში"
                                    value={upcoming.length}
                                    change="მომავალი ვიზიტები"
                                    icon="clock"
                                />
                            </div>

                            <section
                                className="products-section"
                                id="appointments"
                            >
                                <h2>უახლოესი ვიზიტები</h2>

                                <div className="appointments-list">
                                    {upcoming.length === 0 ? (
                                        <p>მომავალი ვიზიტები ჯერ არ არის.</p>
                                    ) : (
                                        upcoming.slice(0, 5).map((appointment) => (
                                            <article
                                                className="appointment-row"
                                                key={appointment.id}
                                            >
                                                <div className="appointment-patient">
                                                    <strong>
                                                        {appointment.patient_name ||
                                                            "უცნობი პაციენტი"}
                                                    </strong>

                                                    <span>
                                                        {appointment.doctor_name ||
                                                            "უცნობი ექიმი"}
                                                    </span>
                                                </div>

                                                <div className="appointment-details">
                                                    <span>
                                                        {appointment.date}, {appointment.time}
                                                    </span>

                                                    <span className="appointment-status confirmed">
                                                        {appointment.status === "confirmed"
                                                            ? "დადასტურებული"
                                                            : appointment.status === "pending"
                                                                ? "მოლოდინში"
                                                                : appointment.status}
                                                    </span>
                                                </div>
                                            </article>
                                        ))
                                    )}
                                </div>
                            </section>
                        </>
                    )}
                </section>
            </main>

            <footer className="dashboard-footer">
                <p>© 2026 MediBook. ყველა უფლება დაცულია.</p>
            </footer>
        </Layout>
    );
}

export default Dashboard;
