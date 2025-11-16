import { useState, useEffect } from 'react'
import { Plus, AlertCircle, TrendingDown } from 'lucide-react'
import Table from '../components/Table'
import StockModal from '../components/StockModal'
import DataStorage from '../services/DataStorage'
import './ListPage.css'

function Inventory() {
  const [inventory, setInventory] = useState([])
  const [filteredInventory, setFilteredInventory] = useState([])
  const [lowStockItems, setLowStockItems] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('in')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = () => {
    const products = DataStorage.getProducts()
    const report = products.map(p => ({
      _id: p._id,
      name: p.name,
      sku: p.sku,
      category: p.category,
      currentStock: p.currentStock,
      minStockLevel: p.minStockLevel,
      purchasePrice: p.purchasePrice,
      sellingPrice: p.sellingPrice,
      stockValue: p.currentStock * p.purchasePrice,
      status: p.currentStock <= p.minStockLevel ? 'Low Stock' : 'In Stock'
    }))
    setInventory(report)
    setFilteredInventory(report)
    setLowStockItems(report.filter(i => i.currentStock <= i.minStockLevel))
  }

  const handleStockUpdate = (data) => {
    const product = DataStorage.getProducts().find(p => p._id === data.productId)
    if (!product) {
      alert('Product not found')
      return
    }

    if (modalType === 'in') {
      product.currentStock += data.quantity
    } else {
      if (product.currentStock < data.quantity) {
        alert('Insufficient stock')
        return
      }
      product.currentStock -= data.quantity
    }

    DataStorage.updateProduct(product._id, { currentStock: product.currentStock })
    loadData()
    setShowModal(false)
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
