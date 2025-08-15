import React, { useState, useEffect } from 'react';
import { useCohubAuth } from '../../context/cohubAuthContext';
import {
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  Box,
  Typography,
} from '@mui/material';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Dashboard = () => {
  const { cohub, setCohub } = useCohubAuth();
  const [isAvailable, setIsAvailable] = useState(cohub?.is_available || 0);
  const [officeImage, setOfficeImage] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Fetch office image filename from backend on mount or when cohub.id changes
  useEffect(() => {
    if (!cohub?.id) return;

    const fetchOfficeImage = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/cohub/cohub-office-image/${cohub.id}`);
        if (res.data?.office_image) {
          setOfficeImage(res.data.office_image);
        } else {
          setOfficeImage(null);
        }
      } catch (error) {
        console.error('Failed to fetch office image:', error);
        setOfficeImage(null);
      }
    };

    fetchOfficeImage();
  }, [cohub?.id]);

  const handleToggle = async (event) => {
    const newValue = event.target.checked ? 1 : 0;
    setIsAvailable(newValue);

    try {
      await axios.put(`${BASE_URL}/api/cohub/update-availability/${cohub.id}`, { is_available: newValue });

      // Update context to sync UI
      setCohub({ ...cohub, is_available: newValue });

      setSnackbar({ open: true, message: 'Availability updated!', severity: 'success' });
    } catch (error) {
      console.error(error);
      setSnackbar({ open: true, message: 'Failed to update availability', severity: 'error' });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {cohub?.name || 'Cohub User'} 👋
      </Typography>
      <Typography variant="body1" gutterBottom>
        Email: {cohub?.email || 'Not available'}
      </Typography>

      {/* Availability Toggle */}
      <FormControlLabel
        control={
          <Switch
            checked={isAvailable === 1}
            onChange={handleToggle}
            color="primary"
          />
        }
        label={isAvailable === 1 ? 'Available' : 'Not Available'}
      />

      {/* Office Image */}
      {officeImage ? (
        <Box
          component="img"
          src={`${BASE_URL}/uploads/cohub/${officeImage}`}
          alt="Office"
          sx={{
            mt: 3,
            width: 150,
            height: 150,
            objectFit: 'cover',
            borderRadius: 2,
            boxShadow: 3,
          }}
        />
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          No office image uploaded.
        </Typography>
      )}

      {/* Snackbar Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Dashboard;
