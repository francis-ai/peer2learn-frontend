import { useState, useEffect } from 'react';
import {
  Avatar, Box, Button, Card, CardContent, CardHeader,
  Dialog, DialogActions, DialogContent, MenuItem,
  DialogTitle, Divider, Grid, IconButton, TextField, Typography,
  Snackbar, Alert
} from '@mui/material';
import {
  Edit as EditIcon, CameraAlt as CameraIcon, Person as PersonIcon,
  Close as CloseIcon, Lock as LockIcon,
  // Delete as DeleteIcon
} from '@mui/icons-material';
import { useAuth } from '../../context/studentAuthContext';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Profile = () => {
  const { student } = useAuth();
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone_number: '',
    address: '',
    gender: '',
  });

  const [openEditModal, setOpenEditModal] = useState(false);
  const [openPasswordModal, setOpenPasswordModal] = useState(false);

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (student?.id) {
      axios.get(`${BASE_URL}/api/students/profile/${student.id}`)
        .then(res => {
          const data = res.data;
          setFormData({
            name: data.name,
            email: data.email,
            phone_number: data.phone_number || '',
            address: data.address || '',
            gender: data.gender || '',
          });
          setPreview(`${BASE_URL}/uploads/students/${data.profile_img}`);
        })
        .catch(() => showSnackbar("Failed to fetch profile", "error"));
    }
  }, [student]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.entries(formData).forEach(([key, val]) => form.append(key, val));
    if (avatar) form.append('profile_img', avatar);

    try {
      await axios.put(`${BASE_URL}/api/students/profile/${student.id}`, form);
      showSnackbar("Profile updated successfully", "success");
      setOpenEditModal(false);
    } catch (err) {
      showSnackbar("Profile update failed", "error");
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (newPassword !== confirmPassword) {
      return showSnackbar("Passwords do not match", "error");
    }

    try {
      await axios.put(`${BASE_URL}/api/students/change-password/${student.id}`, {
        currentPassword, newPassword
      });
      showSnackbar("Password changed successfully", "success");
      setOpenPasswordModal(false);
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      showSnackbar(err.response?.data?.message || "Password change failed", "error");
    }
  };

  return (
    <Box sx={{ p: 3, mt: 12 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4} sx={{ mx: 'auto' }}>
          <Card elevation={3}>
            <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <Avatar
                  src={preview}
                  sx={{ width: 150, height: 150, fontSize: 60 }}
                >
                  <PersonIcon fontSize="inherit" />
                </Avatar>
                <IconButton
                  component="label"
                  sx={{
                    position: 'absolute', bottom: 0, right: 0,
                    bgcolor: 'primary.main', color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' }
                  }}
                >
                  <CameraIcon />
                  <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                </IconButton>
              </Box>

              <Typography variant="h6">{formData.name}</Typography>
              <Typography color="text.secondary">{formData.email}</Typography>

              <Button
                variant="outlined"
                startIcon={<EditIcon />}
                onClick={() => setOpenEditModal(true)}
                sx={{ mt: 2 }}
              >
                Edit Profile
              </Button>
            </CardContent>
            <Divider />
          </Card>

          {/* Account Settings */}
          <Box sx={{ mt: 4 }}>
            <Card elevation={3}>
              <CardHeader title="Account Settings" />
              <Divider />
              <CardContent>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Button
                      fullWidth variant="outlined"
                      startIcon={<LockIcon />}
                      onClick={() => setOpenPasswordModal(true)}
                    >
                      Change Password
                    </Button>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      </Grid>

      {/* Edit Profile Modal */}
      <Dialog open={openEditModal} onClose={() => setOpenEditModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Edit Profile</Typography>
            <IconButton onClick={() => setOpenEditModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <form onSubmit={handleEditSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Full Name" name="name"
                  value={formData.name} onChange={handleFormChange} margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  fullWidth
                  label="Gender"
                  name="gender"
                  value={formData.gender}
                  onChange={handleFormChange}
                  margin="normal"
                  sx={{ width: { xs: '100%', sm: '100%', md: '190px' } }}
                >
                  <MenuItem disabled value="">
                    Select Gender
                  </MenuItem>
                  <MenuItem value="Male">Male</MenuItem>
                  <MenuItem value="Female">Female</MenuItem>
                </TextField>
              </Grid>

              <Grid item xs={12}>
                <TextField
                  fullWidth label="Phone Number" name="phone_number"
                  value={formData.phone_number} onChange={handleFormChange} margin="normal"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth label="Address" name="address"
                  value={formData.address} onChange={handleFormChange} margin="normal"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEditModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Save Changes</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Change Password Modal */}
      <Dialog open={openPasswordModal} onClose={() => setOpenPasswordModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Change Password</Typography>
            <IconButton onClick={() => setOpenPasswordModal(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <form onSubmit={handlePasswordSubmit}>
          <DialogContent dividers>
            <TextField
              fullWidth type="password" label="Current Password" name="currentPassword"
              value={passwordForm.currentPassword} onChange={handlePasswordChange} margin="normal" required
            />
            <TextField
              fullWidth type="password" label="New Password" name="newPassword"
              value={passwordForm.newPassword} onChange={handlePasswordChange} margin="normal" required
            />
            <TextField
              fullWidth type="password" label="Confirm New Password" name="confirmPassword"
              value={passwordForm.confirmPassword} onChange={handlePasswordChange} margin="normal" required
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenPasswordModal(false)}>Cancel</Button>
            <Button type="submit" variant="contained" color="primary">Update Password</Button>
          </DialogActions>
        </form>
      </Dialog>

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Profile;
