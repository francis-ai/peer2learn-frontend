import React, { useEffect, useState } from 'react';
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
  TextField,
  Button,
  Avatar,
  Stack,
  Chip,
  Pagination,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  FormControl,
  Modal,
  InputLabel,
} from '@mui/material';
import {
  Search as SearchIcon,
  Verified as VerifiedIcon,
  Pending as PendingIcon,
  Block as BlockedIcon,
  CheckCircle as ApprovedIcon,
  Star as RatingIcon,
  FilterList as FilterIcon,
  MoreVert as MoreIcon,
} from '@mui/icons-material';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: 2,
  boxShadow: 24,
  p: 4,
};

export default function ManageTutor() {
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeFilter, setActiveFilter] = useState('all');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Use a single state for the selected tutor (used for modal and edit dialog)
  const [selectedTutor, setSelectedTutor] = useState(null);

  const [editStatus, setEditStatus] = useState('');
  const [editVerification, setEditVerification] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  const rowsPerPage = 5;

  useEffect(() => {
    fetchTutors();
  }, []);

  useEffect(() => {
    const filtered = tutors.filter((tutor) => {
      const matchesSearch =
        tutor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.email?.toLowerCase().includes(searchTerm.toLowerCase());

      if (activeFilter === 'all') return matchesSearch;
      return matchesSearch && tutor.verification_status === activeFilter;
    });
    setFilteredTutors(filtered);
    setPage(1); // reset page on filter/search change
  }, [searchTerm, tutors, activeFilter]);

  const fetchTutors = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/all-tutors`);
      const data = await res.json();
      setTutors(data);
    } catch (err) {
      setSnackbar({
        open: true,
        message: 'Failed to load tutors.',
        severity: 'error',
      });
    }
  };

  // Open modal for detailed view
  const handleOpenModal = (tutor) => {
    setSelectedTutor(tutor);
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setSelectedTutor(null);
    setOpenModal(false);
  };

  // Open edit dialog and initialize fields
  const handleEditClick = (tutor) => {
    setSelectedTutor(tutor);
    setEditStatus(tutor.status);
    setEditVerification(tutor.verification_status);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setSelectedTutor(null);
    setOpenDialog(false);
  };

  const handleUpdateTutor = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/tutor-status/${selectedTutor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: editStatus,
          verification_status: editVerification,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Update failed');

      // Update the tutor locally after success
      setTutors((prev) =>
        prev.map((t) =>
          t.id === selectedTutor.id
            ? { ...t, status: editStatus, verification_status: editVerification }
            : t
        )
      );

      setSnackbar({ open: true, message: 'Tutor updated successfully.', severity: 'success' });
      handleCloseDialog();
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleFilterSelect = (filter) => {
    setActiveFilter(filter);
    handleMenuClose();
  };
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Tutor Management
      </Typography>

      {/* Action Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search tutors..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ flexGrow: 1 }}
            />
            <Button
              variant="outlined"
              startIcon={<FilterIcon />}
              endIcon={<MoreIcon />}
              onClick={handleMenuOpen}
            >
              {activeFilter === 'all' ? 'Filter' : `${activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}`}
            </Button>
            <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
              <MenuItem onClick={() => handleFilterSelect('all')}>All Tutors</MenuItem>
              <MenuItem onClick={() => handleFilterSelect('approved')}>Approved</MenuItem>
              <MenuItem onClick={() => handleFilterSelect('pending')}>Pending</MenuItem>
              <MenuItem onClick={() => handleFilterSelect('rejected')}>Rejected</MenuItem>
            </Menu>
          </Stack>
        </CardContent>
      </Card>

      {/* Tutors Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tutor</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Verification</TableCell>
                  <TableCell align="right">Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredTutors
                  .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                  .map((tutor) => (
                    <TableRow
                      key={tutor.id}
                      hover
                      sx={{ cursor: 'pointer' }}
                      onClick={() => handleOpenModal(tutor)}
                    >
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={2}>
                          <Avatar sx={{ bgcolor: 'primary.main' }}>
                            {tutor.name?.[0]?.toUpperCase()}
                          </Avatar>
                          <Box>
                            <Typography>{tutor.name}</Typography>
                            <Typography variant="body2" color="text.secondary">
                              {tutor.email}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={<RatingIcon fontSize="small" />}
                          label={tutor.ratings}
                          color="primary"
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={
                            tutor.status === 'active' ? (
                              <VerifiedIcon fontSize="small" />
                            ) : (
                              <BlockedIcon fontSize="small" />
                            )
                          }
                          label={tutor.status}
                          color={tutor.status === 'active' ? 'success' : 'warning'}
                          size="small"
                        />
                      </TableCell>
                      <TableCell>
                        <Chip
                          icon={
                            tutor.verification_status === 'approved' ? (
                              <ApprovedIcon fontSize="small" />
                            ) : (
                              <PendingIcon fontSize="small" />
                            )
                          }
                          label={tutor.verification_status}
                          color={
                            tutor.verification_status === 'approved' ? 'success' : 'warning'
                          }
                          size="small"
                        />
                      </TableCell>
                      <TableCell
                        align="right"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent modal open when clicking button
                          handleEditClick(tutor);
                        }}
                      >
                        <Button variant="outlined" size="small">
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={Math.ceil(filteredTutors.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        </CardContent>
      </Card>

      {/* Tutor Details Modal */}
      <Modal open={openModal} onClose={handleCloseModal}>
        <Box sx={style}>
          {selectedTutor && (
            <>
              <Typography variant="h6" gutterBottom>
                {selectedTutor.name} — Details
              </Typography>
              <Typography>
                <strong>Email:</strong> {selectedTutor.email}
              </Typography>
              <Typography>
                <strong>Address:</strong> {selectedTutor.address || 'N/A'}
              </Typography>
              <Typography>
                <strong>Location:</strong> {selectedTutor.location || 'N/A'}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {selectedTutor.phone || 'N/A'}
              </Typography>
              <Typography>
                <strong>Degree:</strong> {selectedTutor.degree || 'N/A'}
              </Typography>
              <Typography>
                <strong>Bio:</strong> {selectedTutor.bio || 'N/A'}
              </Typography>
              <Typography>
                <strong>Gender:</strong> {selectedTutor.gender || 'N/A'}
              </Typography>
              <Typography>
                <strong>Created At:</strong>{' '}
                {new Date(selectedTutor.created_at).toLocaleString()}
              </Typography>
              <Typography>
                <strong>Total Earnings:</strong> ₦{selectedTutor.total_earnings}
              </Typography>
              <Typography>
                <strong>Available Balance:</strong> ₦{selectedTutor.available_balance}
              </Typography>
              <Typography>
                <strong>Total Withdrawn:</strong>{' '}
                {selectedTutor.total_withdrawn ?? 'N/A'}
              </Typography>
              {selectedTutor.profile_img && (
                <Box mt={2}>
                  <img
                    src={`/uploads/tutors/${selectedTutor.profile_img}`}
                    alt={`${selectedTutor.name} profile`}
                    style={{ width: '100%', borderRadius: 8 }}
                  />
                </Box>
              )}
              <Box mt={2} textAlign="right">
                <Button variant="contained" onClick={handleCloseModal}>
                  Close
                </Button>
              </Box>
            </>
          )}
        </Box>
      </Modal>

      {/* Edit Status Dialog */}
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Edit Tutor Status</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Status</InputLabel>
            <Select
              value={editStatus}
              label="Status"
              onChange={(e) => setEditStatus(e.target.value)}
            >
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="flagged">Flagged</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>Verification Status</InputLabel>
            <Select
              value={editVerification}
              label="Verification Status"
              onChange={(e) => setEditVerification(e.target.value)}
            >
              <MenuItem value="pending">Pending</MenuItem>
              <MenuItem value="approved">Approved</MenuItem>
              <MenuItem value="rejected">Rejected</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdateTutor}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
