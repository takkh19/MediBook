import { useDoctors } from "../hooks/useDoctors";
import DoctorCard from "../components/DoctorCard/DoctorCard";
import SiteHeader from "../components/SiteHeader/SiteHeader";
import { useEffect, useRef } from "react";

function Doctors() {
    const { doctors, searchTerm, setSearchTerm } = useDoctors();

    const doctorGridRef = useRef(null);

    useEffect(() => {
        const doctorGrid = doctorGridRef.current;

        if (!doctorGrid) return;

        function handleDoctorClick(event) {
            const link = event.target.closest('[data-doctor-action="book"]');

            if (!link || !doctorGrid.contains(link)) return;

            console.log("Doctor selected:", link.dataset.doctorId);
        }

        doctorGrid.addEventListener("click", handleDoctorClick);

        return () => {
            doctorGrid.removeEventListener("click", handleDoctorClick);
        };
    }, []);

    return (
        <div className="app">
            <SiteHeader />

            <main>
                <section className="hero-section" aria-labelledby="doctors-page-title">
                    <div className="hero-content">
                        <span className="eyebrow">ჩვენი სპეციალისტები</span>
                        <h1 id="doctors-page-title">იპოვე შენთვის სასურველი ექიმი</h1>
                        <p>
                            გაეცანი სპეციალისტებს, შეარჩიე საჭირო მიმართულება
                            და დაგეგმე ვიზიტი.
                        </p>
                    </div>

                    <aside className="hero-card">
                        <div className="medical-symbol" aria-hidden="true">+</div>
                        <p className="hero-card-label">MEDIBOOK</p>
                        <h2>სწორი არჩევანი ჯანმრთელობისთვის</h2>
                        <p>აირჩიე სპეციალისტი შენი საჭიროებების მიხედვით.</p>
                    </aside>
                </section>

                <section className="doctors-section" aria-labelledby="doctors-list-title">
                    <div className="section-heading">
                        <div>
                            <h2 id="doctors-list-title">ექიმების სია</h2>
                            <p>აირჩიე სპეციალისტი და გააგრძელე ვიზიტის დაგეგმვა.</p>
                        </div>
                        <span className="doctor-count">{doctors.length} სპეციალისტი</span>
                    </div>

                    <div className="doctor-search">
                        <label htmlFor="doctor-search">ექიმის ძიება</label>
                        <input
                            id="doctor-search"
                            type="search"
                            value={searchTerm}
                            onChange={(event) => setSearchTerm(event.target.value)}
                            placeholder="შეიყვანე ექიმის სახელი ან სპეციალობა..."
                        />
                    </div>

                    <div className="doctor-grid" ref={doctorGridRef}>
                        {doctors.map((doctor) => (
                            <DoctorCard key={doctor.id} doctor={doctor} />
                        ))}
                    </div>
                </section>
            </main>

            <footer className="site-footer">
                <p>© 2026 MediBook. ყველა უფლება დაცულია.</p>
                <a href="mailto:info@medibook.ge">დაგვიკავშირდით</a>
            </footer>
        </div>
    );
}

export default Doctors;
