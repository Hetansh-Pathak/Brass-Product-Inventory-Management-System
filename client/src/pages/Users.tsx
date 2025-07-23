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
  Chip,
  IconButton,
  Avatar,
  Fab,
} from '@mui/material';
import {
  Edit,
  Delete,
  Add,
  Block,
  CheckCircle,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const Users: React.FC = () => {
  const [users] = useState([
    {
      id: '1',
      username: 'admin',
      email: 'admin@brass.com',
      role: 'admin',
      isActive: true,
      lastLogin: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      username: 'manager1',
      email: 'manager@brass.com',
      role: 'manager',
      isActive: true,
      lastLogin: '2024-01-14T15:20:00Z',
    },
  ]);

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          User Management
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Manage system users and their permissions
        </Typography>

        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="600" gutterBottom>
              System Users
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>User</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Last Login</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id} hover>
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={2}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {user.username.charAt(0).toUpperCase()}
                          </Avatar>
                          <Typography variant="subtitle2" fontWeight="600">
                            {user.username}
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Chip
                          label={user.role}
                          color={user.role === 'admin' ? 'error' : user.role === 'manager' ? 'warning' : 'default'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={user.isActive ? <CheckCircle /> : <Block />}
                          label={user.isActive ? 'Active' : 'Inactive'}
                          color={user.isActive ? 'success' : 'error'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        {new Date(user.lastLogin).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box display="flex" gap={1}>
                          <IconButton size="small" color="primary">
                            <Edit />
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

export default Users;
