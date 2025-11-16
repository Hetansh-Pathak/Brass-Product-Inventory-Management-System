import { Menu, Moon, Sun, LogOut } from 'lucide-react'
import './TopHeader.css'

function TopHeader({ sidebarOpen, setSidebarOpen, darkMode, setDarkMode }) {
  return (
    <header className="top-header">
      <div className="header-left">
        <button 
          className="menu-toggle"
          onClick={() => setSidebarOpen(!sidebarOpen)}
          title="Toggle sidebar"
        >
          <Menu size={24} />
        </button>
        <div className="header-logo">
          <div className="logo-icon">⚙</div>
          <span className="logo-text">Brass Inventory</span>
        </div>
      </div>

      <div className="header-right">
        <button
          className="theme-btn"
          onClick={() => setDarkMode(!darkMode)}
          title={darkMode ? 'Light mode' : 'Dark mode'}
        >
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="logout-btn" title="Logout">
          <LogOut size={20} />
        </button>
      </div>
    </header>
  )
}

export default TopHeader
