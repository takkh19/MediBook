import { useDoctors } from "../hooks/useDoctors";
import DoctorCard from "../components/DoctorCard/DoctorCard";
import SiteHeader from "../components/SiteHeader/SiteHeader";
import { useCallback, useState } from "react";
import DoctorModal from "../components/DoctorModal/DoctorModal";


function Doctors() {
   const {
    doctors,
    isDemoData,
    searchTerm,
    setSearchTerm,
    addDoctor,
    updateDoctor,
    deleteDoctor,
} = useDoctors();


const [isModalOpen, setIsModalOpen] = useState(false);
    const [doctorToEdit, setDoctorToEdit] = useState(null);

    const handleAddDoctor = useCallback(() => {
        setDoctorToEdit(null);
        setIsModalOpen(true);
    }, []);

    const handleEditDoctor = useCallback((doctor) => {
        setDoctorToEdit(doctor);
        setIsModalOpen(true);
    }, []);

    const handleSaveDoctor = useCallback((doctorData) => {
        if (doctorToEdit) {
            updateDoctor({
                ...doctorData,
                id: doctorToEdit.id,
            });
        } else {
            addDoctor(doctorData);
        }
    }, [doctorToEdit, updateDoctor, addDoctor]);

    const handleDeleteDoctor = useCallback((doctor) => {
        const confirmed = window.confirm(
            `ნამდვილად გსურს ექიმის წაშლა: ${doctor.name}?`
        );

        if (confirmed) {
            deleteDoctor(doctor.id);
        }
    }, [deleteDoctor]);

const handleCloseModal = useCallback(() => {
        setIsModalOpen(false);
    }, []);

    return (
        <div className="app">
            <SiteHeader />

            <main>
                {isDemoData && (
    <div
        role="status"
        style={{
            padding: "12px 20px",
            backgroundColor: "#fff3cd",
            color: "#664d03",
            textAlign: "center",
            borderBottom: "1px solid #ffecb5",
        }}
    >
        ⚠️ ნაჩვენებია ლოკალური დემო მონაცემები
    </div>
)}
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
                        <button
                            type="button"
                            className="button"
                            onClick={handleAddDoctor}
                        >
                            + ახალი ექიმის დამატება
                        </button>
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

                    <div className="doctor-grid">
                        {doctors.map((doctor) => (
                            <DoctorCard
                                key={doctor.id}
                                doctor={doctor}
                                onEdit={handleEditDoctor}
                                onDelete={handleDeleteDoctor}
                            />
                        ))}
                    </div>
                </section>
            </main>

            <footer className="site-footer">
                <p>© 2026 MediBook. ყველა უფლება დაცულია.</p>
                <a href="mailto:info@medibook.ge">დაგვიკავშირდით</a>
            </footer>
            <DoctorModal
                key={`${isModalOpen}-${doctorToEdit ? doctorToEdit.id : "new"}`}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSave={handleSaveDoctor}
                doctorToEdit={doctorToEdit}
            />
        </div>
    );
}

export default Doctors;
