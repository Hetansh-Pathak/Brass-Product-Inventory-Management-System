import React, { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Avatar,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Person,
  Security,
  Notifications,
  Palette,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useThemeContext } from '../contexts/ThemeContext';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { darkMode, toggleTheme } = useThemeContext();
  const [editMode, setEditMode] = useState(false);

  return (
    <Box>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          Profile Settings
        </Typography>
        <Typography variant="body1" color="text.secondary" mb={3}>
          Manage your account settings and preferences
        </Typography>

        <Grid container spacing={3}>
          {/* Profile Info */}
          <Grid xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Person />
                  <Typography variant="h6" fontWeight="600">
                    Profile Information
                  </Typography>
                </Box>
                
                <Box display="flex" justifyContent="center" mb={3}>
                  <Avatar
                    sx={{
                      width: 100,
                      height: 100,
                      bgcolor: 'primary.main',
                      fontSize: '2rem',
                    }}
                  >
                    {user?.username?.charAt(0).toUpperCase()}
                  </Avatar>
                </Box>

                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    label="Username"
                    value={user?.username || ''}
                    disabled={!editMode}
                    fullWidth
                  />
                  <TextField
                    label="Email"
                    value={user?.email || ''}
                    disabled={!editMode}
                    fullWidth
                  />
                  <TextField
                    label="Role"
                    value={user?.role || ''}
                    disabled
                    fullWidth
                  />
                </Box>

                <Box mt={3}>
                  <Button
                    variant={editMode ? "contained" : "outlined"}
                    onClick={() => setEditMode(!editMode)}
                    fullWidth
                  >
                    {editMode ? 'Save Changes' : 'Edit Profile'}
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Security Settings */}
          <Grid xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Security />
                  <Typography variant="h6" fontWeight="600">
                    Security Settings
                  </Typography>
                </Box>

                <Box display="flex" flexDirection="column" gap={2}>
                  <TextField
                    label="Current Password"
                    type="password"
                    fullWidth
                  />
                  <TextField
                    label="New Password"
                    type="password"
                    fullWidth
                  />
                  <TextField
                    label="Confirm New Password"
                    type="password"
                    fullWidth
                  />
                </Box>

                <Box mt={3}>
                  <Button variant="contained" fullWidth>
                    Change Password
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Preferences */}
          <Grid xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Palette />
                  <Typography variant="h6" fontWeight="600">
                    Appearance
                  </Typography>
                </Box>

                <FormControlLabel
                  control={
                    <Switch
                      checked={darkMode}
                      onChange={toggleTheme}
                    />
                  }
                  label="Dark Mode"
                />
              </CardContent>
            </Card>
          </Grid>

          {/* Notifications */}
          <Grid xs={12} md={6}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" gap={2} mb={3}>
                  <Notifications />
                  <Typography variant="h6" fontWeight="600">
                    Notification Settings
                  </Typography>
                </Box>

                <Box display="flex" flexDirection="column" gap={1}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Email Notifications"
                  />
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Push Notifications"
                  />
                  <FormControlLabel
                    control={<Switch />}
                    label="SMS Notifications"
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </motion.div>
    </Box>
  );
};

export default Profile;
