import { useState } from 'react'
import { X } from 'lucide-react'
import './Form.css'

function StockModal({ type, onSubmit, onCancel, products }) {
  const [formData, setFormData] = useState({
    productId: '',
    quantity: 0,
    rate: 0,
    reason: '',
    notes: ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'quantity' || name === 'rate' ? parseFloat(value) : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!formData.productId) {
      alert('Please select a product')
      return
    }
    onSubmit(formData)
  }

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h2>{type === 'in' ? 'Stock In' : 'Stock Out'}</h2>
          <button className="close-btn" onClick={onCancel}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Product *</label>
            <select
              name="productId"
              value={formData.productId}
              onChange={handleChange}
              required
            >
              <option value="">Select a product</option>
              {products.map(p => (
                <option key={p._id} value={p._id}>
                  {p.name} (Stock: {p.currentStock})
                </option>
              ))}
            </select>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Quantity *</label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                required
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Rate ₹</label>
              <input
                type="number"
                name="rate"
                value={formData.rate}
                onChange={handleChange}
                step="0.01"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Reason</label>
            <input
              type="text"
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder={type === 'in' ? 'e.g., Purchase' : 'e.g., Invoice'}
            />
          </div>

          <div className="form-group">
            <label>Notes</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any additional notes"
              rows="3"
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {type === 'in' ? 'Add Stock' : 'Remove Stock'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default StockModal
