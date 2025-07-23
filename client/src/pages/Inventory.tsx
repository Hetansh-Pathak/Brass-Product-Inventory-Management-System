import React, { useState, useEffect } from 'react';
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Skeleton,
  Paper,
  TablePagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Tooltip,
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
  FilterList,
  Sort,
  Refresh,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import AddProductModal from '../components/products/AddProductModal';
import axios from 'axios';

interface Product {
  id: string;
  productName: string;
  description?: string;
  category: string;
  hsnCode: string;
  supplier: {
    name: string;
    contact?: {
      phone?: string;
      email?: string;
    };
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
  status: string;
  createdAt?: string;
  updatedAt?: string;
}

const Inventory: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [stats, setStats] = useState({
    totalProducts: 0,
    lowStockCount: 0,
    outOfStockCount: 0,
    totalValue: 0
  });

  // Fetch products
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/products', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: searchTerm,
          category: categoryFilter,
          status: statusFilter
        }
      });

      setProducts(response.data.products || []);
      setStats({
        totalProducts: response.data.total || 0,
        lowStockCount: response.data.lowStockCount || 0,
        outOfStockCount: response.data.products?.filter((p: Product) => p.inventory.quantity === 0).length || 0,
        totalValue: response.data.products?.reduce((sum: number, p: Product) => sum + (p.inventory.quantity * p.pricing.costPrice), 0) || 0
      });
    } catch (error: any) {
      console.error('Error fetching products:', error);
      if (error.response?.headers?.['x-fallback-mode']) {
        // Handle fallback mode
        const fallbackProducts = [
          {
            id: '1',
            productName: 'Brass Rod 10mm',
            category: 'Rods',
            hsnCode: '74031100',
            supplier: { name: 'ABC Metals Ltd', contact: { phone: '+1-234-567-8901' } },
            inventory: { quantity: 150, unit: 'pieces', reorderLevel: 20 },
            pricing: { costPrice: 12.50, sellingPrice: 18.75 },
            status: 'active',
          },
          {
            id: '2',
            productName: 'Brass Sheet 2mm',
            category: 'Sheets',
            hsnCode: '74031200',
            supplier: { name: 'XYZ Copper Co', contact: { phone: '+1-234-567-8902' } },
            inventory: { quantity: 8, unit: 'sheets', reorderLevel: 15 },
            pricing: { costPrice: 45.00, sellingPrice: 67.50 },
            status: 'active',
          },
          {
            id: '3',
            productName: 'Brass Pipe 25mm',
            category: 'Pipes',
            hsnCode: '74031300',
            supplier: { name: 'PipeWorks Inc', contact: { phone: '+1-234-567-8903' } },
            inventory: { quantity: 0, unit: 'pieces', reorderLevel: 10 },
            pricing: { costPrice: 28.00, sellingPrice: 42.00 },
            status: 'active',
          }
        ];
        setProducts(fallbackProducts);
        setStats({
          totalProducts: fallbackProducts.length,
          lowStockCount: fallbackProducts.filter(p => p.inventory.quantity <= p.inventory.reorderLevel).length,
          outOfStockCount: fallbackProducts.filter(p => p.inventory.quantity === 0).length,
          totalValue: fallbackProducts.reduce((sum, p) => sum + (p.inventory.quantity * p.pricing.costPrice), 0)
        });
        toast.info('Running in demo mode with sample data');
      } else {
        toast.error('Error loading products');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage, searchTerm, categoryFilter, statusFilter]);

  const handleAddProduct = async (productData: any) => {
    try {
      await axios.post('/api/products', productData);
      toast.success('Product added successfully!');
      fetchProducts();
    } catch (error: any) {
      if (error.response?.headers?.['x-fallback-mode']) {
        toast.info('Demo mode: Product would be added in real application');
        setAddModalOpen(false);
      } else {
        throw error;
      }
    }
  };

  const handleEditProduct = async (productData: any) => {
    try {
      await axios.put(`/api/products/${editingProduct?.id}`, productData);
      toast.success('Product updated successfully!');
      fetchProducts();
      setEditingProduct(null);
    } catch (error: any) {
      if (error.response?.headers?.['x-fallback-mode']) {
        toast.info('Demo mode: Product would be updated in real application');
        setEditingProduct(null);
      } else {
        throw error;
      }
    }
  };

  const handleDeleteProduct = async () => {
    try {
      await axios.delete(`/api/products/${productToDelete?.id}`);
      toast.success('Product deleted successfully!');
      fetchProducts();
    } catch (error: any) {
      if (error.response?.headers?.['x-fallback-mode']) {
        toast.info('Demo mode: Product would be deleted in real application');
      } else {
        toast.error('Error deleting product');
      }
    } finally {
      setDeleteDialogOpen(false);
      setProductToDelete(null);
    }
  };

  const categories = ['Rods', 'Sheets', 'Fittings', 'Pipes', 'Custom', 'Other'];
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.supplier.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    const matchesStatus = !statusFilter || product.status === statusFilter;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const getStockStatus = (product: Product) => {
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
                      {loading ? <Skeleton width={60} /> : stats.totalProducts}
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
                      {loading ? <Skeleton width={60} /> : stats.lowStockCount}
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
                      {loading ? <Skeleton width={60} /> : stats.outOfStockCount}
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
                      {loading ? <Skeleton width={80} /> : `$${stats.totalValue.toLocaleString()}`}
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
      {(stats.lowStockCount > 0 || stats.outOfStockCount > 0) && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          <strong>Stock Alert:</strong> {stats.outOfStockCount} items are out of stock and {stats.lowStockCount} items are low on stock.
        </Alert>
      )}

      {/* Search and Filters */}
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
            <Grid xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  label="Category"
                >
                  <MenuItem value="">All</MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  label="Status"
                >
                  <MenuItem value="">All</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid xs={6} md={2}>
              <Tooltip title="Refresh Data">
                <IconButton
                  onClick={fetchProducts}
                  disabled={loading}
                  color="primary"
                >
                  <Refresh />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid xs={6} md={2}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<Download />}
                onClick={() => toast.info('Export feature coming soon!')}
                size="small"
              >
                Export
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Products Table */}
      <Card>
        <TableContainer component={Paper}>
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
              {loading ? (
                Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 9 }).map((_, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton variant="text" width={cellIndex === 0 ? 200 : 100} />
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : filteredProducts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    <Typography variant="body1" color="text.secondary" sx={{ py: 4 }}>
                      {searchTerm || categoryFilter || statusFilter ? 'No products found matching your filters' : 'No products available'}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                filteredProducts.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((product) => {
                  const stockStatus = getStockStatus(product);
                  return (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="600">
                          {product.productName}
                        </Typography>
                        {product.description && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            {product.description.length > 50 ? `${product.description.substring(0, 50)}...` : product.description}
                          </Typography>
                        )}
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
                        {product.supplier.contact?.phone && (
                          <Typography variant="caption" color="text.secondary">
                            {product.supplier.contact.phone}
                          </Typography>
                        )}
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
                          <Tooltip title="View Details">
                            <IconButton size="small" color="info">
                              <Visibility />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Edit Product">
                            <IconButton
                              size="small"
                              color="primary"
                              onClick={() => setEditingProduct(product)}
                            >
                              <Edit />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Delete Product">
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => {
                                setProductToDelete(product);
                                setDeleteDialogOpen(true);
                              }}
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25, 50]}
          component="div"
          count={filteredProducts.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          onRowsPerPageChange={(event) => {
            setRowsPerPage(parseInt(event.target.value, 10));
            setPage(0);
          }}
        />
      </Card>

      {/* Add Product FAB */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        onClick={() => setAddModalOpen(true)}
      >
        <Add />
      </Fab>

      {/* Add Product Modal */}
      <AddProductModal
        open={addModalOpen}
        onClose={() => setAddModalOpen(false)}
        onSubmit={handleAddProduct}
      />

      {/* Edit Product Modal */}
      <AddProductModal
        open={!!editingProduct}
        onClose={() => setEditingProduct(null)}
        onSubmit={handleEditProduct}
        product={editingProduct}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{productToDelete?.productName}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleDeleteProduct} color="error" variant="contained">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Inventory;
