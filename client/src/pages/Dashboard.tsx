import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  LinearProgress,
  IconButton,
  useTheme,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Grid,
} from '@mui/material';
import {
  TrendingUp,
  Inventory,
  Receipt,
  Warning,
  CheckCircle,
  Error,
  Info,
  Refresh,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

// Mock data
const mockStats = {
  products: {
    totalProducts: 156,
    activeProducts: 142,
    lowStockProducts: 8,
    totalInventoryValue: 125000,
  },
  materials: {
    totalMaterials: 89,
    availableMaterials: 82,
    lowStockMaterials: 5,
    totalMaterialValue: 85000,
  },
  bills: {
    totalBills: 234,
    totalRevenue: 450000,
    totalPaid: 380000,
    totalPending: 70000,
    paidBills: 198,
    pendingBills: 36,
  },
  todaysBills: { count: 5, revenue: 12500 },
  monthlyBills: { count: 45, revenue: 125000 },
};

const mockAlerts = [
  { id: 1, type: 'warning', title: 'Low Stock Alert', message: 'Brass Rod inventory is running low', time: '5m ago' },
  { id: 2, type: 'info', title: 'New Order', message: 'Order #BR-001234 received from ABC Corp', time: '1h ago' },
  { id: 3, type: 'error', title: 'Overdue Payment', message: 'Invoice #INV-2024-000123 is overdue', time: '2h ago' },
];

const mockChartData = [
  { name: 'Jan', revenue: 45000, bills: 35 },
  { name: 'Feb', revenue: 52000, bills: 42 },
  { name: 'Mar', revenue: 48000, bills: 38 },
  { name: 'Apr', revenue: 61000, bills: 48 },
  { name: 'May', revenue: 55000, bills: 44 },
  { name: 'Jun', revenue: 67000, bills: 52 },
];

const categoryData = [
  { name: 'Rods', value: 35, color: '#8884d8' },
  { name: 'Sheets', value: 25, color: '#82ca9d' },
  { name: 'Fittings', value: 20, color: '#ffc658' },
  { name: 'Pipes', value: 15, color: '#ff7300' },
  { name: 'Custom', value: 5, color: '#00C49F' },
];

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  trend?: number;
  delay?: number;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, subtitle, icon, color, trend, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
    >
      <Card
        sx={{
          height: '100%',
          background: `linear-gradient(135deg, ${color}10 0%, ${color}05 100%)`,
          border: `1px solid ${color}20`,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-4px)',
            boxShadow: `0 10px 30px ${color}20`,
          },
        }}
      >
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Box>
              <Typography variant="h4" fontWeight="bold" color={color}>
                {typeof value === 'number' ? value.toLocaleString() : value}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="caption" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
              {trend && (
                <Box display="flex" alignItems="center" mt={1}>
                  <TrendingUp fontSize="small" color={trend > 0 ? 'success' : 'error'} />
                  <Typography
                    variant="caption"
                    color={trend > 0 ? 'success.main' : 'error.main'}
                    sx={{ ml: 0.5 }}
                  >
                    {trend > 0 ? '+' : ''}{trend}%
                  </Typography>
                </Box>
              )}
            </Box>
            <Box
              sx={{
                p: 2,
                borderRadius: '50%',
                backgroundColor: `${color}15`,
                color: color,
              }}
            >
              {icon}
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    // Simulate loading
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" gap={2}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h4" fontWeight="bold">
            Dashboard
          </Typography>
          <LinearProgress sx={{ width: 200 }} />
        </Box>
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map((i) => (
            <Grid key={i} xs={12} sm={6} md={3}>
              <Card sx={{ height: 120 }}>
                <CardContent>
                  <LinearProgress />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Dashboard
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Welcome to your Brass Industries management system
          </Typography>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <IconButton onClick={handleRefresh} color="primary">
            <Refresh />
          </IconButton>
        </motion.div>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={4}>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={mockStats.products.totalProducts}
            subtitle={`${mockStats.products.lowStockProducts} low stock`}
            icon={<Inventory />}
            color={theme.palette.primary.main}
            trend={5.2}
            delay={0.1}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Total Revenue"
            value={`$${(mockStats.bills.totalRevenue / 1000).toFixed(0)}K`}
            subtitle="This month"
            icon={<TrendingUp />}
            color={theme.palette.success.main}
            trend={12.5}
            delay={0.2}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Total Bills"
            value={mockStats.bills.totalBills}
            subtitle={`${mockStats.bills.pendingBills} pending`}
            icon={<Receipt />}
            color={theme.palette.info.main}
            trend={-2.1}
            delay={0.3}
          />
        </Grid>
        <Grid xs={12} sm={6} md={3}>
          <StatCard
            title="Raw Materials"
            value={mockStats.materials.totalMaterials}
            subtitle={`${mockStats.materials.lowStockMaterials} low stock`}
            icon={<Warning />}
            color={theme.palette.warning.main}
            trend={3.8}
            delay={0.4}
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Revenue Chart */}
        <Grid xs={12} md={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Revenue Trend
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockChartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="revenue" fill={theme.palette.primary.main} />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Category Distribution */}
        <Grid xs={12} md={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Product Categories
                </Typography>
                <Box height={300}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Recent Alerts */}
        <Grid xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Recent Alerts
                </Typography>
                <List>
                  {mockAlerts.map((alert) => {
                    const getIcon = () => {
                      switch (alert.type) {
                        case 'warning': return <Warning color="warning" />;
                        case 'error': return <Error color="error" />;
                        case 'info': return <Info color="info" />;
                        default: return <CheckCircle color="success" />;
                      }
                    };

                    return (
                      <ListItem key={alert.id} divider>
                        <ListItemIcon>{getIcon()}</ListItemIcon>
                        <ListItemText
                          primary={alert.title}
                          secondary={
                            <span>
                              {alert.message}
                              <br />
                              <small>{alert.time}</small>
                            </span>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>

        {/* Quick Actions */}
        <Grid xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="600" gutterBottom>
                  Today's Summary
                </Typography>
                <Box display="flex" flexDirection="column" gap={2}>
                  <Alert severity="info">
                    <strong>{mockStats.todaysBills.count}</strong> bills created today
                    generating <strong>${mockStats.todaysBills.revenue.toLocaleString()}</strong> in revenue
                  </Alert>
                  <Alert severity="success">
                    <strong>{mockStats.bills.paidBills}</strong> bills paid this month
                  </Alert>
                  <Alert severity="warning">
                    <strong>{mockStats.products.lowStockProducts + mockStats.materials.lowStockMaterials}</strong> items 
                    need restocking
                  </Alert>
                </Box>
              </CardContent>
            </Card>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard;
