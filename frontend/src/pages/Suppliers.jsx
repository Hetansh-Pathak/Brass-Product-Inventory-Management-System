import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import Table from '../components/Table'
import './ListPage.css'

function Suppliers() {
  const [suppliers, setSuppliers] = useState([])
  const [filteredSuppliers, setFilteredSuppliers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchSuppliers()
  }, [])

  useEffect(() => {
    const filtered = suppliers.filter(s =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.phone.includes(searchTerm)
    )
    setFilteredSuppliers(filtered)
  }, [suppliers, searchTerm])

  const fetchSuppliers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/suppliers')
      setSuppliers(response.data)
    } catch (error) {
      console.error('Error fetching suppliers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await axios.delete(`/api/suppliers/${id}`)
      fetchSuppliers()
    } catch (error) {
      alert('Error deleting supplier')
    }
  }

  const columns = [
    { key: 'name', label: 'Supplier Name', width: '200px' },
    { key: 'phone', label: 'Phone', width: '150px', render: v => v || 'N/A' },
    { key: 'email', label: 'Email', width: '200px', render: v => v || 'N/A' },
    { key: 'city', label: 'City', width: '120px', render: v => v || 'N/A' },
    { key: 'gstin', label: 'GSTIN', width: '150px', render: v => v || 'N/A' },
    { key: 'totalPurchases', label: 'Total Purchases ₹', width: '150px', render: v => v.toLocaleString() },
    {
      key: 'actions',
      label: 'Actions',
      width: '120px',
      render: (_, s) => (
        <div className="action-buttons">
          <button className="edit-btn" title="Edit">
            <Edit2 size={16} />
          </button>
          <button className="delete-btn" onClick={() => handleDelete(s._id)}>
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="list-page">
      <div className="page-header">
        <h1>Supplier Management</h1>
        <button className="btn-primary">
          <Plus size={20} />
          Add Supplier
        </button>
      </div>

      <div className="search-box">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Loading suppliers...</div>
      ) : (
        <Table columns={columns} data={filteredSuppliers} />
      )}
    </div>
  )
}

export default Suppliers
