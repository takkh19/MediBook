import { Link } from "react-router-dom";

function DoctorCard({ doctor }) {
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

        </article>
    );
}

export default DoctorCard;