
import { Link, NavLink } from "react-router-dom";
import "./SiteHeader.css";

function SiteHeader() {
    return (
        <header className="site-header">
            <Link className="brand" to="/" aria-label="MediBook მთავარი გვერდი">
                <span className="brand-icon" aria-hidden="true">+</span>
                MediBook
            </Link>


            <nav className="navigation" aria-label="მთავარი ნავიგაცია">
                <NavLink to="/" end>მთავარი</NavLink>
                <NavLink to="/doctors">ექიმები</NavLink>
                <NavLink to="/appointments">ვიზიტის დაგეგმვა</NavLink>
                <NavLink to="/about">ჩვენ შესახებ</NavLink>
            </nav>


            <Link className="button site-header-action" to="/">
                მთავარ გვერდზე დაბრუნება
            </Link>
        </header>
    );
}

export default SiteHeader;
