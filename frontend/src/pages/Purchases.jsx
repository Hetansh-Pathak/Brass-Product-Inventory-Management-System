import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Eye, Trash2, Search } from 'lucide-react'
import Table from '../components/Table'
import './ListPage.css'

function Purchases() {
  const [purchases, setP urchases] = useState([])
  const [filteredPurchases, setFilteredPurchases] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchPurchases()
  }, [])

  useEffect(() => {
    const filtered = purchases.filter(p =>
      p.billNo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredPurchases(filtered)
  }, [purchases, searchTerm])

  const fetchPurchases = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/purchases')
      setPurchases(response.data)
    } catch (error) {
      console.error('Error fetching purchases:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await axios.delete(`/api/purchases/${id}`)
      fetchPurchases()
    } catch (error) {
      alert('Error deleting purchase')
    }
  }

  const columns = [
    { key: 'billNo', label: 'Bill No', width: '120px' },
    {
      key: 'supplierId',
      label: 'Supplier',
      width: '200px',
      render: (_, p) => p.supplierId?.name || 'N/A'
    },
    {
      key: 'date',
      label: 'Date',
      width: '120px',
      render: v => new Date(v).toLocaleDateString()
    },
    { key: 'totalAmount', label: 'Total Amount ₹', width: '150px', render: v => v.toLocaleString() },
    { key: 'paymentStatus', label: 'Payment', width: '120px', render: v => <span className={`status-badge ${v === 'Paid' ? 'success' : 'warning'}`}>{v}</span> },
    {
      key: 'actions',
      label: 'Actions',
      width: '120px',
      render: (_, p) => (
        <div className="action-buttons">
          <button className="edit-btn" title="View">
            <Eye size={16} />
          </button>
          <button className="delete-btn" onClick={() => handleDelete(p._id)}>
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="list-page">
      <div className="page-header">
        <h1>Purchase Management</h1>
        <button className="btn-primary">
          <Plus size={20} />
          Add Purchase
        </button>
      </div>

      <div className="search-box">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search by bill number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Loading purchases...</div>
      ) : (
        <Table columns={columns} data={filteredPurchases} />
      )}
    </div>
  )
}

export default Purchases