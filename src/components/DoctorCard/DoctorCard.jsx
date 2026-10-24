
import { memo } from "react";
import { Link } from "react-router-dom";

function DoctorCardComponent({ doctor, onEdit, onDelete }) {
    return (
        <article className="doctor-card">
            <div className="doctor-avatar" aria-hidden="true">
                {doctor.initials}
            </div>

            <h3>{doctor.name}</h3>
            <p className="doctor-specialty">{doctor.specialty}</p>
            <p className="doctor-experience">{doctor.experience}</p>

            <Link
                className="button button-outline doctor-button"
                to={`/appointments?doctor=${doctor.id}`}
                data-doctor-action="book"
                data-doctor-id={doctor.id}
            >
                ვიზიტის დაგეგმვა
            </Link>

            <div className="doctor-card-actions">
                <button
                    type="button"
                    className="button button-outline"
                    onClick={() => onEdit(doctor)}
                >
                    რედაქტირება
                </button>

                <button
                    type="button"
                    className="button button-outline"
                    onClick={() => onDelete(doctor)}
                >
                    წაშლა
                </button>
            </div>
        </article>
    );
}

export default memo(DoctorCardComponent);
