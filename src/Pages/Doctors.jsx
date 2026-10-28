
import { useCallback, useState } from "react";
import { useDoctors } from "../hooks/useDoctors";
import DoctorCard from "../components/DoctorCard/DoctorCard";
import DoctorModal from "../components/DoctorModal/DoctorModal";
import SiteHeader from "../components/SiteHeader/SiteHeader";

// Temporary demo role. Replace with authenticated user role later.
const DEMO_ROLE = "patient";

function Doctors() {
  const isAdmin = DEMO_ROLE === "admin";

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
    if (!isAdmin) return;
    setDoctorToEdit(null);
    setIsModalOpen(true);
  }, [isAdmin]);

  const handleEditDoctor = useCallback((doctor) => {
    if (!isAdmin) return;
    setDoctorToEdit(doctor);
    setIsModalOpen(true);
  }, [isAdmin]);

  const handleSaveDoctor = useCallback((doctorData) => {
    if (!isAdmin) return;

    if (doctorToEdit) {
      updateDoctor({
        ...doctorData,
        id: doctorToEdit.id,
      });
    } else {
      addDoctor(doctorData);
    }

    setIsModalOpen(false);
  }, [isAdmin, doctorToEdit, updateDoctor, addDoctor]);

  const handleDeleteDoctor = useCallback((doctor) => {
    if (!isAdmin) return;

    const confirmed = window.confirm(
      `ნამდვილად გსურს ექიმის წაშლა: ${doctor.name}?`
    );

    if (confirmed) {
      deleteDoctor(doctor.id);
    }
  }, [isAdmin, deleteDoctor]);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setDoctorToEdit(null);
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

        <section
          className="hero-section"
          aria-labelledby="doctors-page-title"
        >
          <div className="hero-content">
            <span className="eyebrow">ჩვენი სპეციალისტები</span>
            <h1 id="doctors-page-title">
              იპოვე შენთვის სასურველი ექიმი
            </h1>
            <p>
              გაეცანი სპეციალისტებს, შეარჩიე საჭირო მიმართულება
              და დაგეგმე ვიზიტი.
            </p>
          </div>

          <aside className="hero-card">
            <div className="medical-symbol" aria-hidden="true">
              +
            </div>
            <p className="hero-card-label">MEDIBOOK</p>
            <h2>სწორი არჩევანი ჯანმრთელობისთვის</h2>
            <p>
              აირჩიე სპეციალისტი შენი საჭიროებების მიხედვით.
            </p>
          </aside>
        </section>

        <section
          className="doctors-section"
          aria-labelledby="doctors-list-title"
        >
          <div className="section-heading">
            <div>
              <h2 id="doctors-list-title">ექიმების სია</h2>
              <p>
                აირჩიე სპეციალისტი და გააგრძელე ვიზიტის დაგეგმვა.
              </p>
            </div>

            {isAdmin && (
              <button
                type="button"
                className="button"
                onClick={handleAddDoctor}
              >
                + ახალი ექიმის დამატება
              </button>
            )}

            <span className="doctor-count">
              {doctors.length} სპეციალისტი
            </span>
          </div>

          <div className="doctor-search">
            <label htmlFor="doctor-search">
              ექიმის ძიება
            </label>
            <input
              id="doctor-search"
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
              placeholder="შეიყვანე ექიმის სახელი ან სპეციალობა..."
            />
          </div>

          <div className="doctor-grid">
            {doctors.map((doctor) => (
              <DoctorCard
                key={doctor.id}
                doctor={doctor}
                isAdmin={isAdmin}
                onEdit={handleEditDoctor}
                onDelete={handleDeleteDoctor}
              />
            ))}
          </div>
        </section>
      </main>

      <footer className="site-footer">
        <p>© 2026 MediBook. ყველა უფლება დაცულია.</p>
        <a href="mailto:info@medibook.ge">
          დაგვიკავშირდით
        </a>
      </footer>

      {isAdmin && (
        <DoctorModal
          key={`${isModalOpen}-${doctorToEdit?.id ?? "new"}`}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleSaveDoctor}
          doctorToEdit={doctorToEdit}
        />
      )}
    </div>
  );
}

export default Doctors;
