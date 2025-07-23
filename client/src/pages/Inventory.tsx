import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Avatar,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Fab,
  Tooltip,
  Alert,
  LinearProgress,
} from '@mui/material';
import {
  Add,
  Search,
  Edit,
  Delete,
  Visibility,
  FilterList,
  Download,
  Warning,
  CheckCircle,
  TrendingDown,
  Inventory2,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Product interface
interface Product {
  id: string;
  productName: string;
  category: string;
  hsnCode: string;
  supplier: {
    name: string;
    contact: string;
  };
  inventory: {
    quantity: number;
    unit: string;
    reorderLevel: number;
  };
  pricing: {
    costPrice: number;
    sellingPrice: number;
  };
  status: 'active' | 'inactive' | 'discontinued';
  createdAt: string;
}

// Validation schema
const productSchema = yup.object({
  productName: yup.string().required('Product name is required'),
  category: yup.string().required('Category is required'),
  hsnCode: yup.string().required('HSN code is required'),
  supplierName: yup.string().required('Supplier name is required'),
  supplierContact: yup.string(),
  quantity: yup.number().min(0, 'Quantity must be non-negative').required('Quantity is required'),
  unit: yup.string().required('Unit is required'),
  reorderLevel: yup.number().min(0, 'Reorder level must be non-negative').required('Reorder level is required'),
  costPrice: yup.number().min(0, 'Cost price must be non-negative').required('Cost price is required'),
  sellingPrice: yup.number().min(0, 'Selling price must be non-negative').required('Selling price is required'),
});

// Mock data
const mockProducts: Product[] = [
  {
    id: '1',
    productName: 'Brass Rod 10mm',
    category: 'Rods',
    hsnCode: '74031100',
    supplier: { name: 'ABC Metals Ltd', contact: '+1-234-567-8901' },
    inventory: { quantity: 150, unit: 'pieces', reorderLevel: 20 },
    pricing: { costPrice: 12.50, sellingPrice: 18.75 },
    status: 'active',
    createdAt: '2024-01-15T10:30:00Z',
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
    createdAt: '2024-01-12T14:20:00Z',
  },
  {
    id: '3',
    productName: 'Brass Fitting T-Joint',
    category: 'Fittings',
    hsnCode: '74122000',
    supplier: { name: 'Quality Fittings Inc', contact: '+1-234-567-8903' },
    inventory: { quantity: 75, unit: 'pieces', reorderLevel: 25 },
    pricing: { costPrice: 8.25, sellingPrice: 12.40 },
    status: 'active',
    createdAt: '2024-01-10T09:15:00Z',
  },
];

const categories = ['Rods', 'Sheets', 'Fittings', 'Pipes', 'Custom', 'Other'];
const units = ['pieces', 'kg', 'meters', 'feet', 'sheets'];

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(productSchema),
    defaultValues: {
      productName: '',
      category: '',
      hsnCode: '',
      supplierName: '',
      supplierContact: '',
      quantity: 0,
      unit: 'pieces',
      reorderLevel: 0,
      costPrice: 0,
      sellingPrice: 0,
    },
  });

  // Filter products based on search and filters
  useEffect(() => {
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.hsnCode.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCategory) {
      filtered = filtered.filter((product) => product.category === filterCategory);
    }

    if (filterStatus) {
      filtered = filtered.filter((product) => product.status === filterStatus);
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, filterCategory, filterStatus]);

  const handleAddProduct = () => {
    setEditingProduct(null);
    reset();
    setOpenDialog(true);
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
    reset({
      productName: product.productName,
      category: product.category,
      hsnCode: product.hsnCode,
      supplierName: product.supplier.name,
      supplierContact: product.supplier.contact,
      quantity: product.inventory.quantity,
      unit: product.inventory.unit,
      reorderLevel: product.inventory.reorderLevel,
      costPrice: product.pricing.costPrice,
      sellingPrice: product.pricing.sellingPrice,
    });
    setOpenDialog(true);
  };

  const handleDeleteProduct = (productId: string) => {
    setProducts(products.filter((p) => p.id !== productId));
  };

  const onSubmit = (data: any) => {
    setLoading(true);
    
    setTimeout(() => {
      const productData: Product = {
        id: editingProduct?.id || Date.now().toString(),
        productName: data.productName,
        category: data.category,
        hsnCode: data.hsnCode,
        supplier: {
          name: data.supplierName,
          contact: data.supplierContact,
        },
        inventory: {
          quantity: data.quantity,
          unit: data.unit,
          reorderLevel: data.reorderLevel,
        },
        pricing: {
          costPrice: data.costPrice,
          sellingPrice: data.sellingPrice,
        },
        status: 'active',
        createdAt: editingProduct?.createdAt || new Date().toISOString(),
      };

      if (editingProduct) {
        setProducts(products.map((p) => (p.id === editingProduct.id ? productData : p)));
      } else {
        setProducts([productData, ...products]);
      }

      setLoading(false);
      setOpenDialog(false);
      reset();
    }, 1000);
  };

  const getStockStatus = (product: Product) => {
    if (product.inventory.quantity === 0) {
      return { label: 'Out of Stock', color: 'error' as const, icon: <Warning /> };
    } else if (product.inventory.quantity <= product.inventory.reorderLevel) {
      return { label: 'Low Stock', color: 'warning' as const, icon: <TrendingDown /> };
    }
    return { label: 'In Stock', color: 'success' as const, icon: <CheckCircle /> };
  };

  const lowStockCount = products.filter(p => p.inventory.quantity <= p.inventory.reorderLevel).length;
  const outOfStockCount = products.filter(p => p.inventory.quantity === 0).length;

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
        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
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
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
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
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
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
          </motion.div>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
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
          </motion.div>
        </Grid>
      </Grid>

      {/* Alerts */}
      {(lowStockCount > 0 || outOfStockCount > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Alert severity="warning" sx={{ mb: 3 }}>
            <strong>Stock Alert:</strong> {outOfStockCount} items are out of stock and {lowStockCount} items are low on stock.
          </Alert>
        </motion.div>
      )}

      {/* Search and Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={4}>
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
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={filterCategory}
                    label="Category"
                    onChange={(e) => setFilterCategory(e.target.value)}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3}>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={filterStatus}
                    label="Status"
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <MenuItem value="">All Status</MenuItem>
                    <MenuItem value="active">Active</MenuItem>
                    <MenuItem value="inactive">Inactive</MenuItem>
                    <MenuItem value="discontinued">Discontinued</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={2}>
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
      </motion.div>

      {/* Products Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
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
                <AnimatePresence>
                  {filteredProducts.map((product, index) => {
                    const stockStatus = getStockStatus(product);
                    return (
                      <motion.tr
                        key={product.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        component={TableRow}
                        hover
                      >
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
                            <Tooltip title="View">
                              <IconButton size="small" color="info">
                                <Visibility />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Edit">
                              <IconButton
                                size="small"
                                color="primary"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Delete />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </TableCell>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </TableBody>
            </Table>
          </TableContainer>
        </Card>
      </motion.div>

      {/* Add Product FAB */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: 'spring' }}
      >
        <Fab
          color="primary"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
          }}
          onClick={handleAddProduct}
        >
          <Add />
        </Fab>
      </motion.div>

      {/* Add/Edit Product Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="productName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Product Name"
                      error={!!errors.productName}
                      helperText={errors.productName?.message}
                      margin="normal"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="category"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Category</InputLabel>
                      <Select {...field} label="Category" error={!!errors.category}>
                        {categories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="hsnCode"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="HSN Code"
                      error={!!errors.hsnCode}
                      helperText={errors.hsnCode?.message}
                      margin="normal"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="supplierName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Supplier Name"
                      error={!!errors.supplierName}
                      helperText={errors.supplierName?.message}
                      margin="normal"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12}>
                <Controller
                  name="supplierContact"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Supplier Contact"
                      margin="normal"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="quantity"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Quantity"
                      type="number"
                      error={!!errors.quantity}
                      helperText={errors.quantity?.message}
                      margin="normal"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="unit"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Unit</InputLabel>
                      <Select {...field} label="Unit" error={!!errors.unit}>
                        {units.map((unit) => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4}>
                <Controller
                  name="reorderLevel"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Reorder Level"
                      type="number"
                      error={!!errors.reorderLevel}
                      helperText={errors.reorderLevel?.message}
                      margin="normal"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="costPrice"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Cost Price"
                      type="number"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      error={!!errors.costPrice}
                      helperText={errors.costPrice?.message}
                      margin="normal"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="sellingPrice"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Selling Price"
                      type="number"
                      InputProps={{
                        startAdornment: <InputAdornment position="start">$</InputAdornment>,
                      }}
                      error={!!errors.sellingPrice}
                      helperText={errors.sellingPrice?.message}
                      margin="normal"
                    />
                  )}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              startIcon={loading && <LinearProgress />}
            >
              {loading ? 'Saving...' : editingProduct ? 'Update' : 'Add Product'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default Inventory;
