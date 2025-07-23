const mongoose = require('mongoose');

// Mock data for development when DB is not available
const mockUsers = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@brassindustries.com',
    role: 'admin',
    preferences: { theme: 'light', language: 'en', notifications: { email: true, push: true } },
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  },
  {
    id: '2',
    username: 'manager',
    email: 'manager@brassindustries.com',
    role: 'manager',
    preferences: { theme: 'light', language: 'en', notifications: { email: true, push: true } },
    isActive: true,
    createdAt: new Date().toISOString(),
    lastLogin: new Date().toISOString()
  }
];

const mockProducts = [
  {
    id: '1',
    productName: 'Brass Rod 10mm',
    description: 'High-quality brass rod suitable for industrial applications',
    category: 'Rods',
    hsnCode: '74031100',
    productCode: 'BR-001',
    supplier: { 
      name: 'ABC Metals Ltd', 
      contact: { phone: '+1-234-567-8901', email: 'sales@abcmetals.com' }
    },
    specifications: {
      dimensions: { diameter: 10, length: 1000, unit: 'mm' },
      weight: { value: 0.62, unit: 'kg' },
      material: 'Brass C360',
      grade: 'Commercial',
      finish: 'Mill Finish'
    },
    inventory: { quantity: 150, unit: 'pieces', reorderLevel: 20, location: { warehouse: 'A', section: '1', shelf: 'A1' } },
    pricing: { costPrice: 12.50, sellingPrice: 18.75, currency: 'USD' },
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '2',
    productName: 'Brass Sheet 2mm',
    description: 'Premium brass sheet for precision manufacturing',
    category: 'Sheets',
    hsnCode: '74031200',
    productCode: 'BS-001',
    supplier: { 
      name: 'XYZ Copper Co', 
      contact: { phone: '+1-234-567-8902', email: 'orders@xyzcopper.com' }
    },
    specifications: {
      dimensions: { length: 1000, width: 500, thickness: 2, unit: 'mm' },
      weight: { value: 8.5, unit: 'kg' },
      material: 'Brass C260',
      grade: 'Premium',
      finish: 'Polished'
    },
    inventory: { quantity: 8, unit: 'sheets', reorderLevel: 15, location: { warehouse: 'A', section: '2', shelf: 'B1' } },
    pricing: { costPrice: 45.00, sellingPrice: 67.50, currency: 'USD' },
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  },
  {
    id: '3',
    productName: 'Brass Pipe 25mm',
    description: 'Heavy-duty brass pipe for plumbing applications',
    category: 'Pipes',
    hsnCode: '74031300',
    productCode: 'BP-001',
    supplier: { 
      name: 'PipeWorks Inc', 
      contact: { phone: '+1-234-567-8903', email: 'sales@pipeworks.com' }
    },
    specifications: {
      dimensions: { diameter: 25, length: 3000, unit: 'mm' },
      weight: { value: 2.1, unit: 'kg' },
      material: 'Brass C385',
      grade: 'Industrial',
      finish: 'Anodized'
    },
    inventory: { quantity: 0, unit: 'pieces', reorderLevel: 10, location: { warehouse: 'B', section: '1', shelf: 'C1' } },
    pricing: { costPrice: 28.00, sellingPrice: 42.00, currency: 'USD' },
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

const mockRawMaterials = [
  {
    id: '1',
    materialName: 'Copper Cathode',
    category: 'Base Metal',
    supplier: { name: 'Global Copper Ltd', contact: { phone: '+1-555-0101' } },
    composition: [
      { element: 'Copper', percentage: 99.95 },
      { element: 'Impurities', percentage: 0.05 }
    ],
    inventory: { quantity: 500, unit: 'kg', reorderLevel: 100 },
    pricing: { costPrice: 8.50, currency: 'USD' },
    qualityCheck: { purity: 99.95, grade: 'A1', certified: true },
    status: 'available',
    createdAt: new Date().toISOString()
  }
];

const mockBills = [
  {
    id: '1',
    billNumber: 'INV-2024-001',
    customer: { name: 'Johnson Manufacturing', email: 'orders@johnson.com', phone: '+1-555-0201' },
    items: [
      { product: mockProducts[0], quantity: 10, unitPrice: 18.75, total: 187.50 },
      { product: mockProducts[1], quantity: 2, unitPrice: 67.50, total: 135.00 }
    ],
    totals: { subtotal: 322.50, tax: 32.25, discount: 0, grandTotal: 354.75 },
    payment: { method: 'credit', status: 'pending', dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() },
    status: 'draft',
    createdAt: new Date().toISOString()
  }
];

// Middleware to check database connection and provide fallback
const fallbackMiddleware = (req, res, next) => {
  // Check if MongoDB is connected
  const isDBConnected = mongoose.connection.readyState === 1;
  
  if (!isDBConnected && process.env.NODE_ENV === 'development') {
    // Add fallback data to request
    req.fallbackMode = true;
    req.mockData = {
      users: mockUsers,
      products: mockProducts,
      rawMaterials: mockRawMaterials,
      bills: mockBills
    };
    
    // Add warning header
    res.setHeader('X-Fallback-Mode', 'true');
    res.setHeader('X-Fallback-Reason', 'Database not connected');
  }
  
  next();
};

// Helper function to handle fallback responses
const handleFallback = (req, res, operation, data = null) => {
  if (req.fallbackMode) {
    const fallbackResponse = {
      message: 'Development mode - using mock data',
      fallbackMode: true,
      data: data || req.mockData,
      note: 'This is mock data. Connect to MongoDB for real data operations.'
    };
    
    switch (operation) {
      case 'login':
        const { email, password } = req.body;
        const user = req.mockData.users.find(u => u.email === email);
        if (user && password) {
          return res.json({
            message: 'Login successful (mock)',
            token: 'dev-token-' + Date.now(),
            user,
            fallbackMode: true
          });
        }
        return res.status(401).json({ message: 'Invalid credentials (mock)' });
        
      case 'register':
        const newUser = {
          id: (Date.now()).toString(),
          username: req.body.username,
          email: req.body.email,
          role: req.body.role || 'employee',
          preferences: { theme: 'light', language: 'en', notifications: { email: true, push: true } },
          isActive: true,
          createdAt: new Date().toISOString()
        };
        return res.status(201).json({
          message: 'User registered successfully (mock)',
          token: 'dev-token-' + Date.now(),
          user: newUser,
          fallbackMode: true
        });
        
      case 'products':
        return res.json({
          products: req.mockData.products,
          totalPages: 1,
          currentPage: 1,
          total: req.mockData.products.length,
          lowStockCount: req.mockData.products.filter(p => p.inventory.quantity <= p.inventory.reorderLevel).length,
          fallbackMode: true
        });
        
      case 'dashboard':
        const stats = {
          products: {
            totalProducts: req.mockData.products.length,
            activeProducts: req.mockData.products.filter(p => p.status === 'active').length,
            lowStockProducts: req.mockData.products.filter(p => p.inventory.quantity <= p.inventory.reorderLevel).length,
            outOfStockProducts: req.mockData.products.filter(p => p.inventory.quantity === 0).length,
            totalInventoryValue: req.mockData.products.reduce((sum, p) => sum + (p.inventory.quantity * p.pricing.costPrice), 0)
          },
          bills: {
            totalBills: req.mockData.bills.length,
            totalRevenue: req.mockData.bills.reduce((sum, b) => sum + b.totals.grandTotal, 0),
            paidBills: req.mockData.bills.filter(b => b.payment.status === 'paid').length,
            pendingBills: req.mockData.bills.filter(b => b.payment.status === 'pending').length
          },
          materials: {
            totalMaterials: req.mockData.rawMaterials.length,
            availableMaterials: req.mockData.rawMaterials.filter(m => m.status === 'available').length
          }
        };
        return res.json({ ...stats, fallbackMode: true });
        
      default:
        return res.json(fallbackResponse);
    }
  }
  return false; // Not in fallback mode
};

module.exports = { fallbackMiddleware, handleFallback };
