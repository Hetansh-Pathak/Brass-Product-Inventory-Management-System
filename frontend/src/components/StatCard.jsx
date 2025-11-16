import './StatCard.css'

function StatCard({ title, value, icon, color, trend }) {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <div className="stat-header">
        <h3>{title}</h3>
        <div className="stat-icon-wrapper" style={{ backgroundColor: `${color}20` }}>
          {icon}
        </div>
      </div>
      <div className="stat-content">
        <div className="stat-value">{value}</div>
        {trend && <div className="stat-trend">{trend}</div>}
      </div>
    </div>
  )
}

export default StatCard
