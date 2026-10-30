import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../utils/auth";
import Icon from "../Icon/Icon.jsx";
import "./SiteHeader.css";

function SiteHeader() {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const user = getCurrentUser();
  const isAdmin = user?.role === "admin";
  const isDoctor = user?.role === "doctor";
  const home = isAdmin ? "/dashboard" : isDoctor ? "/doctor-dashboard" : "/";
  const closeMenu = () => setIsMenuOpen(false);
  function handleLogout() { logoutUser(); closeMenu(); navigate("/auth", { replace: true }); }
  return <header className="site-header">
    <Link className="brand" to={home} onClick={closeMenu}><span className="brand-icon" aria-hidden="true">+</span>MediBook</Link>
    <button type="button" className="mobile-menu-toggle" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-expanded={isMenuOpen} aria-controls="main-navigation" aria-label="მენიუ"><Icon name={isMenuOpen ? "close" : "menu"} size={22}/></button>
    <nav id="main-navigation" className={`navigation ${isMenuOpen ? "navigation-open" : ""}`} aria-label="მთავარი ნავიგაცია">
      {isAdmin ? <><NavLink to="/dashboard" onClick={closeMenu}>ადმინ პანელი</NavLink><NavLink to="/doctors" onClick={closeMenu}>ექიმების მართვა</NavLink></> : isDoctor ? <><NavLink to="/doctor-dashboard" onClick={closeMenu}>ჩემი სამუშაო პანელი</NavLink><NavLink to="/doctors" onClick={closeMenu}>ექიმები</NavLink></> : <><NavLink to="/" end onClick={closeMenu}>მთავარი</NavLink><NavLink to="/doctors" onClick={closeMenu}>ექიმები</NavLink><NavLink to="/appointments" onClick={closeMenu}>ვიზიტის დაგეგმვა</NavLink>{user && <NavLink to="/my-appointments" onClick={closeMenu}>ჩემი ვიზიტები</NavLink>}<NavLink to="/about" onClick={closeMenu}>ჩვენ შესახებ</NavLink></>}
      {user ? <button type="button" className="nav-auth-button" onClick={handleLogout}>გამოსვლა ({user.name})</button> : <NavLink to="/auth" onClick={closeMenu}>შესვლა / რეგისტრაცია</NavLink>}
    </nav>
    <Link className="button site-header-action" to={home} onClick={closeMenu}>{isAdmin ? "ადმინ პანელი" : isDoctor ? "ექიმის პანელი" : "მთავარ გვერდზე დაბრუნება"}</Link>
  </header>;
}
export default SiteHeader;
