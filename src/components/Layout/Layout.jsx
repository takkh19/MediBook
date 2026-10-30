
import "./Layout.css";
import { Link } from "react-router-dom";

function Layout({ children }) {
  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <h2> MediBook </h2>

        <nav aria-label="მთავარი ნავიგაცია">
          <Link to="/dashboard">მთავარი პანელი</Link>
          <Link to="/">მთავარი გვერდი</Link>
          <Link to="/doctors">ექიმები</Link>
          <Link to="/appointments">ვიზიტები</Link>
          <Link to="/about">ჩვენ შესახებ</Link>
        </nav>
      </aside>

      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
}

export default Layout;
