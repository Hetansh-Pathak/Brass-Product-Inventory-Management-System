import { useState, useEffect } from 'react'
import axios from 'axios'
import { Plus, Edit2, Trash2, Search } from 'lucide-react'
import ProductForm from '../components/ProductForm'
import Table from '../components/Table'
import './ProductsPage.css'

function Products() {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    const filtered = products.filter(p =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
    )
    setFilteredProducts(filtered)
  }, [products, searchTerm])

  const fetchProducts = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/products')
      setProducts(response.data)
    } catch (error) {
      console.error('Error fetching products:', error)
      // Use mock data if API fails
      setProducts([
        { _id: '1', name: 'Brass Rod 10mm', sku: 'BR-10', category: 'Raw Material', uom: 'KG', purchasePrice: 450, sellingPrice: 550, currentStock: 100, gstPercent: 18 },
        { _id: '2', name: 'Brass Sheet 5mm', sku: 'BS-05', category: 'Raw Material', uom: 'KG', purchasePrice: 500, sellingPrice: 600, currentStock: 50, gstPercent: 18 },
        { _id: '3', name: 'Brass Fitting', sku: 'BF-01', category: 'Components', uom: 'PCS', purchasePrice: 80, sellingPrice: 120, currentStock: 200, gstPercent: 18 }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAddProduct = async (productData) => {
    try {
      if (editingProduct) {
        await axios.put(`/api/products/${editingProduct._id}`, productData)
      } else {
        await axios.post('/api/products', productData)
      }
      fetchProducts()
      setShowForm(false)
      setEditingProduct(null)
    } catch (error) {
      console.error('Error saving product:', error)
      alert('Error saving product')
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return

    try {
      await axios.delete(`/api/products/${id}`)
      fetchProducts()
    } catch (error) {
      console.error('Error deleting product:', error)
      alert('Error deleting product')
    }
  }

  const columns = [
    { key: 'name', label: 'Product Name', width: '200px' },
    { key: 'sku', label: 'SKU', width: '120px' },
    { key: 'category', label: 'Category', width: '150px' },
    { key: 'uom', label: 'Unit', width: '80px' },
    { key: 'purchasePrice', label: 'Purchase Price', width: '130px', render: v => `₹${v}` },
    { key: 'sellingPrice', label: 'Selling Price', width: '130px', render: v => `₹${v}` },
    { key: 'currentStock', label: 'Stock', width: '80px' },
    {
      key: 'actions',
      label: 'Actions',
      width: '150px',
      render: (_, product) => (
        <div className="action-buttons">
          <button
            className="edit-btn"
            onClick={() => {
              setEditingProduct(product)
              setShowForm(true)
            }}
          >
            <Edit2 size={16} />
          </button>
          <button
            className="delete-btn"
            onClick={() => handleDeleteProduct(product._id)}
          >
            <Trash2 size={16} />
          </button>
        </div>
      )
    }
  ]

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Product Management</h1>
        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {showForm && (
        <ProductForm
          product={editingProduct}
          onSubmit={handleAddProduct}
          onCancel={() => {
            setShowForm(false)
            setEditingProduct(null)
          }}
        />
      )}

      <div className="search-box">
        <Search size={20} />
        <input
          type="text"
          placeholder="Search by name or SKU..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="loading">Loading products...</div>
      ) : (
        <Table columns={columns} data={filteredProducts} />
      )}
    </div>
  )
}

export default Products
