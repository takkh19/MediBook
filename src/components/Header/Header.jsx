
import "./Header.css";

function Header() {
  return (
    <header className="dashboard-header">
      <div className="header-title">
        <h1>მთავარი პანელი</h1>
        <p>მოგესალმებით! მართეთ ექიმებისა და პაციენტების ვიზიტები.</p>
      </div>

      <div className="header-profile">
        <div className="profile-avatar">ად</div>
        <div className="profile-info">
          <strong>ადმინისტრატორი</strong>
          <span>მართვის პანელი</span>
        </div>
      </div>
    </header>
  );
}

export default Header;
