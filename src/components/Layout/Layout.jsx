import "./Layout.css";
import { Link, useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../../utils/auth";
function Layout({ children }) {
 const user = getCurrentUser(); const admin = user?.role === "admin"; const navigate = useNavigate();
 return <div className="dashboard"><aside className="dashboard-sidebar"><h2>MediBook</h2><p>{admin ? "ადმინისტრატორი" : "ექიმი"}</p><nav aria-label="სამუშაო ნავიგაცია"><Link to={admin ? "/dashboard" : "/doctor-dashboard"}>მთავარი პანელი</Link><Link to="/doctors">ექიმები</Link><button type="button" className="dashboard-logout" onClick={() => {logoutUser(); navigate("/auth", {replace:true});}}>გამოსვლა</button></nav></aside><div className="dashboard-content">{children}</div></div>;
}
export default Layout;
