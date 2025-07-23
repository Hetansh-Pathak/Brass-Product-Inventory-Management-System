import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Chip,
  Fab,
  Avatar,
  Grid,
} from '@mui/material';
import {
  Add,
  Edit,
  Delete,
  Print,
  Receipt,
  Person,
  AttachMoney,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Billing: React.FC = () => {
  const [bills] = useState([
    {
      id: '1',
      billNumber: 'INV-2024-001',
      customerName: 'ABC Corp',
      amount: 15000,
      status: 'paid',
      date: '2024-01-15',
    },
    {
      id: '2',
      billNumber: 'INV-2024-002',
      customerName: 'XYZ Ltd',
      amount: 8500,
      status: 'pending',
      date: '2024-01-14',
    },
  ]);

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Billing System
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Create and manage bills for your brass products
        </Typography>

        {/* Stats Cards */}
        <Grid container spacing={3} mb={3}>
          <Grid xs={12} sm={6} md={3}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box>
                    <Typography variant="h4" fontWeight="bold" color="primary">
                      {bills.length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Bills
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <Receipt />
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
                      ${bills.reduce((sum, bill) => sum + bill.amount, 0).toLocaleString()}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Total Revenue
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'success.main' }}>
                    <AttachMoney />
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
                      {bills.filter(b => b.status === 'pending').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Bills
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'warning.main' }}>
                    <Person />
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
                    <Typography variant="h4" fontWeight="bold" color="info.main">
                      {bills.filter(b => b.status === 'paid').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Paid Bills
                    </Typography>
                  </Box>
                  <Avatar sx={{ bgcolor: 'info.main' }}>
                    <Receipt />
                  </Avatar>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Bills Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              Recent Bills
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Bill Number</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell>Amount</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bills.map((bill) => (
                    <TableRow key={bill.id} hover>
                      <TableCell>
                        <Typography variant="subtitle2" fontWeight="600">
                          {bill.billNumber}
                        </Typography>
                      </TableCell>
                      <TableCell>{bill.customerName}</TableCell>
                      <TableCell>${bill.amount.toLocaleString()}</TableCell>
                      <TableCell>{bill.date}</TableCell>
                      <TableCell>
                        <Chip
                          label={bill.status}
                          color={bill.status === 'paid' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <IconButton size="small" color="primary">
                            <Edit />
                          </IconButton>
                          <IconButton size="small" color="info">
                            <Print />
                          </IconButton>
                          <IconButton size="small" color="error">
                            <Delete />
                          </IconButton>
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>

        {/* Add Bill FAB */}
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
      </motion.div>
    </Box>
  );
};

export default Billing;
