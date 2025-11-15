import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Moon, Sun, Home, Package, Layers, ShoppingCart, FileText, Users, Building2, BarChart3 } from 'lucide-react'
import './Sidebar.css'

function Sidebar({ open, darkMode, setDarkMode }) {
  const location = useLocation()

  const menuItems = [
    { path: '/', label: 'Dashboard', icon: Home },
    { path: '/products', label: 'Products', icon: Package },
    { path: '/inventory', label: 'Inventory', icon: Layers },
    { path: '/purchases', label: 'Purchases', icon: ShoppingCart },
    { path: '/invoices', label: 'Billing', icon: FileText },
    { path: '/customers', label: 'Customers', icon: Users },
    { path: '/suppliers', label: 'Suppliers', icon: Building2 },
    { path: '/reports', label: 'Reports', icon: BarChart3 }
  ]

  const isActive = (path) => location.pathname === path

  return (
    <aside className={`sidebar ${open ? 'open' : 'closed'}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">Bi</div>
          <span className="logo-text">Brass Inventory</span>
        </div>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map(item => {
          const IconComponent = item.icon
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
              title={item.label}
            >
              <IconComponent size={20} />
              <span className="nav-label">{item.label}</span>
            </Link>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <button
          className="theme-toggle"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          <span>{darkMode ? 'Light' : 'Dark'}</span>
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
