
import "./Sidebar.css";

function Sidebar() {
  return (
    <aside className="sidebar">
      <h2 className="sidebar-logo">AdminPanel</h2>

      <nav className="sidebar-nav" aria-label="Main navigation">
        <a href="#dashboard">Dashboard</a>
        <a href="#products">Products</a>
        <a href="#orders">Orders</a>
        <a href="#customers">Customers</a>
        <a href="#settings">Settings</a>
      </nav>
    </aside>
  );
}

export default Sidebar;
