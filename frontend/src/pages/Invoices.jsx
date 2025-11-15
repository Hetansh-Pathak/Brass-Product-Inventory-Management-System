import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, FileText, Trash2, Search, Download } from 'lucide-react'
import Table from '../components/Table'
import './ListPage.css'

function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [filteredInvoices, setFilteredInvoices] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchInvoices()
  }, [])

  useEffect(() => {
    const filtered = invoices.filter(inv =>
      inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredInvoices(filtered)
  }, [invoices, searchTerm])

  const fetchInvoices = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/invoices')
      setInvoices(response.data)
    } catch (error) {
      console.error('Error fetching invoices:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return
    try {
      await axios.delete(`/api/invoices/${id}`)
      fetchInvoices()
    } catch (error) {
      alert('Error deleting invoice')
    }
  }

  const columns = [
    { key: 'invoiceNo', label: 'Invoice No', width: '130px' },
    {
      key: 'customerId',
      label: 'Customer',
      width: '200px',
      render: (_, inv) => inv.customerId?.name || 'N/A'
    },
    {
      key: 'date',
      label: 'Date',
      width: '120px',
      render: v => new Date(v).toLocaleDateString()
    },
    { key: 'invoiceType', label: 'Type', width: '120px' },
    { key: 'totalAmount', label: 'Total Amount ₹', width: '150px', render: v => v.toLocaleString() },
    {
      key: 'paymentStatus',
      label: 'Payment',
      width: '120px',
      render: v => <span className={`status-badge ${v === 'Paid' ? 'success' : v === 'Unpaid' ? 'danger' : 'warning'}`}>{v}</span>
    },
    {
      key: 'actions',
      label: 'Actions',
      width: '150px',
      render: (_, inv) => (
        <div className="action-buttons">
          <button className="edit-btn" title="View">
            <FileText size={16} />
          </button>
          <button className="edit-btn" title="Download">
            <Download size={16} />
          </button>
          <button className="delete-btn" onClick={() => handleDelete(inv._id)}>
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="list-page">
      <div className="page-header">
        <h1>Sales & Billing</h1>
        <button className="btn-primary">
          <Plus size={20} />
          Create Invoice
        </button>
      </div>

      <div className="search-box">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search by invoice number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Loading invoices...</div>
      ) : (
        <Table columns={columns} data={filteredInvoices} />
      )}
    </div>
  )
}

export default Invoices
