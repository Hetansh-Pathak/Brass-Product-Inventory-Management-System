import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  Box,
  Badge,
  Tooltip,
  Switch,
  FormControlLabel,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Notifications,
  AccountCircle,
  Logout,
  Settings,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';
import { useThemeContext } from '../../contexts/ThemeContext';

const Navbar: React.FC = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [notificationAnchor, setNotificationAnchor] = useState<null | HTMLElement>(null);
  
  const { user, logout } = useAuth();
  const { darkMode, toggleTheme } = useThemeContext();
  const theme = useTheme();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationMenu = (event: React.MouseEvent<HTMLElement>) => {
    setNotificationAnchor(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleNotificationClose = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    logout();
    handleClose();
  };

  // Mock notifications - in real app, this would come from context/API
  const notifications = [
    { id: 1, title: 'Low Stock Alert', message: 'Brass Rod stock is running low', time: '5m ago', type: 'warning' },
    { id: 2, title: 'New Order', message: 'Order #BR-001234 received', time: '1h ago', type: 'info' },
    { id: 3, title: 'Payment Received', message: 'Payment for Invoice #INV-2024-000123', time: '2h ago', type: 'success' },
  ];

  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'transparent',
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
        mb: 3,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between', px: { xs: 2, sm: 3 } }}>
        {/* Left section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h6"
            component="div"
            sx={{
              fontWeight: 600,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Welcome back, {user?.username}!
          </Typography>
        </motion.div>

        {/* Right section */}
        <Box display="flex" alignItems="center" gap={1}>
          {/* Theme Toggle */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Tooltip title={`Switch to ${darkMode ? 'light' : 'dark'} mode`}>
              <IconButton
                onClick={toggleTheme}
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'rotate(180deg)',
                  },
                }}
              >
                {darkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>
          </motion.div>

          {/* Notifications */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Tooltip title="Notifications">
              <IconButton
                onClick={handleNotificationMenu}
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <Badge badgeContent={notifications.length} color="error">
                  <Notifications />
                </Badge>
              </IconButton>
            </Tooltip>
          </motion.div>

          {/* User Menu */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Tooltip title="Account">
              <IconButton
                onClick={handleMenu}
                sx={{
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.1)',
                  },
                }}
              >
                <Avatar
                  sx={{
                    width: 32,
                    height: 32,
                    bgcolor: theme.palette.primary.main,
                    fontSize: '1rem',
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
            </Tooltip>
          </motion.div>
        </Box>

        {/* Notification Menu */}
        <Menu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={handleNotificationClose}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              width: 320,
              maxHeight: 400,
              mt: 1,
              borderRadius: 2,
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="h6" fontWeight="600">
              Notifications
            </Typography>
          </Box>
          {notifications.map((notification) => (
            <MenuItem
              key={notification.id}
              onClick={handleNotificationClose}
              sx={{
                py: 2,
                px: 2,
                borderBottom: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                '&:last-child': {
                  borderBottom: 'none',
                },
              }}
            >
              <Box>
                <Typography variant="subtitle2" fontWeight="600" gutterBottom>
                  {notification.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {notification.message}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {notification.time}
                </Typography>
              </Box>
            </MenuItem>
          ))}
          {notifications.length === 0 && (
            <Box sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                No new notifications
              </Typography>
            </Box>
          )}
        </Menu>

        {/* User Menu */}
        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          PaperProps={{
            sx: {
              width: 200,
              mt: 1,
              borderRadius: 2,
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Typography variant="subtitle2" fontWeight="600">
              {user?.username}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {user?.email}
            </Typography>
          </Box>
          <MenuItem onClick={handleClose}>
            <AccountCircle sx={{ mr: 2 }} />
            Profile
          </MenuItem>
          <MenuItem onClick={handleClose}>
            <Settings sx={{ mr: 2 }} />
            Settings
          </MenuItem>
          <MenuItem onClick={handleLogout}>
            <Logout sx={{ mr: 2 }} />
            Logout
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
