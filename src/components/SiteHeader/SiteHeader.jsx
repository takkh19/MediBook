
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./SiteHeader.css";

function SiteHeader() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function closeMenu() {
        setIsMenuOpen(false);
    }

    return (
        <header className="site-header">
            <Link
                className="brand"
                to="/"
                aria-label="MediBook მთავარი გვერდი"
                onClick={closeMenu}
            >
                <span className="brand-icon" aria-hidden="true">+</span>
                MediBook
            </Link>

            <button
                type="button"
                className="mobile-menu-toggle"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                aria-label={isMenuOpen ? "მენიუს დახურვა" : "მენიუს გახსნა"}
                aria-expanded={isMenuOpen}
                aria-controls="main-navigation"
            >
                {isMenuOpen ? "✕" : "☰"}
            </button>

            <nav
                id="main-navigation"
                className={`navigation ${isMenuOpen ? "navigation-open" : ""}`}
                aria-label="მთავარი ნავიგაცია"
            >
                <NavLink to="/" end onClick={closeMenu}>
                    მთავარი
                </NavLink>
                <NavLink to="/doctors" onClick={closeMenu}>
                    ექიმები
                </NavLink>
                <NavLink to="/appointments" onClick={closeMenu}>
                    ვიზიტის დაგეგმვა
                </NavLink>
                <NavLink to="/about" onClick={closeMenu}>
                    ჩვენ შესახებ
                </NavLink>
            </nav>

            <Link
                className="button site-header-action"
                to="/"
                onClick={closeMenu}
            >
                მთავარ გვერდზე დაბრუნება
            </Link>
        </header>
    );
}

export default SiteHeader;