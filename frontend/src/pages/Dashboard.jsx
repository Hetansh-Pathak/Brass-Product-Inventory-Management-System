import { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { AlertCircle, TrendingUp, Package, DollarSign, ShoppingCart } from 'lucide-react'
import StatCard from '../components/StatCard'
import './Dashboard.css'

function Dashboard() {
  const [stats, setStats] = useState(null)
  const [recentData, setRecentData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [statsRes, recentRes] = await Promise.all([
        axios.get('/api/dashboard/stats'),
        axios.get('/api/dashboard/recent')
      ])
      setStats(statsRes.data)
      setRecentData(recentRes.data)
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div className="dashboard-loading">Loading dashboard...</div>
  }

  const chartData = [
    { name: 'Sales', value: stats?.todaysSalesAmount || 0 },
    { name: 'Purchase', value: stats?.todaysPurchaseAmount || 0 }
  ]

  const COLORS = ['#3b82f6', '#10b981']

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Welcome back! Here's your inventory overview.</p>
      </div>

      <div className="stats-grid">
        <StatCard
          title="Total Items in Stock"
          value={stats?.totalItems || 0}
          icon={<Package className="stat-icon" />}
          color="#3b82f6"
          trend="+12% from last month"
        />
        <StatCard
          title="Stock Value"
          value={`₹${(stats?.totalStockValue || 0).toLocaleString()}`}
          icon={<DollarSign className="stat-icon" />}
          color="#10b981"
          trend="All products valued"
        />
        <StatCard
          title="Low Stock Items"
          value={stats?.lowStockCount || 0}
          icon={<AlertCircle className="stat-icon" />}
          color="#f59e0b"
          trend="Needs attention"
        />
        <StatCard
          title="Today's Sales"
          value={`₹${(stats?.todaysSalesAmount || 0).toLocaleString()}`}
          icon={<TrendingUp className="stat-icon" />}
          color="#ef4444"
          trend={`${stats?.todaySalesCount || 0} invoices`}
        />
      </div>

      <div className="dashboard-charts">
        <div className="chart-card">
          <h3>Today's Transactions</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis dataKey="name" stroke="var(--text-color)" />
              <YAxis stroke="var(--text-color)" />
              <Tooltip />
              <Bar dataKey="value" fill="#3b82f6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Sales vs Purchase</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ₹${value.toLocaleString()}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {COLORS.map((color, index) => (
                  <Cell key={`cell-${index}`} fill={color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="dashboard-summary">
        <div className="summary-card">
          <h3>Quick Stats</h3>
          <ul className="stats-list">
            <li>
              <span>Total Products:</span>
              <strong>{stats?.productCount || 0}</strong>
            </li>
            <li>
              <span>Total Customers:</span>
              <strong>{stats?.customerCount || 0}</strong>
            </li>
            <li>
              <span>Total Suppliers:</span>
              <strong>{stats?.supplierCount || 0}</strong>
            </li>
            <li>
              <span>Today's Purchases:</span>
              <strong>{stats?.todayPurchaseCount || 0}</strong>
            </li>
          </ul>
        </div>

        <div className="summary-card alerts">
          <h3>Low Stock Alerts</h3>
          {stats?.lowStockCount === 0 ? (
            <p className="no-alerts">All items are well-stocked!</p>
          ) : (
            <p className="alert-count">
              {stats?.lowStockCount} items below minimum stock level
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
