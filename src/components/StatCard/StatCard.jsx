
import "./StatCard.css";

function StatCard({ title, value, change, icon }) {
  return (
    <article className="stat-card">
      <div className="stat-card-top">
        <span className="stat-card-icon">{icon}</span>
        <span className="stat-card-change">{change}</span>
      </div>

      <div className="stat-card-info">
        <p>{title}</p>
        <h2>{value}</h2>
      </div>
    </article>
  );
}

export default StatCard;
