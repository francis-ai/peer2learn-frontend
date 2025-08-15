import React, { useEffect, useState } from 'react';
import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, List, ListItem, ListItemText, ListItemSecondaryAction,
  TextField, Typography, Snackbar, Alert
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const LocationManagement = () => {
  const [locations, setLocations] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editId, setEditId] = useState(null);
  const [locationName, setLocationName] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchLocations = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/locations`);
      setLocations(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  const handleOpen = (location = null) => {
    setEditId(location?.id || null);
    setLocationName(location?.location_name || '');
    setOpenDialog(true);
  };

  const handleClose = () => {
    setEditId(null);
    setLocationName('');
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    if (!locationName.trim()) return;

    try {
      if (editId) {
        await axios.put(`${BASE_URL}/api/admin/locations/${editId}`, { location_name: locationName });
        setSnackbar({ open: true, message: 'Location updated', severity: 'success' });
      } else {
        await axios.post(`${BASE_URL}/api/admin/locations`, { location_name: locationName });
        setSnackbar({ open: true, message: 'Location added', severity: 'success' });
      }

      handleClose();
      fetchLocations();
    } catch (err) {
      setSnackbar({ open: true, message: 'Operation failed', severity: 'error' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/locations/${id}`);
      setSnackbar({ open: true, message: 'Location deleted', severity: 'info' });
      fetchLocations();
    } catch (err) {
      setSnackbar({ open: true, message: 'Delete failed', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3, mt: 10 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Manage Locations</Typography>
        <Button variant="contained" startIcon={<Add />} onClick={() => handleOpen()}>Add Location</Button>
      </Box>

      <List>
        {locations.map((loc) => (
          <ListItem key={loc.id} sx={{ border: '1px solid #ddd', borderRadius: 2, mb: 1 }}>
            <ListItemText primary={loc.location_name} />
            <ListItemSecondaryAction>
              <IconButton edge="end" onClick={() => handleOpen(loc)}><Edit /></IconButton>
              <IconButton edge="end" color="error" onClick={() => handleDelete(loc.id)}><Delete /></IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* Dialog Form */}
      <Dialog open={openDialog} onClose={handleClose} maxWidth="xs" fullWidth>
        <DialogTitle>{editId ? 'Edit Location' : 'Add Location'}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus fullWidth margin="normal" label="Location Name"
            value={locationName} onChange={(e) => setLocationName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default LocationManagement;
