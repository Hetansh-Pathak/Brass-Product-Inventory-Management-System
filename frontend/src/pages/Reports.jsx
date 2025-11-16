import { useState, useEffect } from 'react'
import axios from 'axios'
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { Download, Filter } from 'lucide-react'
import './Reports.css'

function Reports() {
  const [reportType, setReportType] = useState('sales')
  const [reportData, setReportData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => {
    fetchReport()
  }, [reportType, startDate, endDate])

  const fetchReport = async () => {
    try {
      setLoading(true)
      let url = `/api/reports/${reportType}`
      if (startDate && endDate) {
        url += `?startDate=${startDate}&endDate=${endDate}`
      }
      const response = await axios.get(url)
      setReportData(response.data)
    } catch (error) {
      console.error('Error fetching report:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleExport = () => {
    const element = document.createElement('a')
    const file = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' })
    element.href = URL.createObjectURL(file)
    element.download = `${reportType}-report.json`
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const renderChart = () => {
    if (!reportData) return null

    switch (reportType) {
      case 'sales':
        return (
          <div className="chart-container">
            <h3>Sales Trend</h3>
            <div className="summary-cards">
              <div className="summary-item">
                <span>Total Sales</span>
                <strong>₹{reportData.totalSales?.toLocaleString() || 0}</strong>
              </div>
              <div className="summary-item">
                <span>Invoices</span>
                <strong>{reportData.invoiceCount || 0}</strong>
              </div>
              <div className="summary-item">
                <span>Total Items</span>
                <strong>{reportData.totalItems || 0}</strong>
              </div>
            </div>
          </div>
        )
      case 'purchase':
        return (
          <div className="chart-container">
            <h3>Purchase Summary</h3>
            <div className="summary-cards">
              <div className="summary-item">
                <span>Total Purchases</span>
                <strong>₹{reportData.totalPurchases?.toLocaleString() || 0}</strong>
              </div>
              <div className="summary-item">
                <span>Purchase Orders</span>
                <strong>{reportData.purchaseCount || 0}</strong>
              </div>
              <div className="summary-item">
                <span>Total Items</span>
                <strong>{reportData.totalItems || 0}</strong>
              </div>
            </div>
          </div>
        )
      case 'profit-loss':
        return (
          <div className="chart-container">
            <h3>Profit & Loss Statement</h3>
            <div className="summary-cards">
              <div className="summary-item">
                <span>Total Sales</span>
                <strong className="positive">₹{reportData.totalSales?.toLocaleString() || 0}</strong>
              </div>
              <div className="summary-item">
                <span>Purchase Cost</span>
                <strong className="negative">₹{reportData.totalPurchaseCost?.toLocaleString() || 0}</strong>
              </div>
              <div className="summary-item">
                <span>Profit/Loss</span>
                <strong className={reportData.profit >= 0 ? 'positive' : 'negative'}>₹{reportData.profit?.toLocaleString() || 0}</strong>
              </div>
              <div className="summary-item">
                <span>Profit Margin</span>
                <strong>{reportData.profitMargin?.toFixed(2) || 0}%</strong>
              </div>
            </div>
          </div>
        )
      case 'gst':
        return (
          <div className="chart-container">
            <h3>GST Report</h3>
            <div className="summary-cards">
              <div className="summary-item">
                <span>CGST</span>
                <strong>₹{reportData.totalCGST?.toLocaleString() || 0}</strong>
              </div>
              <div className="summary-item">
                <span>SGST</span>
                <strong>₹{reportData.totalSGST?.toLocaleString() || 0}</strong>
              </div>
              <div className="summary-item">
                <span>IGST</span>
                <strong>₹{reportData.totalIGST?.toLocaleString() || 0}</strong>
              </div>
              <div className="summary-item">
                <span>Total GST</span>
                <strong>₹{reportData.totalGST?.toLocaleString() || 0}</strong>
              </div>
            </div>
          </div>
        )
      case 'stock-valuation':
        return (
          <div className="chart-container">
            <h3>Stock Valuation</h3>
            <div className="summary-cards">
              <div className="summary-item">
                <span>Total Valuation</span>
                <strong>₹{reportData.totalValuation?.toLocaleString() || 0}</strong>
              </div>
              <div className="summary-item">
                <span>Selling Value</span>
                <strong>₹{reportData.totalSellingValue?.toLocaleString() || 0}</strong>
              </div>
              <div className="summary-item">
                <span>Potential Profit</span>
                <strong className="positive">₹{reportData.potentialProfit?.toLocaleString() || 0}</strong>
              </div>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="reports-page">
      <div className="page-header">
        <h1>Reports</h1>
        <button className="btn-primary" onClick={handleExport}>
          <Download size={20} />
          Export Report
        </button>
      </div>

      <div className="reports-controls">
        <div className="control-group">
          <label>Report Type</label>
          <select value={reportType} onChange={(e) => setReportType(e.target.value)}>
            <option value="sales">Sales Report</option>
            <option value="purchase">Purchase Report</option>
            <option value="stock-valuation">Stock Valuation</option>
            <option value="gst">GST Report</option>
            <option value="profit-loss">Profit & Loss</option>
          </select>
        </div>

        <div className="control-group">
          <label>Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>

        <div className="control-group">
          <label>End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>

        <button className="btn-filter">
          <Filter size={20} />
          Apply Filter
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading report...</div>
      ) : (
        renderChart()
      )}
    </div>
  )
}

export default Reports
