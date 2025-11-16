// Local storage service for persistent data
class DataStorage {
  constructor() {
    this.products = JSON.parse(localStorage.getItem('brass_products')) || this.getDefaultProducts()
    this.customers = JSON.parse(localStorage.getItem('brass_customers')) || this.getDefaultCustomers()
    this.suppliers = JSON.parse(localStorage.getItem('brass_suppliers')) || this.getDefaultSuppliers()
    this.purchases = JSON.parse(localStorage.getItem('brass_purchases')) || []
    this.invoices = JSON.parse(localStorage.getItem('brass_invoices')) || []
    this.inventoryLedger = JSON.parse(localStorage.getItem('brass_inventory_ledger')) || []
  }

  getDefaultProducts() {
    return [
      { _id: '1', name: 'Brass Rod 10mm', sku: 'BR-10', category: 'Raw Material', uom: 'KG', purchasePrice: 450, sellingPrice: 550, currentStock: 100, minStockLevel: 20, gstPercent: 18 },
      { _id: '2', name: 'Brass Sheet 5mm', sku: 'BS-05', category: 'Raw Material', uom: 'KG', purchasePrice: 500, sellingPrice: 600, currentStock: 50, minStockLevel: 30, gstPercent: 18 },
      { _id: '3', name: 'Brass Fitting', sku: 'BF-01', category: 'Components', uom: 'PCS', purchasePrice: 80, sellingPrice: 120, currentStock: 200, minStockLevel: 50, gstPercent: 18 }
    ]
  }

  getDefaultCustomers() {
    return [
      { _id: '1', name: 'Customer A', phone: '9876543210', email: 'customerA@example.com', city: 'Ahmedabad', gstin: '27XXXXX', totalSales: 0 },
      { _id: '2', name: 'Customer B', phone: '9876543211', email: 'customerB@example.com', city: 'Surat', gstin: '27XXXXX', totalSales: 0 }
    ]
  }

  getDefaultSuppliers() {
    return [
      { _id: '1', name: 'Supplier A', phone: '9876543220', email: 'supplierA@example.com', city: 'Mumbai', gstin: '27XXXXX', totalPurchases: 0 },
      { _id: '2', name: 'Supplier B', phone: '9876543221', email: 'supplierB@example.com', city: 'Delhi', gstin: '27XXXXX', totalPurchases: 0 }
    ]
  }

  // Product operations
  getProducts() {
    return this.products
  }

  addProduct(product) {
    const newProduct = { ...product, _id: Date.now().toString() }
    this.products.push(newProduct)
    this.save()
    return newProduct
  }

  updateProduct(id, updatedData) {
    const index = this.products.findIndex(p => p._id === id)
    if (index !== -1) {
      this.products[index] = { ...this.products[index], ...updatedData }
      this.save()
      return this.products[index]
    }
    return null
  }

  deleteProduct(id) {
    this.products = this.products.filter(p => p._id !== id)
    this.save()
    return true
  }

  // Customer operations
  getCustomers() {
    return this.customers
  }

  addCustomer(customer) {
    const newCustomer = { ...customer, _id: Date.now().toString(), totalSales: 0 }
    this.customers.push(newCustomer)
    this.save()
    return newCustomer
  }

  updateCustomer(id, updatedData) {
    const index = this.customers.findIndex(c => c._id === id)
    if (index !== -1) {
      this.customers[index] = { ...this.customers[index], ...updatedData }
      this.save()
      return this.customers[index]
    }
    return null
  }

  deleteCustomer(id) {
    this.customers = this.customers.filter(c => c._id !== id)
    this.save()
    return true
  }

  // Supplier operations
  getSuppliers() {
    return this.suppliers
  }

  addSupplier(supplier) {
    const newSupplier = { ...supplier, _id: Date.now().toString(), totalPurchases: 0 }
    this.suppliers.push(newSupplier)
    this.save()
    return newSupplier
  }

  updateSupplier(id, updatedData) {
    const index = this.suppliers.findIndex(s => s._id === id)
    if (index !== -1) {
      this.suppliers[index] = { ...this.suppliers[index], ...updatedData }
      this.save()
      return this.suppliers[index]
    }
    return null
  }

  deleteSupplier(id) {
    this.suppliers = this.suppliers.filter(s => s._id !== id)
    this.save()
    return true
  }

  // Invoice operations
  getInvoices() {
    return this.invoices
  }

  addInvoice(invoice) {
    const newInvoice = { ...invoice, _id: Date.now().toString() }
    this.invoices.push(newInvoice)
    this.save()
    return newInvoice
  }

  deleteInvoice(id) {
    this.invoices = this.invoices.filter(inv => inv._id !== id)
    this.save()
    return true
  }

  // Purchase operations
  getPurchases() {
    return this.purchases
  }

  addPurchase(purchase) {
    const newPurchase = { ...purchase, _id: Date.now().toString() }
    this.purchases.push(newPurchase)
    this.save()
    return newPurchase
  }

  deletePurchase(id) {
    this.purchases = this.purchases.filter(p => p._id !== id)
    this.save()
    return true
  }

  // Dashboard stats
  getDashboardStats() {
    const totalItems = this.products.reduce((sum, p) => sum + p.currentStock, 0)
    const totalStockValue = this.products.reduce((sum, p) => sum + (p.currentStock * p.purchasePrice), 0)
    const lowStockCount = this.products.filter(p => p.currentStock <= p.minStockLevel).length
    const totalSalesAmount = this.invoices.reduce((sum, inv) => sum + (inv.totalAmount || 0), 0)
    const totalPurchaseAmount = this.purchases.reduce((sum, p) => sum + (p.totalAmount || 0), 0)

    return {
      totalItems,
      totalStockValue,
      lowStockCount,
      todaySalesCount: this.invoices.length,
      todaysSalesAmount: totalSalesAmount,
      todayPurchaseCount: this.purchases.length,
      todaysPurchaseAmount: totalPurchaseAmount,
      productCount: this.products.length,
      customerCount: this.customers.length,
      supplierCount: this.suppliers.length
    }
  }

  // Save to localStorage
  save() {
    localStorage.setItem('brass_products', JSON.stringify(this.products))
    localStorage.setItem('brass_customers', JSON.stringify(this.customers))
    localStorage.setItem('brass_suppliers', JSON.stringify(this.suppliers))
    localStorage.setItem('brass_purchases', JSON.stringify(this.purchases))
    localStorage.setItem('brass_invoices', JSON.stringify(this.invoices))
    localStorage.setItem('brass_inventory_ledger', JSON.stringify(this.inventoryLedger))
  }

  // Clear all data
  clearAll() {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      this.products = this.getDefaultProducts()
      this.customers = this.getDefaultCustomers()
      this.suppliers = this.getDefaultSuppliers()
      this.purchases = []
      this.invoices = []
      this.inventoryLedger = []
      this.save()
      return true
    }
    return false
  }
}

export default new DataStorage()
