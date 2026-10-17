
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import "./DoctorModal.css";

function DoctorModal({ isOpen, onClose, onSave, doctorToEdit }) {
  const isEditing = Boolean(doctorToEdit);

const [name, setName] = useState(doctorToEdit?.name || "");
const [specialty, setSpecialty] = useState(doctorToEdit?.specialty || "");
const [experience, setExperience] = useState(doctorToEdit?.experience || "");
const [errors, setErrors] = useState({});


  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};

    if (name.trim().length < 3) {
      nextErrors.name = "სახელი უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს.";
    }

    if (specialty.trim().length < 3) {
      nextErrors.specialty = "სპეციალობა უნდა შეიცავდეს მინიმუმ 3 სიმბოლოს.";
    }

    if (!experience.trim()) {
      nextErrors.experience = "გთხოვთ, შეავსოთ გამოცდილების ველი.";
    }

    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) return;

    const trimmedName = name.trim();

    onSave({
      ...(doctorToEdit || {}),
      name: trimmedName,
      specialty: specialty.trim(),
      experience: experience.trim(),
      initials: trimmedName
        .split(/\s+/)
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toLowerCase(),
    });

    onClose();
  }

  return createPortal(
    <div
      className="doctor-modal-overlay"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        className="doctor-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="doctor-modal-title"
      >
        <div className="doctor-modal-heading">
          <h2 id="doctor-modal-title">
            {isEditing ? "ექიმის რედაქტირება" : "ახალი ექიმის დამატება"}
          </h2>

          <button
            type="button"
            className="doctor-modal-close"
            onClick={onClose}
            aria-label="მოდალის დახურვა"
          >
            ×
          </button>
        </div>

        <form className="doctor-modal-form" onSubmit={handleSubmit} noValidate>
          <label htmlFor="doctor-name">სახელი და გვარი</label>
          <input
            id="doctor-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "doctor-name-error" : undefined}
            placeholder="მაგ. ნინო ბერიძე"
          />
          {errors.name && (
            <p className="doctor-form-error" id="doctor-name-error">
              {errors.name}
            </p>
          )}

          <label htmlFor="doctor-specialty">სპეციალობა</label>
          <input
            id="doctor-specialty"
            value={specialty}
            onChange={(event) => setSpecialty(event.target.value)}
            aria-invalid={Boolean(errors.specialty)}
            aria-describedby={
              errors.specialty ? "doctor-specialty-error" : undefined
            }
            placeholder="მაგ. კარდიოლოგი"
          />
          {errors.specialty && (
            <p className="doctor-form-error" id="doctor-specialty-error">
              {errors.specialty}
            </p>
          )}

          <label htmlFor="doctor-experience">გამოცდილება</label>
          <input
            id="doctor-experience"
            value={experience}
            onChange={(event) => setExperience(event.target.value)}
            aria-invalid={Boolean(errors.experience)}
            aria-describedby={
              errors.experience ? "doctor-experience-error" : undefined
            }
            placeholder="მაგ. 5 წლის გამოცდილება"
          />
          {errors.experience && (
            <p className="doctor-form-error" id="doctor-experience-error">
              {errors.experience}
            </p>
          )}

          <div className="doctor-modal-actions">
            <button
              type="button"
              className="button button-outline"
              onClick={onClose}
            >
              გაუქმება
            </button>

            <button type="submit" className="button">
              {isEditing ? "ცვლილებების შენახვა" : "ექიმის დამატება"}
            </button>
          </div>
        </form>
      </section>
    </div>,
    document.body
  );
}

export default DoctorModal;
