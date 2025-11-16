import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import './Form.css'

function ProductForm({ product, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    category: 'Raw Material',
    description: '',
    uom: 'PCS',
    purchasePrice: 0,
    sellingPrice: 0,
    gstPercent: 18,
    openingStock: 0,
    minStockLevel: 10,
    brassType: '',
    weightPerUnit: '',
    imageUrl: ''
  })

  useEffect(() => {
    if (product) {
      setFormData(product)
    }
  }, [product])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'purchasePrice' || name === 'sellingPrice' || name === 'gstPercent' || name === 'openingStock' || name === 'minStockLevel' ? parseFloat(value) : value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="form-overlay">
      <div className="form-modal">
        <div className="form-header">
          <h2>{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button className="close-btn" onClick={onCancel}>
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="product-form">
          <div className="form-group">
            <label>Product Name *</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter product name"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>SKU *</label>
              <input
                type="text"
                name="sku"
                value={formData.sku}
                onChange={handleChange}
                required
                placeholder="e.g., HEX-25"
              />
            </div>
            <div className="form-group">
              <label>Category *</label>
              <select name="category" value={formData.category} onChange={handleChange}>
                <option>Raw Material</option>
                <option>Components</option>
                <option>Finished Goods</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter product description"
              rows="3"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Unit of Measurement *</label>
              <select name="uom" value={formData.uom} onChange={handleChange}>
                <option>PCS</option>
                <option>KG</option>
                <option>SET</option>
                <option>LOT</option>
                <option>METER</option>
                <option>CUSTOM</option>
              </select>
            </div>
            <div className="form-group">
              <label>Brass Type</label>
              <input
                type="text"
                name="brassType"
                value={formData.brassType}
                onChange={handleChange}
                placeholder="e.g., Forged, Extruded"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Purchase Price ₹ *</label>
              <input
                type="number"
                name="purchasePrice"
                value={formData.purchasePrice}
                onChange={handleChange}
                required
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Selling Price ₹ *</label>
              <input
                type="number"
                name="sellingPrice"
                value={formData.sellingPrice}
                onChange={handleChange}
                required
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>GST % *</label>
              <input
                type="number"
                name="gstPercent"
                value={formData.gstPercent}
                onChange={handleChange}
                step="0.01"
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Opening Stock</label>
              <input
                type="number"
                name="openingStock"
                value={formData.openingStock}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Minimum Stock Level</label>
              <input
                type="number"
                name="minStockLevel"
                value={formData.minStockLevel}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Weight per Unit</label>
              <input
                type="number"
                name="weightPerUnit"
                value={formData.weightPerUnit}
                onChange={handleChange}
                step="0.01"
              />
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="btn-cancel" onClick={onCancel}>
              Cancel
            </button>
            <button type="submit" className="btn-submit">
              {product ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductForm
