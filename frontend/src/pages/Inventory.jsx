import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, AlertCircle, TrendingDown } from 'lucide-react'
import Table from '../components/Table'
import StockModal from '../components/StockModal'
import './ListPage.css'

function Inventory() {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [lowStockItems, setLowStockItems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('in')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [stockRes, lowStockRes] = await Promise.all([
        axios.get('/api/inventory/stock-report'),
        axios.get('/api/inventory/low-stock')
      ])
      setInventory(stockRes.data)
      setFilteredInventory(stockRes.data)
      setLowStockItems(lowStockRes.data)
    } catch (error) {
      console.error('Error fetching inventory:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleStockUpdate = async (data) => {
    try {
      if (modalType === 'in') {
        await axios.post('/api/inventory/stock-in', data)
      } else {
        await axios.post('/api/inventory/stock-out', data)
      }
      fetchData()
      setShowModal(false)
    } catch (error) {
      console.error('Error updating stock:', error)
      alert('Error updating stock')
    }
  }

  const columns = [
    { key: 'name', label: 'Product Name', width: '200px' },
    { key: 'sku', label: 'SKU', width: '120px' },
    { key: 'category', label: 'Category', width: '150px' },
    { key: 'currentStock', label: 'Current Stock', width: '120px' },
    { key: 'minStockLevel', label: 'Min Level', width: '100px' },
    {
      key: 'status',
      label: 'Status',
      width: '120px',
      render: (_, item) => (
        <span className={`status-badge ${item.status === 'Low Stock' ? 'warning' : 'success'}`}>
          {item.status}
        </span>
      )
    },
    { key: 'stockValue', label: 'Stock Value ₹', width: '130px', render: v => v.toLocaleString() }
  ]

  return (
    <div className="list-page">
      <div className="page-header">
        <h1>Inventory Management</h1>
        <div className="header-actions">
          <button className="btn-primary" onClick={() => { setModalType('in'); setShowModal(true); }}>
            <Plus size={20} />
            Stock In
          </button>
          <button className="btn-secondary" onClick={() => { setModalType('out'); setShowModal(true); }}>
            <TrendingDown size={20} />
            Stock Out
          </button>
        </div>
      </div>

      {lowStockItems.length > 0 && (
        <div className="alert-box">
          <AlertCircle size={20} />
          <span>{lowStockItems.length} items below minimum stock level</span>
        </div>
      )}

      {showModal && (
        <StockModal
          type={modalType}
          onSubmit={handleStockUpdate}
          onCancel={() => setShowModal(false)}
          products={inventory}
        />
      )}

      {loading ? (
        <div className="loading">Loading inventory...</div>
      ) : (
        <Table columns={columns} data={filteredInventory} />
      )}
    </div>
  )
}

export default Inventory
