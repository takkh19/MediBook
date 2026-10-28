
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../utils/auth";
import Icon from "../Icon/Icon.jsx";
import "./SiteHeader.css";

function SiteHeader() {
    const navigate = useNavigate();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(getCurrentUser);

    function closeMenu() {
        setIsMenuOpen(false);
    }

    function handleLogout() {
        logoutUser();
        setCurrentUser(null);
        closeMenu();
        navigate("/auth");
    }

    return (
        <header className="site-header">
            <Link
                className="brand"
                to="/"
                aria-label="MediBook მთავარი გვერდი"
                onClick={closeMenu}
            >
                <span className="brand-icon" aria-hidden="true">
                    +
                </span>
                MediBook
            </Link>

            <button
                type="button"
                className="mobile-menu-toggle"
                onClick={() => setIsMenuOpen((open) => !open)}
                aria-label={isMenuOpen ? "მენიუს დახურვა" : "მენიუს გახსნა"}
                aria-expanded={isMenuOpen}
                aria-controls="main-navigation"
            >
                <Icon name={isMenuOpen ? "close" : "menu"} size={22} />
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
                {currentUser && (
                    <NavLink to="/my-appointments" onClick={closeMenu}>
                        ჩემი ვიზიტები
                    </NavLink>
                )}

                <NavLink to="/about" onClick={closeMenu}>
                    ჩვენ შესახებ
                </NavLink>
                {currentUser ? (
                    <button
                        type="button"
                        className="nav-auth-button"
                        onClick={handleLogout}
                    >
                        გამოსვლა
                    </button>
                ) : (
                    <NavLink to="/auth" onClick={closeMenu}>
                        შესვლა / რეგისტრაცია
                    </NavLink>
                )}
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
