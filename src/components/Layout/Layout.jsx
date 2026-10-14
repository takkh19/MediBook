
import "./Layout.css";

function Layout({ children }) {
  return (
    <div className="dashboard">
      <aside className="dashboard-sidebar">
        <h2> MediBook </h2>

        <nav aria-label="მთავარი ნავიგაცია">
          <a href="/dashboard">მთავარი პანელი</a>
          <a href="/">მთავარი გვერდი</a>
          <a href="/doctors">ექიმები</a>
          <a href="/appointments">ვიზიტები</a>
          <a href="/about">ჩვენ შესახებ</a>
        </nav>
      </aside>

      <div className="dashboard-content">
        {children}
      </div>
    </div>
  );
}

export default Layout;
