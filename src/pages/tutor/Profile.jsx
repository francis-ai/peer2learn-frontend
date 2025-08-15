import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import {
  Box, Typography, Card, CardContent, Avatar, Grid, Chip,
  TextField, Button, Divider, MenuItem, InputAdornment, Snackbar, Alert
} from '@mui/material';
import {
  Person as PersonIcon, 
  Email as EmailIcon, 
  Phone as PhoneIcon,
  Home as AddressIcon,
  School as EducationIcon, 
  Edit as EditIcon,
  CameraAlt as CameraIcon, 
  Save as SaveIcon,
} from '@mui/icons-material';
import FlagIcon from '@mui/icons-material/Flag';
import VerifiedIcon from '@mui/icons-material/Verified';
import ErrorIcon from '@mui/icons-material/Error';

import { useTutorAuth } from '../../context/tutorAuthContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Profile() {
  const { tutor } = useTutorAuth();
  const tutorId = tutor?.id;

  const [editMode, setEditMode] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [locations, setLocations] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    location: '',
    education: '',
    bio: '',
    gender: '',
    status: '',
    verification_status: ''
  });

  const fetchTutorProfile = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/tutors/profile/${tutorId}`);
      const data = res.data;

      setFormData({
        name: data.name || '',
        email: data.email || '',
        phone: data.phone || '',
        address: data.address || '',
        location: data.location || '',
        education: data.degree || '',
        bio: data.bio || '',
        gender: data.gender || '',
        status: data.status || '',
        verification_status: data.verification_status || '',
      });

      if (data.profile_img) {
        setProfileImage(`${BASE_URL}/uploads/tutors/${data.profile_img}`);
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to load profile', severity: 'error' });
    }
  }, [tutorId]);

  const fetchLocations = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/view/locations`);
      setLocations(res.data);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to load locations', severity: 'error' });
    }
  }, []);


  useEffect(() => {
    if (tutorId) {
      fetchTutorProfile();
      fetchLocations();
    }
  }, [tutorId, fetchTutorProfile, fetchLocations]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    try {
      const payload = new FormData();
      payload.append('name', formData.name);
      payload.append('email', formData.email);
      payload.append('phone', formData.phone);
      payload.append('address', formData.address);
      payload.append('degree', formData.education);
      payload.append('bio', formData.bio);
      payload.append('location', formData.location);
      payload.append('gender', formData.gender);
      if (selectedFile) {
        payload.append('profile_img', selectedFile);
      }

      await axios.put(`${BASE_URL}/api/tutors/update-profile/${tutorId}`, payload);

      setSnackbar({ open: true, message: 'Profile updated successfully!', severity: 'success' });
      setEditMode(false);
      fetchTutorProfile();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to update profile', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          My Profile
        </Typography>
        {editMode ? (
          <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
            Save Profile
          </Button>
        ) : (
          <Button variant="outlined" startIcon={<EditIcon />} onClick={() => setEditMode(true)}>
            Edit Profile
          </Button>
        )}
      </Box>

      <Card>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar
                  src={profileImage || '/default-avatar.jpg'}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
                {editMode && (
                  <>
                    <input
                      accept="image/*"
                      style={{ display: 'none' }}
                      id="profile-image-upload"
                      type="file"
                      onChange={handleImageUpload}
                    />
                    <label htmlFor="profile-image-upload">
                      <Button
                        variant="contained"
                        component="span"
                        startIcon={<CameraIcon />}
                        sx={{ mb: 2 }}
                      >
                        Upload Photo
                      </Button>
                    </label>
                  </>
                )}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Typography variant="h6" fontWeight="bold">
                    {formData.name}
                  </Typography>

                  {formData.status === 'flagged' && (
                    <Chip
                      icon={<FlagIcon />}
                      label="Flagged"
                      color="error"
                      size="small"
                      variant="outlined"
                    />
                  )}

                  {formData.verification_status === 'pending' && (
                    <Chip
                      icon={<ErrorIcon />}
                      label="Pending Verification"
                      color="warning"
                      size="small"
                    />
                  )}
                  {formData.verification_status === 'rejected' && (
                    <Chip
                      icon={<ErrorIcon />}
                      label="Verification Rejected"
                      color="error"
                      size="small"
                    />
                  )}
                  {formData.verification_status === 'approved' && (
                    <Chip
                      icon={<VerifiedIcon />}
                      label="Verified"
                      color="success"
                      size="small"
                    />
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} md={8}>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Personal Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PersonIcon color={editMode ? "primary" : "disabled"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailIcon color={editMode ? "primary" : "disabled"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <PhoneIcon color={editMode ? "primary" : "disabled"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AddressIcon color={editMode ? "primary" : "disabled"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Select Location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    sx={{width:  '225px'}}
                  >
                    
                    {locations.map((loc) => (
                      <MenuItem key={loc.id} value={loc.location_name}>
                        {loc.location_name}
                      </MenuItem>
                    ))}

                  </TextField>
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    select
                    fullWidth
                    label="Gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    sx={{width: '225px'}}
                  >
                    <MenuItem value="">Select Gender</MenuItem>
                    <MenuItem value="Male">Male</MenuItem>
                    <MenuItem value="Female">Female</MenuItem>
                  </TextField>
                </Grid>
              </Grid>

              <Typography variant="h6" fontWeight="bold" sx={{ mt: 4, mb: 2 }}>
                Professional Information
              </Typography>
              <Divider sx={{ mb: 3 }} />

              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Education"
                    name="education"
                    value={formData.education}
                    onChange={handleInputChange}
                    disabled={!editMode}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <EducationIcon color={editMode ? "primary" : "disabled"} />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </Box>
  );
}
