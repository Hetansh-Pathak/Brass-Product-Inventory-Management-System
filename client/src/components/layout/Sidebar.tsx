import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Box,
  Divider,
  useTheme,
  Avatar,
  Chip,
} from '@mui/material';
import {
  Dashboard,
  Inventory,
  Build,
  Receipt,
  People,
  Analytics,
  Settings,
  Business,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../../contexts/AuthContext';

const drawerWidth = 280;

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  path: string;
  roles?: string[];
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <Dashboard />,
    path: '/dashboard',
  },
  {
    id: 'inventory',
    label: 'Inventory',
    icon: <Inventory />,
    path: '/inventory',
  },
  {
    id: 'raw-materials',
    label: 'Raw Materials',
    icon: <Build />,
    path: '/raw-materials',
  },
  {
    id: 'billing',
    label: 'Billing',
    icon: <Receipt />,
    path: '/billing',
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: <Analytics />,
    path: '/analytics',
    roles: ['admin', 'manager'],
  },
  {
    id: 'users',
    label: 'Users',
    icon: <People />,
    path: '/users',
    roles: ['admin'],
  },
];

const Sidebar: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const { user } = useAuth();

  // Filter navigation items based on user role
  const filteredNavItems = navigationItems.filter(item => {
    if (!item.roles) return true;
    return user && item.roles.includes(user.role);
  });

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          background: `linear-gradient(135deg, ${theme.palette.primary.main}10 0%, ${theme.palette.secondary.main}20 100%)`,
          backdropFilter: 'blur(10px)',
          borderRight: `1px solid ${theme.palette.divider}`,
        },
      }}
    >
      <Box sx={{ overflow: 'auto', height: '100%' }}>
        {/* Header */}
        <Box
          sx={{
            p: 3,
            textAlign: 'center',
            borderBottom: `1px solid ${theme.palette.divider}`,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
            color: 'white',
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          >
            <Business sx={{ fontSize: 40, mb: 1 }} />
          </motion.div>
          <Typography variant="h6" fontWeight="bold">
            Brass Industries
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.9 }}>
            Management System
          </Typography>
        </Box>

        {/* User Info */}
        {user && (
          <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
            <Box display="flex" alignItems="center" gap={2}>
              <Avatar
                sx={{
                  bgcolor: theme.palette.primary.main,
                  width: 40,
                  height: 40,
                }}
              >
                {user.username.charAt(0).toUpperCase()}
              </Avatar>
              <Box flex={1}>
                <Typography variant="subtitle2" fontWeight="600">
                  {user.username}
                </Typography>
                <Chip
                  label={user.role}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '0.7rem',
                    height: 20,
                    textTransform: 'capitalize',
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}

        {/* Navigation */}
        <List sx={{ px: 1, py: 2 }}>
          {filteredNavItems.map((item, index) => {
            const isActive = location.pathname === item.path;
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => handleNavigation(item.path)}
                    sx={{
                      borderRadius: 2,
                      mx: 1,
                      transition: 'all 0.3s ease',
                      backgroundColor: isActive 
                        ? `${theme.palette.primary.main}20` 
                        : 'transparent',
                      color: isActive 
                        ? theme.palette.primary.main 
                        : theme.palette.text.primary,
                      '&:hover': {
                        backgroundColor: `${theme.palette.primary.main}10`,
                        transform: 'translateX(8px)',
                      },
                      ...(isActive && {
                        '&::before': {
                          content: '""',
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 4,
                          backgroundColor: theme.palette.primary.main,
                          borderRadius: '0 4px 4px 0',
                        },
                      }),
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: 'inherit',
                        minWidth: 40,
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.95rem',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </motion.div>
            );
          })}
        </List>

        <Divider sx={{ mx: 2 }} />

        {/* Settings */}
        <List sx={{ px: 1, py: 1 }}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
          >
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => handleNavigation('/profile')}
                sx={{
                  borderRadius: 2,
                  mx: 1,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: `${theme.palette.primary.main}10`,
                    transform: 'translateX(8px)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 40 }}>
                  <Settings />
                </ListItemIcon>
                <ListItemText
                  primary="Settings"
                  primaryTypographyProps={{
                    fontSize: '0.95rem',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </motion.div>
        </List>

        {/* Footer */}
        <Box
          sx={{
            mt: 'auto',
            p: 2,
            textAlign: 'center',
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Typography variant="caption" color="text.secondary">
            © 2024 Brass Industries
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
