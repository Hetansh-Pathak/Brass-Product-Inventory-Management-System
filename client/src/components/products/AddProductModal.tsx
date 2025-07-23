import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Typography,
  Divider,
  IconButton,
  Alert,
  Stepper,
  Step,
  StepLabel,
  InputAdornment,
} from '@mui/material';
import Grid from '@mui/material/Grid2';
import {
  Close,
  Add,
  Inventory,
  AttachMoney,
  Build,
  LocalShipping,
} from '@mui/icons-material';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductFormData {
  productName: string;
  description: string;
  category: string;
  hsnCode: string;
  supplier: {
    name: string;
    contact: {
      phone: string;
      email: string;
      address: string;
    };
  };
  specifications: {
    dimensions: {
      length?: number;
      width?: number;
      height?: number;
      diameter?: number;
      thickness?: number;
      unit: string;
    };
    weight: {
      value?: number;
      unit: string;
    };
    material: string;
    grade: string;
    finish: string;
  };
  inventory: {
    quantity: number;
    unit: string;
    reorderLevel: number;
    maxStockLevel: number;
    location: {
      warehouse: string;
      section: string;
      shelf: string;
    };
  };
  pricing: {
    costPrice: number;
    sellingPrice: number;
    currency: string;
  };
  tags: string[];
  notes: string;
}

interface AddProductModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProductFormData) => Promise<void>;
  product?: any; // For editing
}

const schema = yup.object({
  productName: yup.string().required('Product name is required').max(100),
  description: yup.string().max(500),
  category: yup.string().required('Category is required'),
  hsnCode: yup.string().required('HSN code is required'),
  'supplier.name': yup.string().required('Supplier name is required'),
  'supplier.contact.phone': yup.string(),
  'supplier.contact.email': yup.string().email('Invalid email'),
  'inventory.quantity': yup.number().min(0, 'Quantity must be positive').required(),
  'inventory.unit': yup.string().required('Unit is required'),
  'inventory.reorderLevel': yup.number().min(0).required(),
  'pricing.costPrice': yup.number().min(0, 'Cost price must be positive').required(),
  'pricing.sellingPrice': yup.number().min(0, 'Selling price must be positive').required(),
});

const categories = ['Rods', 'Sheets', 'Fittings', 'Pipes', 'Custom', 'Other'];
const units = ['pieces', 'kg', 'meters', 'feet', 'sheets', 'rolls'];
const dimensionUnits = ['mm', 'cm', 'inch', 'meter'];
// const weightUnits = ['kg', 'grams', 'tonnes'];

const steps = ['Basic Info', 'Specifications', 'Inventory', 'Pricing'];

const stepIcons = [Inventory, Build, LocalShipping, AttachMoney];

const AddProductModal: React.FC<AddProductModalProps> = ({
  open,
  onClose,
  onSubmit,
  product
}) => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const { control, handleSubmit, formState: { errors }, reset, watch } = useForm<ProductFormData>({
    resolver: yupResolver(schema),
    defaultValues: product || {
      productName: '',
      description: '',
      category: '',
      hsnCode: '',
      supplier: {
        name: '',
        contact: { phone: '', email: '', address: '' }
      },
      specifications: {
        dimensions: { unit: 'mm' },
        weight: { unit: 'kg' },
        material: '',
        grade: '',
        finish: ''
      },
      inventory: {
        quantity: 0,
        unit: 'pieces',
        reorderLevel: 0,
        maxStockLevel: 0,
        location: { warehouse: '', section: '', shelf: '' }
      },
      pricing: {
        costPrice: 0,
        sellingPrice: 0,
        currency: 'USD'
      },
      tags: [],
      notes: ''
    }
  });

  const costPrice = watch('pricing.costPrice');
  const sellingPrice = watch('pricing.sellingPrice');
  const profitMargin = costPrice > 0 ? ((sellingPrice - costPrice) / costPrice * 100) : 0;

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const handleFormSubmit = async (data: ProductFormData) => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);
      await onSubmit(data);
      reset();
      setActiveStep(0);
      onClose();
    } catch (error: any) {
      setSubmitError(error.response?.data?.message || 'Error saving product');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    reset();
    setActiveStep(0);
    setSubmitError(null);
    onClose();
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
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
                    required
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.category} required>
                    <InputLabel>Category</InputLabel>
                    <Select {...field} label="Category">
                      {categories.map((cat) => (
                        <MenuItem key={cat} value={cat}>{cat}</MenuItem>
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
                    required
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Description"
                    multiline
                    rows={3}
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Dimensions
              </Typography>
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Controller
                name="specifications.dimensions.length"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Length"
                    type="number"
                    size="small"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Controller
                name="specifications.dimensions.width"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Width"
                    type="number"
                    size="small"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Controller
                name="specifications.dimensions.diameter"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Diameter"
                    type="number"
                    size="small"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={6} sm={3}>
              <Controller
                name="specifications.dimensions.unit"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth size="small">
                    <InputLabel>Unit</InputLabel>
                    <Select {...field} label="Unit">
                      {dimensionUnits.map((unit) => (
                        <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="specifications.material"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Material"
                    placeholder="e.g., Brass C360"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="specifications.grade"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Grade"
                    placeholder="e.g., Commercial, Premium"
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 2:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="inventory.quantity"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Current Stock"
                    type="number"
                    error={!!errors.inventory?.quantity}
                    helperText={errors.inventory?.quantity?.message}
                    required
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="inventory.unit"
                control={control}
                render={({ field }) => (
                  <FormControl fullWidth required>
                    <InputLabel>Unit</InputLabel>
                    <Select {...field} label="Unit">
                      {units.map((unit) => (
                        <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="inventory.reorderLevel"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Reorder Level"
                    type="number"
                    error={!!errors.inventory?.reorderLevel}
                    helperText={errors.inventory?.reorderLevel?.message}
                    required
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="inventory.maxStockLevel"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Max Stock Level"
                    type="number"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Storage Location
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Controller
                name="inventory.location.warehouse"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Warehouse"
                    size="small"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Controller
                name="inventory.location.section"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Section"
                    size="small"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={4}>
              <Controller
                name="inventory.location.shelf"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Shelf"
                    size="small"
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      case 3:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Controller
                name="pricing.costPrice"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Cost Price"
                    type="number"
                    error={!!errors.pricing?.costPrice}
                    helperText={errors.pricing?.costPrice?.message}
                    required
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="pricing.sellingPrice"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Selling Price"
                    type="number"
                    error={!!errors.pricing?.sellingPrice}
                    helperText={errors.pricing?.sellingPrice?.message}
                    required
                    InputProps={{
                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    }}
                  />
                )}
              />
            </Grid>
            
            {costPrice > 0 && sellingPrice > 0 && (
              <Grid item xs={12}>
                <Alert 
                  severity={profitMargin > 20 ? 'success' : profitMargin > 10 ? 'warning' : 'error'}
                  sx={{ mt: 1 }}
                >
                  <Typography variant="body2">
                    <strong>Profit Margin: {profitMargin.toFixed(1)}%</strong>
                    {profitMargin < 10 && ' - Consider increasing selling price'}
                    {profitMargin > 30 && ' - Excellent margin!'}
                  </Typography>
                </Alert>
              </Grid>
            )}
            
            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="supplier.name"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Supplier Name"
                    error={!!errors.supplier?.name}
                    helperText={errors.supplier?.name?.message}
                    required
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="supplier.contact.phone"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Supplier Phone"
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Controller
                name="supplier.contact.email"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Supplier Email"
                    type="email"
                    error={!!errors.supplier?.contact?.email}
                    helperText={errors.supplier?.contact?.email?.message}
                  />
                )}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Controller
                name="notes"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    label="Notes"
                    multiline
                    rows={3}
                    placeholder="Additional notes about this product..."
                  />
                )}
              />
            </Grid>
          </Grid>
        );

      default:
        return null;
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        component: motion.div,
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.9 },
        transition: { duration: 0.2 },
      }}
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            {product ? 'Edit Product' : 'Add New Product'}
          </Typography>
          <IconButton onClick={handleClose} size="small">
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label, index) => {
            const StepIcon = stepIcons[index];
            return (
              <Step key={label}>
                <StepLabel 
                  StepIconComponent={() => (
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: index <= activeStep ? 'primary.main' : 'grey.300',
                        color: index <= activeStep ? 'white' : 'grey.600',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      <StepIcon fontSize="small" />
                    </Box>
                  )}
                >
                  {label}
                </StepLabel>
              </Step>
            );
          })}
        </Stepper>

        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent(activeStep)}
          </motion.div>
        </AnimatePresence>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button 
          onClick={handleClose} 
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Box sx={{ flex: 1 }} />
        
        {activeStep > 0 && (
          <Button 
            onClick={handleBack}
            disabled={isSubmitting}
          >
            Back
          </Button>
        )}
        
        {activeStep < steps.length - 1 ? (
          <Button 
            variant="contained" 
            onClick={handleNext}
            disabled={isSubmitting}
          >
            Next
          </Button>
        ) : (
          <Button
            variant="contained"
            onClick={handleSubmit(handleFormSubmit)}
            disabled={isSubmitting}
            startIcon={isSubmitting ? undefined : <Add />}
          >
            {isSubmitting ? 'Saving...' : (product ? 'Update Product' : 'Add Product')}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default AddProductModal;
