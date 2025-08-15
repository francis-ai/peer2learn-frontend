import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TablePagination,
  TextField,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ManageCohub = () => {
  const [cohubs, setCohubs] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Modal states
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCohub, setSelectedCohub] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusSelection, setStatusSelection] = useState('');

  // Fetch cohubs
  const fetchCohubs = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/all-cohubs`);
      setCohubs(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to fetch cohubs', severity: 'error' });
    }
  };

  useEffect(() => {
    fetchCohubs();
  }, []);

  const filteredCohubs = Array.isArray(cohubs)
    ? cohubs.filter(
        (c) =>
          c.name?.toLowerCase().includes(search.toLowerCase()) ||
          c.email?.toLowerCase().includes(search.toLowerCase()) ||
          c.phone?.includes(search)
      )
    : [];

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleUpdateFlagged = async (id, flagged) => {
    try {
      const cohub = cohubs.find((c) => c.id === id);
      if (!cohub) return;

      await axios.put(`${BASE_URL}/api/admin/update-cohub-status-flag/${id}`, {
        status: cohub.status,
        flagged: flagged ? 1 : 0,
      });

      setSnackbar({ open: true, message: 'Flagged updated!', severity: 'success' });
      fetchCohubs();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to update flagged', severity: 'error' });
    }
  };

  const handleOpenStatusModal = (cohub) => {
    setSelectedCohub(cohub);
    setStatusSelection(cohub.status);
    setStatusModalOpen(true);
  };

  const handleStatusChange = async () => {
    if (!selectedCohub) return;
    try {
      await axios.put(`${BASE_URL}/api/admin/update-cohub-status-flag/${selectedCohub.id}`, {
        status: statusSelection,
        flagged: selectedCohub.flagged,
      });
      setSnackbar({ open: true, message: 'Status updated!', severity: 'success' });
      setStatusModalOpen(false);
      fetchCohubs();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to update status', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Manage Cohubs
      </Typography>

      <TextField
        fullWidth
        placeholder="Search by name, email, phone..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      <Paper sx={{ width: '100%', overflowX: 'auto' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Flagged</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCohubs
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{c.id}</TableCell>
                  <TableCell>{c.name}</TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone}</TableCell>

                  {/* Status button */}
                  <TableCell>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleOpenStatusModal(c)}
                    >
                      {c.status || 'pending'}
                    </Button>
                  </TableCell>

                  {/* Flagged button */}
                  <TableCell>
                    <Button
                      variant={c.flagged === 1 ? 'contained' : 'outlined'}
                      color={c.flagged === 1 ? 'error' : 'primary'}
                      size="small"
                      onClick={() => handleUpdateFlagged(c.id, c.flagged === 0)}
                    >
                      {c.flagged === 1 ? 'Flagged' : 'Clean'}
                    </Button>
                  </TableCell>

                  {/* View */}
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setSelectedCohub(c);
                        setViewModalOpen(true);
                      }}
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={filteredCohubs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* View Modal */}
      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)}>
        <DialogTitle>Cohub Details</DialogTitle>
        <DialogContent>
          {selectedCohub && (
            <>
              <Typography>Name: {selectedCohub.name}</Typography>
              <Typography>Email: {selectedCohub.email}</Typography>
              <Typography>Phone: {selectedCohub.phone}</Typography>
              <Typography>Address: {selectedCohub.address}</Typography>
              <Typography>Status: {selectedCohub.status}</Typography>
              <Typography>Flagged: {selectedCohub.flagged === 1 ? 'Yes' : 'No'}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* Status Modal */}
      <Dialog open={statusModalOpen} onClose={() => setStatusModalOpen(false)}>
        <DialogTitle>Update Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={statusSelection}
              label="Status"
              onChange={(e) => setStatusSelection(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleStatusChange}>
            Update
          </Button>
        </DialogActions>
      </Dialog>

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
    </Container>
  );
};

export default ManageCohub;
