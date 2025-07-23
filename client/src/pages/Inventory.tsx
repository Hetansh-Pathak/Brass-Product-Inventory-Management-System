import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Avatar,
  InputAdornment,
  Fab,
  Alert,
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  Visibility,
  Download,
  Warning,
  CheckCircle,
  TrendingDown,
  Inventory2,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

// Mock data
const mockProducts = [
  {
    id: '1',
    productName: 'Brass Rod 10mm',
    category: 'Rods',
    hsnCode: '74031100',
    supplier: { name: 'ABC Metals Ltd', contact: '+1-234-567-8901' },
    inventory: { quantity: 150, unit: 'pieces', reorderLevel: 20 },
    pricing: { costPrice: 12.50, sellingPrice: 18.75 },
    status: 'active',
  },
  {
    id: '2',
    productName: 'Brass Sheet 2mm',
    category: 'Sheets',
    hsnCode: '74031200',
    supplier: { name: 'XYZ Copper Co', contact: '+1-234-567-8902' },
    inventory: { quantity: 8, unit: 'sheets', reorderLevel: 15 },
    pricing: { costPrice: 45.00, sellingPrice: 67.50 },
    status: 'active',
  },
];

const Inventory: React.FC = () => {
  const [products] = useState(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');

  const lowStockCount = products.filter(p => p.inventory.quantity <= p.inventory.reorderLevel).length;
  const outOfStockCount = products.filter(p => p.inventory.quantity === 0).length;

  const getStockStatus = (product: any) => {
    if (product.inventory.quantity === 0) {
      return { label: 'Out of Stock', color: 'error' as const, icon: <Warning /> };
    } else if (product.inventory.quantity <= product.inventory.reorderLevel) {
      return { label: 'Low Stock', color: 'warning' as const, icon: <TrendingDown /> };
    }
    return { label: 'In Stock', color: 'success' as const, icon: <CheckCircle /> };
  };

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Inventory Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your brass products and stock levels
          </Typography>
        </motion.div>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} mb={3}>
        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="primary">
                    {products.length}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Products
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'primary.main' }}>
                  <Inventory2 />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="warning.main">
                    {lowStockCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Low Stock Items
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'warning.main' }}>
                  <TrendingDown />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="error.main">
                    {outOfStockCount}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Out of Stock
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'error.main' }}>
                  <Warning />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center" justifyContent="space-between">
                <Box>
                  <Typography variant="h4" fontWeight="bold" color="success.main">
                    ${products.reduce((sum, p) => sum + (p.inventory.quantity * p.pricing.costPrice), 0).toLocaleString()}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Value
                  </Typography>
                </Box>
                <Avatar sx={{ bgcolor: 'success.main' }}>
                  <CheckCircle />
                </Avatar>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Alerts */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <strong>Stock Alert:</strong> {outOfStockCount} items are out of stock and {lowStockCount} items are low on stock.
        </Alert>
      )}

      {/* Search */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid xs={12} md={6}>
              <TextField
                fullWidth
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid xs={12} md={6}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Download />}
                onClick={() => console.log('Export data')}
              >
                Export
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Product Name</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>HSN Code</TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Stock</TableCell>
                <TableCell>Cost Price</TableCell>
                <TableCell>Selling Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => {
                const stockStatus = getStockStatus(product);
                return (
                  <TableRow key={product.id}>
                    <TableCell>
                      <Typography variant="subtitle2" fontWeight="600">
                        {product.productName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={product.category}
                        size="small"
                        variant="outlined"
                      />
                    </TableCell>
                    <TableCell>{product.hsnCode}</TableCell>
                    <TableCell>
                      <Typography variant="body2">
                        {product.supplier.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {product.supplier.contact}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Typography variant="body2">
                          {product.inventory.quantity} {product.inventory.unit}
                        </Typography>
                        <Chip
                          icon={stockStatus.icon}
                          label={stockStatus.label}
                          size="small"
                          color={stockStatus.color}
                          variant="outlined"
                        />
                      </Box>
                    </TableCell>
                    <TableCell>${product.pricing.costPrice.toFixed(2)}</TableCell>
                    <TableCell>${product.pricing.sellingPrice.toFixed(2)}</TableCell>
                    <TableCell>
                      <Chip
                        label={product.status}
                        size="small"
                        color={product.status === 'active' ? 'success' : 'default'}
                        variant={product.status === 'active' ? 'filled' : 'outlined'}
                      />
                    </TableCell>
                    <TableCell>
                      <Box display="flex" gap={1}>
                        <IconButton size="small" color="info">
                          <Visibility />
                        </IconButton>
                        <IconButton size="small" color="primary">
                          <Edit />
                        </IconButton>
                        <IconButton size="small" color="error">
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      {/* Add Product FAB */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
      >
        <Add />
      </Fab>
    </Box>
  );
};

export default Inventory;
