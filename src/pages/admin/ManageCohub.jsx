import React, { useState, useEffect, useCallback } from 'react';
import {
  Container, Typography, Paper, Table, TableHead, TableBody, TableRow, TableCell,
  TablePagination, TextField, Button, Snackbar, Alert, Dialog, DialogTitle, DialogContent,
  DialogActions, MenuItem, Select, FormControl, InputLabel, Switch, Box, Grid
} from '@mui/material';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const ManageCohub = () => {
  const [cohubs, setCohubs] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [selectedCohub, setSelectedCohub] = useState(null);
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [statusSelection, setStatusSelection] = useState('');

  // ✅ Fetch Cohubs
  const fetchCohubs = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/all-cohubs`);
      setCohubs(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to fetch cohubs', severity: 'error' });
    }
  }, []);

  useEffect(() => {
    fetchCohubs();
  }, [fetchCohubs]);

  const filteredCohubs = cohubs.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email?.toLowerCase().includes(search.toLowerCase()) ||
      c.phone?.includes(search)
  );

  // ✅ Update status
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

  // ✅ Toggle flagged
  const handleUpdateFlagged = async (id, flagged) => {
    try {
      const cohub = cohubs.find((c) => c.id === id);
      await axios.put(`${BASE_URL}/api/admin/update-cohub-status-flag/${id}`, {
        status: cohub.status,
        flagged: flagged ? 1 : 0,
      });
      setSnackbar({ open: true, message: 'Flag status updated!', severity: 'success' });
      fetchCohubs();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to update flagged', severity: 'error' });
    }
  };

  // ✅ Toggle showOnLandingPage
  const handleToggleLandingPage = async (id, show) => {
    try {
      await axios.put(`${BASE_URL}/api/admin/update-show-landing/${id}`, {
        showOnLandingPage: show ? 1 : 0,
      });
      setSnackbar({ open: true, message: 'Landing page status updated!', severity: 'success' });
      fetchCohubs();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to update landing page status', severity: 'error' });
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Manage Cohubs</Typography>

      <TextField
        fullWidth placeholder="Search by name, email, phone..."
        value={search} onChange={(e) => setSearch(e.target.value)} sx={{ mb: 2 }}
      />

      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Flagged</TableCell>
              <TableCell>Landing Page</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCohubs.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((c) => (
              <TableRow key={c.id}>
                <TableCell>{c.id}</TableCell>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.email}</TableCell>
                <TableCell>{c.phone}</TableCell>

                {/* ✅ Status */}
                <TableCell>
                  <Button variant="contained" size="small" onClick={() => {
                    setSelectedCohub(c);
                    setStatusSelection(c.status);
                    setStatusModalOpen(true);
                  }}>
                    {c.status || 'pending'}
                  </Button>
                </TableCell>

                {/* ✅ Flagged */}
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

                {/* ✅ Landing Page Toggle */}
                <TableCell>
                  <Switch
                    checked={c.showOnLandingPage === 1}
                    onChange={(e) => handleToggleLandingPage(c.id, e.target.checked)}
                  />
                </TableCell>

                {/* ✅ View */}
                <TableCell>
                  <Button variant="outlined" size="small" onClick={() => {
                    setSelectedCohub(c);
                    setViewModalOpen(true);
                  }}>
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <TablePagination
          rowsPerPageOptions={[5, 10, 20]} component="div"
          count={filteredCohubs.length} rowsPerPage={rowsPerPage}
          page={page} onPageChange={(e, newPage) => setPage(newPage)}
          onRowsPerPageChange={(e) => { setRowsPerPage(parseInt(e.target.value, 10)); setPage(0); }}
        />
      </Paper>

      {/* ✅ View Modal */}
      <Dialog open={viewModalOpen} onClose={() => setViewModalOpen(false)} maxWidth="sm" fullWidth>
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
              <Typography>Show on Landing: {selectedCohub.showOnLandingPage === 1 ? 'Yes' : 'No'}</Typography>

              {/* ✅ Display Images */}
              {selectedCohub.office_images && (
                <Box mt={2}>
                  <Typography>Images:</Typography>
                  <Grid container spacing={2}>
                    {JSON.parse(selectedCohub.office_images).map((img, idx) => (
                      <Grid item xs={4} key={idx}>
                        <img
                          src={`${BASE_URL}/uploads/cohub/${img}`}
                          alt="Cohub"
                          style={{ width: '100%', borderRadius: 8 }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              )}
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setViewModalOpen(false)}>Close</Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Status Modal */}
      <Dialog open={statusModalOpen} onClose={() => setStatusModalOpen(false)}>
        <DialogTitle>Update Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select value={statusSelection} label="Status" onChange={(e) => setStatusSelection(e.target.value)}>
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusModalOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleStatusChange}>Update</Button>
        </DialogActions>
      </Dialog>

      {/* ✅ Snackbar */}
      <Snackbar open={snackbar.open} autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Container>
  );
};

export default ManageCohub;
