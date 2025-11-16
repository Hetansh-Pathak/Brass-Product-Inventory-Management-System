import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Edit2, Trash2, Search, Phone, Mail } from 'lucide-react'
import Table from '../components/Table'
import './ListPage.css'

function Customers() {
  const [customers, setCustomers] = useState([])
  const [filteredCustomers, setFilteredCustomers] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCustomers()
  }, [])

  useEffect(() => {
    const filtered = customers.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.phone.includes(searchTerm)
    )
    setFilteredCustomers(filtered)
  }, [customers, searchTerm])

  const fetchCustomers = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/customers')
      setCustomers(response.data)
    } catch (error) {
      console.error('Error fetching customers:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await axios.delete(`/api/customers/${id}`)
      fetchCustomers()
    } catch (error) {
      alert('Error deleting customer')
    }
  }

  const columns = [
    { key: 'name', label: 'Customer Name', width: '200px' },
    { key: 'phone', label: 'Phone', width: '150px', render: v => v || 'N/A' },
    { key: 'email', label: 'Email', width: '200px', render: v => v || 'N/A' },
    { key: 'city', label: 'City', width: '120px', render: v => v || 'N/A' },
    { key: 'gstin', label: 'GSTIN', width: '150px', render: v => v || 'N/A' },
    { key: 'totalSales', label: 'Total Sales ₹', width: '150px', render: v => v.toLocaleString() },
    {
      key: 'actions',
      label: 'Actions',
      width: '120px',
      render: (_, c) => (
        <div className="action-buttons">
          <button className="edit-btn" title="Edit">
            <Edit2 size={16} />
          </button>
          <button className="delete-btn" onClick={() => handleDelete(c._id)}>
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="list-page">
      <div className="page-header">
        <h1>Customer Management</h1>
        <button className="btn-primary">
          <Plus size={20} />
          Add Customer
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
        <div className="loading">Loading customers...</div>
      ) : (
        <Table columns={columns} data={filteredCustomers} />
      )}
    </div>
  )
}

export default Customers
