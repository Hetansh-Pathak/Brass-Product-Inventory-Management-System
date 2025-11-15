# Brass Inventory & Billing System - MERN Stack

A complete, professional-grade inventory management and billing solution for brass product businesses.

## 🚀 Quick Start

The application is pre-configured and running:
- **Backend API**: http://localhost:5000/api
- **Frontend UI**: http://localhost:5000
- **Health Check**: http://localhost:5000/api/health

## 📋 Project Structure

```
├── backend/
│   ├── models/                 # MongoDB schemas
│   ├── routes/                 # API endpoints
│   ├── server.js              # Express server
│   └── package.json           # Backend dependencies
├── frontend/
│   ├── src/
│   │   ├── components/        # Reusable React components
│   │   ├── pages/            # Page components
│   │   └── App.jsx           # Main app component
│   ├── dist/                 # Built frontend files
│   └── package.json          # Frontend dependencies
└── package.json              # Root configuration
```

## ✨ Features Implemented

### 1. **Dashboard**
- Real-time stock statistics
- Sales and purchase trends
- Low stock alerts
- Quick summary cards

### 2. **Product Management (Item Master)**
- Add, edit, delete products
- Product fields: Name, SKU, Category, UOM, Prices, GST%, Stock levels
- Stock tracking
- Product search and filtering

### 3. **Inventory Management**
- Stock-In operations (purchases)
- Stock-Out operations (sales)
- Inventory ledger
- Stock reports
- Low stock alerts
- Stock valuation

### 4. **Purchase Management**
- Record purchase orders
- Track supplier details
- Auto stock update
- Purchase history
- Payment tracking

### 5. **Sales & Billing (GST Invoices)**
- Create tax invoices
- GST calculations (CGST/SGST/IGST)
- Multiple invoice types (Tax Invoice, Estimate, Delivery Challan, Credit Note)
- Payment status tracking
- Auto stock deduction

### 6. **Customer Management**
- Customer database
- Sales tracking
- Outstanding balance
- Contact management

### 7. **Supplier Management**
- Supplier database
- Purchase history
- Outstanding balance
- Payment terms

### 8. **Reports Module**
- Sales reports
- Purchase reports
- Stock valuation reports
- GST reports
- Profit & Loss analysis
- Exportable reports

## 🎨 UI/UX Features

- **Modern Admin Panel**: Clean, professional interface
- **Responsive Design**: Works on desktop and mobile
- **Dark Mode**: Built-in dark mode toggle
- **Advanced CSS**: Gradient backgrounds, smooth animations, modern components
- **Interactive Charts**: Sales trends, profit analysis visualizations
- **Data Tables**: Sortable, searchable, with pagination
- **Form Validation**: User-friendly form inputs
- **Status Badges**: Visual indicators for stock and payment status

## 🗄️ Database Setup (MongoDB)

The system uses MongoDB for data storage. To enable database features:

### Option 1: Local MongoDB
```bash
# Install MongoDB Community Edition
# Start MongoDB service
mongod

# The app will auto-connect to mongodb://localhost:27017/brass-inventory
```

### Option 2: Cloud MongoDB (Atlas)
```bash
# Set environment variable
export MONGODB_URI="mongodb+srv://username:password@cluster.mongodb.net/brass-inventory"

# Or update backend/.env file
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/brass-inventory
```

### Option 3: Docker
```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🛠️ Development

### Start Development Server
```bash
# The server should be running automatically at port 5000

# To manually restart:
cd backend
npm run dev

# To rebuild frontend:
cd frontend
npm run build
```

### Install Dependencies (if needed)
```bash
# Root level
npm run install-all

# Backend only
cd backend && npm install

# Frontend only  
cd frontend && npm install
```

## 🔧 API Endpoints

### Products
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Inventory
- `GET /api/inventory/stock-report` - Stock report
- `GET /api/inventory/low-stock` - Low stock items
- `POST /api/inventory/stock-in` - Add stock
- `POST /api/inventory/stock-out` - Remove stock
- `POST /api/inventory/adjust` - Adjust stock

### Purchases
- `GET /api/purchases` - Get all purchases
- `POST /api/purchases` - Create purchase
- `PUT /api/purchases/:id` - Update purchase
- `DELETE /api/purchases/:id` - Delete purchase

### Invoices
- `GET /api/invoices` - Get all invoices
- `POST /api/invoices` - Create invoice
- `PUT /api/invoices/:id` - Update invoice
- `DELETE /api/invoices/:id` - Delete invoice

### Dashboard
- `GET /api/dashboard/stats` - Dashboard statistics
- `GET /api/dashboard/recent` - Recent transactions

### Reports
- `GET /api/reports/sales` - Sales report
- `GET /api/reports/purchase` - Purchase report
- `GET /api/reports/stock-valuation` - Stock valuation
- `GET /api/reports/gst` - GST report
- `GET /api/reports/profit-loss` - Profit & Loss
- `GET /api/reports/stock-ledger` - Stock ledger

### Customers
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer

### Suppliers
- `GET /api/suppliers` - Get all suppliers
- `POST /api/suppliers` - Create supplier
- `PUT /api/suppliers/:id` - Update supplier
- `DELETE /api/suppliers/:id` - Delete supplier

## 📊 Data Models

### Product
```javascript
{
  name, sku, category, uom,
  purchasePrice, sellingPrice,
  gstPercent, openingStock,
  currentStock, minStockLevel,
  imageUrl, brassType, weightPerUnit
}
```

### Invoice
```javascript
{
  invoiceNo, customerId, date,
  invoiceType, items[], subtotal,
  discount, cgst, sgst, igst,
  totalAmount, paymentStatus
}
```

### Purchase
```javascript
{
  billNo, supplierId, date,
  items[], subtotal, gstAmount,
  additionalCharges, totalAmount,
  paymentMode, paymentStatus
}
```

## 🔐 Next Steps / Future Enhancements

1. **Authentication & Authorization**
   - User login system
   - Role-based access control
   - Admin panel security

2. **Payment Gateway Integration**
   - Stripe/Razorpay integration
   - Online invoice payments

3. **Advanced Features**
   - Barcode/QR scanning
   - Multi-warehouse support
   - Batch/Lot tracking
   - FIFO/Weighted average valuation
   - Auto e-invoice generation

4. **Export & Import**
   - CSV/Excel import
   - PDF export for reports
   - Bulk product import

5. **Notifications**
   - Low stock email alerts
   - WhatsApp invoice sharing
   - Payment reminders

6. **Analytics**
   - Advanced dashboards
   - Predictive analytics
   - Seasonal trends

## 🐛 Troubleshooting

### Backend not connecting to MongoDB?
- Check if MongoDB service is running
- Verify MONGODB_URI in backend/.env
- Check port 27017 is not blocked

### Frontend showing errors?
- Clear browser cache (Ctrl+Shift+Delete)
- Rebuild frontend: `cd frontend && npm run build`
- Check browser console for errors

### API calls failing?
- Verify backend is running: `curl http://localhost:5000/api/health`
- Check CORS settings in backend/server.js
- Ensure API endpoint is correct

## 📝 Configuration Files

- `.env.example` - Environment variables template
- `backend/.env` - Backend configuration
- `vite.config.js` - Frontend build configuration
- `package.json` - Root package configuration

## 🎯 Key Technologies

- **Frontend**: React 18, Vite, React Router, Recharts, Lucide Icons
- **Backend**: Express.js, Node.js, Mongoose
- **Database**: MongoDB
- **Styling**: Advanced CSS, CSS Grid, Flexbox
- **State Management**: React Hooks
- **HTTP Client**: Axios

## 📞 Support

For issues or questions:
1. Check the API endpoints documentation above
2. Review MongoDB connection settings
3. Inspect browser console for errors
4. Check backend logs for server errors

## 📄 License

This is a proprietary system for Brass Industries.
