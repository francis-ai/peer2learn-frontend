// IMPORTS
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
  Stack,
  Chip,
  Pagination,
  CircularProgress,
  Snackbar,
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextareaAutosize,
  Switch,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function TutorCourses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [rejectDialog, setRejectDialog] = useState({ open: false, id: null });
  const [rejectReason, setRejectReason] = useState('');

  const rowsPerPage = 5;

  useEffect(() => {
    fetchTutorCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(
      (course) =>
        course.tutor_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  // ✅ Fetch tutor courses
  const fetchTutorCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/all-tutor-courses`);
      setCourses(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (err) {
      console.error('Failed to fetch tutor courses:', err);
      setSnackbar({ open: true, message: 'Failed to load tutor courses.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update course approval/rejection
  const handleStatusUpdate = async (id, status, reason = '') => {
    try {
      const res = await axios.put(`${BASE_URL}/api/admin/tutor-course-status/${id}`, {
        status,
        reason,
      });
      if (res.data.success) {
        setCourses((prev) => prev.map((c) => (c.tutor_course_id === id ? { ...c, status } : c)));
        setSnackbar({ open: true, message: `Course ${status} successfully.`, severity: 'success' });
      }
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Failed to update course status.', severity: 'error' });
    }
  };

  // ✅ Toggle showOnLandingPage — like ManageCohub
  const handleToggleLandingPage = async (id, show) => {
    try {
      await axios.put(`${BASE_URL}/api/admin/update-tutor-course-show-landing/${id}`, {
        showOnLandingPage: show ? 1 : 0,
      });

      // ✅ Update state immediately
      setCourses((prev) =>
        prev.map((c) =>
          c.tutor_course_id === id
            ? { ...c, showOnLandingPage: show ? 1 : 0 }
            : c
        )
      );

      setSnackbar({
        open: true,
        message: 'Landing page status updated!',
        severity: 'success',
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: 'Failed to update landing page status.',
        severity: 'error',
      });
    }
  };


  const handleReject = (id) => setRejectDialog({ open: true, id });
  const confirmReject = () => {
    handleStatusUpdate(rejectDialog.id, 'rejected', rejectReason);
    setRejectDialog({ open: false, id: null });
    setRejectReason('');
  };
  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Tutor Course Management
      </Typography>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search tutor or course..."
              InputProps={{ startAdornment: <SearchIcon color="action" /> }}
              sx={{ flexGrow: 1 }}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Stack>
        </CardContent>
      </Card>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 5 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Card>
          <CardContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Tutor</TableCell>
                    <TableCell>Course</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Location</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Show on Landing</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCourses
                    .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                    .map((c) => (
                      <TableRow key={c.tutor_course_id} hover>
                        <TableCell>{c.tutor_name}</TableCell>
                        <TableCell>{c.course_name}</TableCell>
                        <TableCell>{c.category}</TableCell>
                        <TableCell>{c.location}</TableCell>
                        <TableCell>₦{c.price}</TableCell>
                        <TableCell>
                          <Chip
                            label={c.status}
                            color={
                              c.status === 'approved'
                                ? 'success'
                                : c.status === 'rejected'
                                ? 'error'
                                : 'warning'
                            }
                            size="small"
                          />
                        </TableCell>

                        {/* ✅ Switch format from ManageCohub */}
                        <TableCell>
                          <Switch
                            checked={c.showOnLandingPage === 1}
                            onChange={(e) =>
                              handleToggleLandingPage(c.tutor_course_id, e.target.checked)
                            }
                            color="primary"
                          />
                        </TableCell>

                        <TableCell align="right">
                          {c.status === 'pending' ? (
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Button
                                variant="outlined"
                                color="success"
                                size="small"
                                onClick={() =>
                                  handleStatusUpdate(c.tutor_course_id, 'approved')
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleReject(c.tutor_course_id)}
                              >
                                Reject
                              </Button>
                            </Stack>
                          ) : (
                            '—'
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={Math.ceil(filteredCourses.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* Reject Dialog */}
      <Dialog open={rejectDialog.open} onClose={() => setRejectDialog({ open: false, id: null })}>
        <DialogTitle>Rejection Reason</DialogTitle>
        <DialogContent>
          <TextareaAutosize
            minRows={4}
            placeholder="Enter reason for rejecting the course"
            style={{ width: '100%' }}
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectDialog({ open: false, id: null })}>Cancel</Button>
          <Button variant="contained" color="error" onClick={confirmReject}>
            Confirm Reject
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
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
