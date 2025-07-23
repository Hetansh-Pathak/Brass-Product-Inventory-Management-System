import React, { useState, useEffect } from 'react';
import {
  Box,
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
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
  Build,
  ExpandMore,
  Science,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import Grid from '@mui/material/Grid2';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// Raw Material interface
interface RawMaterial {
  id: string;
  materialName: string;
  type: string;
  grade: string;
  supplier: {
    name: string;
    contact: string;
  };
  specifications: {
    purity: number;
    composition: {
      copper: number;
      zinc: number;
      tin: number;
      lead: number;
    };
  };
  inventory: {
    quantity: number;
    unit: string;
    reorderLevel: number;
  };
  pricing: {
    costPrice: number;
  };
  status: 'available' | 'low-stock' | 'out-of-stock' | 'on-order';
  createdAt: string;
}

// Validation schema
const materialSchema = yup.object({
  materialName: yup.string().required('Material name is required'),
  type: yup.string().required('Type is required'),
  grade: yup.string(),
  supplierName: yup.string().required('Supplier name is required'),
  supplierContact: yup.string(),
  purity: yup.number().min(0).max(100),
  copper: yup.number().min(0).max(100),
  zinc: yup.number().min(0).max(100),
  tin: yup.number().min(0).max(100),
  lead: yup.number().min(0).max(100),
  quantity: yup.number().min(0, 'Quantity must be non-negative').required('Quantity is required'),
  unit: yup.string().required('Unit is required'),
  reorderLevel: yup.number().min(0, 'Reorder level must be non-negative').required('Reorder level is required'),
  costPrice: yup.number().min(0, 'Cost price must be non-negative').required('Cost price is required'),
});

// Mock data
const mockMaterials: RawMaterial[] = [
  {
    id: '1',
    materialName: 'High Grade Brass Rod Stock',
    type: 'Brass Rod',
    grade: 'C36000',
    supplier: { name: 'Premium Metals Corp', contact: '+1-234-567-8901' },
    specifications: {
      purity: 95.5,
      composition: { copper: 61.5, zinc: 35.5, tin: 2.0, lead: 1.0 },
    },
    inventory: { quantity: 500, unit: 'kg', reorderLevel: 100 },
    pricing: { costPrice: 8.50 },
    status: 'available',
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    materialName: 'Brass Sheet Material 2mm',
    type: 'Brass Sheet',
    grade: 'C26000',
    supplier: { name: 'Sheet Metal Solutions', contact: '+1-234-567-8902' },
    specifications: {
      purity: 92.0,
      composition: { copper: 70.0, zinc: 30.0, tin: 0.0, lead: 0.0 },
    },
    inventory: { quantity: 45, unit: 'kg', reorderLevel: 50 },
    pricing: { costPrice: 12.75 },
    status: 'low-stock',
    createdAt: '2024-01-12T14:20:00Z',
  },
  {
    id: '3',
    materialName: 'Brass Tube Raw Material',
    type: 'Brass Tube',
    grade: 'C12200',
    supplier: { name: 'Tube Manufacturing Ltd', contact: '+1-234-567-8903' },
    specifications: {
      purity: 99.9,
      composition: { copper: 99.9, zinc: 0.1, tin: 0.0, lead: 0.0 },
    },
    inventory: { quantity: 0, unit: 'meters', reorderLevel: 25 },
    pricing: { costPrice: 15.25 },
    status: 'out-of-stock',
    createdAt: '2024-01-10T09:15:00Z',
  },
];

const materialTypes = ['Brass Rod', 'Brass Sheet', 'Brass Tube', 'Brass Wire', 'Alloy', 'Other'];
const units = ['kg', 'pieces', 'meters', 'feet', 'tonnes'];

const RawMaterials: React.FC = () => {
  const [materials, setMaterials] = useState<RawMaterial[]>(mockMaterials);
  const [filteredMaterials, setFilteredMaterials] = useState<RawMaterial[]>(mockMaterials);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<RawMaterial | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(materialSchema),
    defaultValues: {
      materialName: '',
      type: '',
      grade: '',
      supplierName: '',
      supplierContact: '',
      purity: 0,
      copper: 0,
      zinc: 0,
      tin: 0,
      lead: 0,
      quantity: 0,
      unit: 'kg',
      reorderLevel: 0,
      costPrice: 0,
    },
  });

  // Filter materials based on search and filters
  useEffect(() => {
    let filtered = materials;

    if (searchTerm) {
      filtered = filtered.filter(
        (material) =>
          material.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          material.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType) {
      filtered = filtered.filter((material) => material.type === filterType);
    }

    if (filterStatus) {
      filtered = filtered.filter((material) => material.status === filterStatus);
    }

    setFilteredMaterials(filtered);
  }, [materials, searchTerm, filterType, filterStatus]);

  const handleAddMaterial = () => {
    setEditingMaterial(null);
    reset();
    setOpenDialog(true);
  };

  const handleEditMaterial = (material: RawMaterial) => {
    setEditingMaterial(material);
    reset({
      materialName: material.materialName,
      type: material.type,
      grade: material.grade,
      supplierName: material.supplier.name,
      supplierContact: material.supplier.contact,
      purity: material.specifications.purity,
      copper: material.specifications.composition.copper,
      zinc: material.specifications.composition.zinc,
      tin: material.specifications.composition.tin,
      lead: material.specifications.composition.lead,
      quantity: material.inventory.quantity,
      unit: material.inventory.unit,
      reorderLevel: material.inventory.reorderLevel,
      costPrice: material.pricing.costPrice,
    });
    setOpenDialog(true);
  };

  const handleDeleteMaterial = (materialId: string) => {
    setMaterials(materials.filter((m) => m.id !== materialId));
  };

  const onSubmit = (data: any) => {
    setLoading(true);
    
    setTimeout(() => {
      const materialData: RawMaterial = {
        id: editingMaterial?.id || Date.now().toString(),
        materialName: data.materialName,
        type: data.type,
        grade: data.grade,
        supplier: {
          name: data.supplierName,
          contact: data.supplierContact,
        },
        specifications: {
          purity: data.purity,
          composition: {
            copper: data.copper,
            zinc: data.zinc,
            tin: data.tin,
            lead: data.lead,
          },
        },
        inventory: {
          quantity: data.quantity,
          unit: data.unit,
          reorderLevel: data.reorderLevel,
        },
        pricing: {
          costPrice: data.costPrice,
        },
        status: data.quantity === 0 ? 'out-of-stock' : data.quantity <= data.reorderLevel ? 'low-stock' : 'available',
        createdAt: editingMaterial?.createdAt || new Date().toISOString(),
      };

      if (editingMaterial) {
        setMaterials(materials.map((m) => (m.id === editingMaterial.id ? materialData : m)));
      } else {
        setMaterials([materialData, ...materials]);
      }

      setLoading(false);
      setOpenDialog(false);
      reset();
    }, 1000);
  };

  const getStockStatus = (material: RawMaterial) => {
    switch (material.status) {
      case 'out-of-stock':
        return { label: 'Out of Stock', color: 'error' as const, icon: <Warning /> };
      case 'low-stock':
        return { label: 'Low Stock', color: 'warning' as const, icon: <TrendingDown /> };
      case 'on-order':
        return { label: 'On Order', color: 'info' as const, icon: <Science /> };
      default:
        return { label: 'Available', color: 'success' as const, icon: <CheckCircle /> };
    }
  };

  const lowStockCount = materials.filter(m => m.status === 'low-stock').length;
  const outOfStockCount = materials.filter(m => m.status === 'out-of-stock').length;
  const totalValue = materials.reduce((sum, m) => sum + (m.inventory.quantity * m.pricing.costPrice), 0);

  return (
    <Box>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            Raw Materials Management
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Manage your raw material inventory and compositions
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
                      {materials.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Materials
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Build />
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
                      ${totalValue.toLocaleString()}
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
            <strong>Stock Alert:</strong> {outOfStockCount} materials are out of stock and {lowStockCount} materials are low on stock.
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
                  placeholder="Search materials..."
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
                  <InputLabel>Type</InputLabel>
                  <Select
                    value={filterType}
                    label="Type"
                    onChange={(e) => setFilterType(e.target.value)}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    {materialTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
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
                    <MenuItem value="available">Available</MenuItem>
                    <MenuItem value="low-stock">Low Stock</MenuItem>
                    <MenuItem value="out-of-stock">Out of Stock</MenuItem>
                    <MenuItem value="on-order">On Order</MenuItem>
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

      {/* Materials Table */}
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
                  <TableCell>Material Name</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Grade</TableCell>
                  <TableCell>Supplier</TableCell>
                  <TableCell>Stock</TableCell>
                  <TableCell>Purity</TableCell>
                  <TableCell>Cost Price</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <AnimatePresence>
                  {filteredMaterials.map((material, index) => {
                    const stockStatus = getStockStatus(material);
                    return (
                      <motion.tr
                        key={material.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ delay: index * 0.1 }}
                        component={TableRow}
                        hover
                      >
                        <TableCell>
                          <Typography variant="subtitle2" fontWeight="600">
                            {material.materialName}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={material.type}
                            size="small"
                            variant="outlined"
                          />
                        </TableCell>
                        <TableCell>{material.grade}</TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {material.supplier.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {material.supplier.contact}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box display="flex" alignItems="center" gap={1}>
                            <Typography variant="body2">
                              {material.inventory.quantity} {material.inventory.unit}
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
                        <TableCell>{material.specifications.purity}%</TableCell>
                        <TableCell>${material.pricing.costPrice.toFixed(2)}</TableCell>
                        <TableCell>
                          <Chip
                            label={material.status}
                            size="small"
                            color={material.status === 'available' ? 'success' : material.status === 'out-of-stock' ? 'error' : 'warning'}
                            variant={material.status === 'available' ? 'filled' : 'outlined'}
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
                                onClick={() => handleEditMaterial(material)}
                              >
                                <Edit />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                              <IconButton
                                size="small"
                                color="error"
                                onClick={() => handleDeleteMaterial(material.id)}
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

      {/* Add Material FAB */}
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
          onClick={handleAddMaterial}
        >
          <Add />
        </Fab>
      </motion.div>

      {/* Add/Edit Material Dialog */}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {editingMaterial ? 'Edit Raw Material' : 'Add New Raw Material'}
        </DialogTitle>
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogContent>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
                <Controller
                  name="materialName"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Material Name"
                      error={!!errors.materialName}
                      helperText={errors.materialName?.message}
                      margin="normal"
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field }) => (
                    <FormControl fullWidth margin="normal">
                      <InputLabel>Type</InputLabel>
                      <Select {...field} label="Type" error={!!errors.type}>
                        {materialTypes.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <Controller
                  name="grade"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Grade"
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

              {/* Composition Section */}
              <Grid item xs={12}>
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMore />}>
                    <Typography variant="h6">Material Composition</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="purity"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Purity (%)"
                              type="number"
                              InputProps={{ endAdornment: '%' }}
                              margin="normal"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="copper"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Copper (%)"
                              type="number"
                              InputProps={{ endAdornment: '%' }}
                              margin="normal"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="zinc"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Zinc (%)"
                              type="number"
                              InputProps={{ endAdornment: '%' }}
                              margin="normal"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="tin"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Tin (%)"
                              type="number"
                              InputProps={{ endAdornment: '%' }}
                              margin="normal"
                            />
                          )}
                        />
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <Controller
                          name="lead"
                          control={control}
                          render={({ field }) => (
                            <TextField
                              {...field}
                              fullWidth
                              label="Lead (%)"
                              type="number"
                              InputProps={{ endAdornment: '%' }}
                              margin="normal"
                            />
                          )}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
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
              <Grid item xs={12}>
                <Controller
                  name="costPrice"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Cost Price per Unit"
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
              {loading ? 'Saving...' : editingMaterial ? 'Update' : 'Add Material'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  );
};

export default RawMaterials;
