import { useEffect } from "react";
import { useDoctorStore } from "./store/useDoctorStore";

import Layout from "./components/Layout/Layout";
import Header from "./components/Header/Header";
import StatCard from "./components/StatCard/StatCard";
import "./Dashboard.css";

function Dashboard() {
    const doctors = useDoctorStore((state) => state.doctors);
    const loadDoctors = useDoctorStore((state) => state.loadDoctors);
    useEffect(() => { loadDoctors(); }, [loadDoctors]);
    const readArray = (key) => {
        try {
            const value = JSON.parse(localStorage.getItem(key) || "[]");
            return Array.isArray(value) ? value : [];
        } catch { return []; }
    };
    const appointments = readArray("medibook-appointments");
    const patients = readArray("medibook-users").filter((user) => user.role === "patient");
    const upcoming = appointments.filter((appointment) => new Date(`${appointment.date}T${appointment.time}:00`) > new Date());
    return (
        <Layout>
            <Header />

            <main className="dashboard-main">
                <section
                    className="stats-section"
                    aria-label="სტატისტიკა"
                >
                    <div className="section-heading">
                        <h2>მთავარი მიმოხილვა</h2>
                        <p>
                            სამედიცინო ვიზიტების მართვის პანელი
                        </p>
                    </div>

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
                            value={patients.length}
                            change="სულ პაციენტები"
                            icon="users"
                        />

                        <StatCard
                            title="მოლოდინში"
                            value={upcoming.length}
                            change="მომავალი ვიზიტები"
                            icon="clock"
                        />
                    </div>
                </section>


                <section className="products-section" id="appointments">
                    <h2>უახლოესი ვიზიტები</h2>

                    <div className="appointments-list">
                        {upcoming.length === 0 ? (
                            <p>მომავალი ვიზიტები ჯერ არ არის.</p>
                        ) : upcoming.slice(0, 5).map((appointment) => (
                            <article className="appointment-row" key={appointment.id}>
                                <div className="appointment-patient">
                                    <strong>{appointment.patientName}</strong>
                                    <span>{appointment.doctorName}</span>
                                </div>
                                <div className="appointment-details">
                                    <span>{appointment.date}, {appointment.time}</span>
                                    <span className="appointment-status confirmed">დაჯავშნილი</span>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>

            </main>

            <footer className="dashboard-footer">
                <p>© 2026 MediBook. ყველა უფლება დაცულია.</p>
            </footer>
        </Layout>
    );
}

export default Dashboard;


