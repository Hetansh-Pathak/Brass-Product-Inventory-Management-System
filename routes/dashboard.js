const express = require('express');
const Product = require('../models/Product');
const RawMaterial = require('../models/RawMaterial');
const Bill = require('../models/Bill');
const Transaction = require('../models/Transaction');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { handleFallback } = require('../middleware/fallback');

const router = express.Router();

// @route   GET /api/dashboard/overview
// @desc    Get dashboard overview statistics
// @access  Private
router.get('/overview', auth, async (req, res) => {
  try {
    // Check for fallback mode first
    const fallbackResult = handleFallback(req, res, 'dashboard');
    if (fallbackResult !== false) return;
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    // Product Statistics
    const productStats = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalProducts: { $sum: 1 },
          activeProducts: {
            $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] }
          },
          totalInventoryValue: {
            $sum: {
              $multiply: ['$inventory.quantity', '$pricing.costPrice']
            }
          },
          lowStockProducts: {
            $sum: {
              $cond: [
                { $lte: ['$inventory.quantity', '$inventory.reorderLevel'] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Raw Material Statistics
    const materialStats = await RawMaterial.aggregate([
      {
        $group: {
          _id: null,
          totalMaterials: { $sum: 1 },
          availableMaterials: {
            $sum: { $cond: [{ $eq: ['$status', 'available'] }, 1, 0] }
          },
          totalMaterialValue: {
            $sum: {
              $multiply: ['$inventory.quantity', '$pricing.costPrice']
            }
          },
          lowStockMaterials: {
            $sum: {
              $cond: [
                { $lte: ['$inventory.quantity', '$inventory.reorderLevel'] },
                1,
                0
              ]
            }
          }
        }
      }
    ]);

    // Bill Statistics
    const billStats = await Bill.aggregate([
      {
        $group: {
          _id: null,
          totalBills: { $sum: 1 },
          totalRevenue: { $sum: '$totals.finalAmount' },
          totalPaid: { $sum: '$payment.paidAmount' },
          totalPending: { $sum: '$payment.remainingAmount' },
          paidBills: {
            $sum: { $cond: [{ $eq: ['$payment.status', 'paid'] }, 1, 0] }
          },
          pendingBills: {
            $sum: { $cond: [{ $eq: ['$payment.status', 'pending'] }, 1, 0] }
          }
        }
      }
    ]);

    // Today's Bills
    const todaysBills = await Bill.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfDay, $lte: endOfDay }
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          revenue: { $sum: '$totals.finalAmount' }
        }
      }
    ]);

    // This Month's Bills
    const monthlyBills = await Bill.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth }
        }
      },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          revenue: { $sum: '$totals.finalAmount' }
        }
      }
    ]);

    // Recent Transactions
    const recentTransactions = await Transaction.find({
      status: 'completed'
    })
      .populate('item.itemId', 'productName materialName')
      .populate('createdBy', 'username')
      .sort({ createdAt: -1 })
      .limit(10);

    // Top Products by Sales
    const topProducts = await Bill.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          productName: { $first: '$items.productName' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: '$items.total' },
          salesCount: { $sum: 1 }
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 }
    ]);

    // Monthly Revenue Trend (Last 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

    const monthlyRevenue = await Bill.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: '$createdAt' },
            month: { $month: '$createdAt' }
          },
          totalRevenue: { $sum: '$totals.finalAmount' },
          totalPaid: { $sum: '$payment.paidAmount' },
          billCount: { $sum: 1 }
        }
      },
      {
        $sort: { '_id.year': 1, '_id.month': 1 }
      }
    ]);

    // User Activity
    const userStats = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 },
          activeUsers: {
            $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({
      products: productStats[0] || {
        totalProducts: 0,
        activeProducts: 0,
        totalInventoryValue: 0,
        lowStockProducts: 0
      },
      materials: materialStats[0] || {
        totalMaterials: 0,
        availableMaterials: 0,
        totalMaterialValue: 0,
        lowStockMaterials: 0
      },
      bills: billStats[0] || {
        totalBills: 0,
        totalRevenue: 0,
        totalPaid: 0,
        totalPending: 0,
        paidBills: 0,
        pendingBills: 0
      },
      todaysBills: todaysBills[0] || { count: 0, revenue: 0 },
      monthlyBills: monthlyBills[0] || { count: 0, revenue: 0 },
      recentTransactions,
      topProducts,
      monthlyRevenue,
      userStats
    });

  } catch (error) {
    console.error('Get dashboard overview error:', error);
    res.status(500).json({
      message: 'Error fetching dashboard overview',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/dashboard/alerts
// @desc    Get system alerts and notifications
// @access  Private
router.get('/alerts', auth, async (req, res) => {
  try {
    const alerts = [];

    // Low Stock Products
    const lowStockProducts = await Product.find({
      $expr: {
        $lte: ['$inventory.quantity', '$inventory.reorderLevel']
      }
    }).limit(10);

    lowStockProducts.forEach(product => {
      alerts.push({
        type: 'warning',
        category: 'inventory',
        title: 'Low Stock Alert',
        message: `${product.productName} is running low on stock (${product.inventory.quantity} ${product.inventory.unit} remaining)`,
        data: {
          productId: product._id,
          productName: product.productName,
          currentStock: product.inventory.quantity,
          reorderLevel: product.inventory.reorderLevel
        },
        createdAt: new Date()
      });
    });

    // Low Stock Raw Materials
    const lowStockMaterials = await RawMaterial.find({
      $expr: {
        $lte: ['$inventory.quantity', '$inventory.reorderLevel']
      }
    }).limit(10);

    lowStockMaterials.forEach(material => {
      alerts.push({
        type: 'warning',
        category: 'materials',
        title: 'Low Stock Alert',
        message: `${material.materialName} is running low on stock (${material.inventory.quantity} ${material.inventory.unit} remaining)`,
        data: {
          materialId: material._id,
          materialName: material.materialName,
          currentStock: material.inventory.quantity,
          reorderLevel: material.inventory.reorderLevel
        },
        createdAt: new Date()
      });
    });

    // Overdue Bills
    const overdueBills = await Bill.find({
      'payment.dueDate': { $lt: new Date() },
      'payment.status': { $in: ['pending', 'partial'] }
    }).limit(10);

    overdueBills.forEach(bill => {
      alerts.push({
        type: 'error',
        category: 'billing',
        title: 'Overdue Payment',
        message: `Payment for bill ${bill.billNumber} from ${bill.customer.name} is overdue`,
        data: {
          billId: bill._id,
          billNumber: bill.billNumber,
          customerName: bill.customer.name,
          dueDate: bill.payment.dueDate,
          remainingAmount: bill.payment.remainingAmount
        },
        createdAt: new Date()
      });
    });

    // Pending Transactions
    const pendingTransactions = await Transaction.find({
      status: 'pending'
    }).limit(5);

    pendingTransactions.forEach(transaction => {
      alerts.push({
        type: 'info',
        category: 'transactions',
        title: 'Pending Transaction',
        message: `${transaction.type} transaction for ${transaction.item.itemName} requires approval`,
        data: {
          transactionId: transaction._id,
          transactionNumber: transaction.transactionNumber,
          itemName: transaction.item.itemName,
          quantity: transaction.quantity
        },
        createdAt: transaction.createdAt
      });
    });

    // Sort alerts by priority and date
    alerts.sort((a, b) => {
      const priorityOrder = { error: 0, warning: 1, info: 2 };
      if (priorityOrder[a.type] !== priorityOrder[b.type]) {
        return priorityOrder[a.type] - priorityOrder[b.type];
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

    res.json({
      alerts: alerts.slice(0, 20), // Limit to 20 alerts
      counts: {
        total: alerts.length,
        error: alerts.filter(a => a.type === 'error').length,
        warning: alerts.filter(a => a.type === 'warning').length,
        info: alerts.filter(a => a.type === 'info').length
      }
    });

  } catch (error) {
    console.error('Get dashboard alerts error:', error);
    res.status(500).json({
      message: 'Error fetching dashboard alerts',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// @route   GET /api/dashboard/charts
// @desc    Get chart data for dashboard
// @access  Private
router.get('/charts', auth, async (req, res) => {
  try {
    const { period = '30' } = req.query;
    const days = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Sales Chart Data
    const salesData = await Bill.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: {
              format: '%Y-%m-%d',
              date: '$createdAt'
            }
          },
          revenue: { $sum: '$totals.finalAmount' },
          billCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // Category Revenue Distribution
    const categoryRevenue = await Bill.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: { $ne: 'cancelled' }
        }
      },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: '$product.category',
          revenue: { $sum: '$items.total' },
          quantity: { $sum: '$items.quantity' }
        }
      },
      { $sort: { revenue: -1 } }
    ]);

    // Stock Movement Chart
    const stockMovement = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: {
            date: {
              $dateToString: {
                format: '%Y-%m-%d',
                date: '$createdAt'
              }
            },
            type: '$type'
          },
          count: { $sum: 1 },
          totalValue: { $sum: '$totalValue' }
        }
      },
      { $sort: { '_id.date': 1 } }
    ]);

    // Payment Status Distribution
    const paymentDistribution = await Bill.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: '$payment.status',
          count: { $sum: 1 },
          totalAmount: { $sum: '$totals.finalAmount' }
        }
      }
    ]);

    res.json({
      salesData,
      categoryRevenue,
      stockMovement,
      paymentDistribution
    });

  } catch (error) {
    console.error('Get dashboard charts error:', error);
    res.status(500).json({
      message: 'Error fetching dashboard charts',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

module.exports = router;
