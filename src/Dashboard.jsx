
import Layout from "./components/Layout/Layout";
import Header from "./components/Header/Header";
import StatCard from "./components/StatCard/StatCard";
import "./Dashboard.css";

function Dashboard() {
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
                            value="128"
                            change="სულ ვიზიტები"
                            icon="📅"
                        />

                        <StatCard
                            title="ექიმი"
                            value="24"
                            change="რეგისტრირებული ექიმი"
                            icon="🩺"
                        />

                        <StatCard
                            title="პაციენტი"
                            value="356"
                            change="სულ პაციენტები"
                            icon="👥"
                        />

                        <StatCard
                            title="მოლოდინში"
                            value="18"
                            change="დასადასტურებელი ვიზიტები"
                            icon="⏳"
                        />
                    </div>
                </section>


                <section className="products-section" id="appointments">
                    <h2>უახლოესი ვიზიტები</h2>

                    <div className="appointments-list">
                        <article className="appointment-row">
                            <div className="appointment-patient">
                                <strong>ნინო ბერიძე</strong>
                                <span>კარდიოლოგია · დოქტორი გიორგი მაისურაძე</span>
                            </div>
                            <div className="appointment-details">
                                <span>15 ოქტომბერი, 10:00</span>
                                <span className="appointment-status confirmed">
                                    დადასტურებული
                                </span>
                            </div>
                        </article>

                        <article className="appointment-row">
                            <div className="appointment-patient">
                                <strong>მარიამ კაპანაძე</strong>
                                <span>თერაპია · დოქტორი ანა ლომიძე</span>
                            </div>
                            <div className="appointment-details">
                                <span>15 ოქტომბერი, 11:30</span>
                                <span className="appointment-status pending">
                                    მოლოდინში
                                </span>
                            </div>
                        </article>

                        <article className="appointment-row">
                            <div className="appointment-patient">
                                <strong>დავით გელაშვილი</strong>
                                <span>ნევროლოგია · დოქტორი ეკა ჯაფარიძე</span>
                            </div>
                            <div className="appointment-details">
                                <span>15 ოქტომბერი, 14:00</span>
                                <span className="appointment-status confirmed">
                                    დადასტურებული
                                </span>
                            </div>
                        </article>
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
