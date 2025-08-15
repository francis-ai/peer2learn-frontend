import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  TextField,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocationOn as LocationIcon,
  Business as OfficeIcon
} from '@mui/icons-material';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Offices() {
  const [offices, setOffices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedOfficeId, setSelectedOfficeId] = useState(null);

  const [currentOffice, setCurrentOffice] = useState({
    id: '',
    office_name: '',
    address: '',
    phone_number: '',
    location: ''
  });

  const fetchOffices = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/api/admin/all-offices`);
      setOffices(res.data);
    } catch (err) {
      console.error('Failed to fetch offices:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffices();
  }, []);

  const handleOpenModal = (office = null) => {
    if (office) {
      setEditMode(true);
      setCurrentOffice(office);
    } else {
      setEditMode(false);
      setCurrentOffice({
        id: '',
        office_name: '',
        address: '',
        phone_number: '',
        location: ''
      });
    }
    setOpenModal(true);
  };

  const handleCloseModal = () => setOpenModal(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentOffice(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editMode) {
        await axios.put(`${BASE_URL}/api/admin/update-office/${currentOffice.id}`, currentOffice);
      } else {
        await axios.post(`${BASE_URL}/api/admin/add-office`, currentOffice);
      }
      fetchOffices();
      handleCloseModal();
    } catch (err) {
      console.error('Error saving office:', err);
    }
  };

  const handleOpenDeleteConfirm = (id) => {
    setSelectedOfficeId(id);
    setDeleteConfirmOpen(true);
  };

  const handleCloseDeleteConfirm = () => {
    setSelectedOfficeId(null);
    setDeleteConfirmOpen(false);
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/admin/delete-office/${selectedOfficeId}`);
      fetchOffices();
    } catch (err) {
      console.error('Error deleting office:', err);
    } finally {
      handleCloseDeleteConfirm();
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Office Locations
      </Typography>

      {/* Action Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenModal()}
          >
            Add New Office
          </Button>
        </CardContent>
      </Card>

      {/* Offices Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Office Name</TableCell>
                  <TableCell>Address</TableCell>
                  <TableCell>Location</TableCell>
                  <TableCell>Phone Number</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5}>Loading...</TableCell>
                  </TableRow>
                ) : (
                  offices.map((office) => (
                    <TableRow key={office.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <OfficeIcon color="primary" />
                          <Typography>{office.office_name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <LocationIcon color="secondary" />
                          <Typography>{office.address}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{office.location}</TableCell>
                      <TableCell>{office.phone_number}</TableCell>
                      <TableCell align="right">
                        <IconButton color="primary" onClick={() => handleOpenModal(office)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="error" onClick={() => handleOpenDeleteConfirm(office.id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Office Form Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Typography variant="h6" fontWeight="bold">
            {editMode ? 'Edit Office Location' : 'Add New Office Location'}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3} sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Office Name"
                name="office_name"
                value={currentOffice.office_name}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={currentOffice.address}
                onChange={handleInputChange}
                required
                multiline
                rows={3}
              />
              <TextField
                fullWidth
                label="Location"
                name="location"
                value={currentOffice.location}
                onChange={handleInputChange}
                required
              />
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={currentOffice.phone_number}
                onChange={handleInputChange}
                required
              />
            </Stack>
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseModal}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={
              !currentOffice.office_name ||
              !currentOffice.address ||
              !currentOffice.location ||
              !currentOffice.phone_number
            }
          >
            {editMode ? 'Update Office' : 'Add Office'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={handleCloseDeleteConfirm}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this office?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDeleteConfirm}>Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
