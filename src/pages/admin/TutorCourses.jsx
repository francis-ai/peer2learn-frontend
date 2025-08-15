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
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function TutorCourses() {
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });
  const [rejectDialog, setRejectDialog] = useState({ open: false, id: null });
  const [rejectReason, setRejectReason] = useState('');

  const rowsPerPage = 5;

  useEffect(() => {
    fetchTutorCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(
      (course) =>
        course.tutor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        course.course_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [searchTerm, courses]);

  const fetchTutorCourses = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/all-tutor-courses`);
      const data = await res.json();
      setCourses(data);
    } catch (err) {
      console.error('Failed to fetch tutor courses:', err);
      setSnackbar({
        open: true,
        message: 'Failed to load tutor courses.',
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (id, status, reason = '') => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/tutor-course-status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, reason }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update status');

      setCourses((prev) =>
        prev.map((c) =>
          c.tutor_course_id === id ? { ...c, status } : c
        )
      );

      setSnackbar({
        open: true,
        message: `Course status updated to "${status}"`,
        severity: 'success',
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: err.message,
        severity: 'error',
      });
    }
  };

  const handleReject = (id) => {
    setRejectDialog({ open: true, id });
  };

  const confirmReject = () => {
    handleStatusUpdate(rejectDialog.id, 'rejected', rejectReason);
    setRejectDialog({ open: false, id: null });
    setRejectReason('');
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

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
                    <TableCell>Location</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Duration</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCourses
                    .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                    .map((course) => (
                      <TableRow key={course.tutor_course_id} hover>
                        <TableCell>{course.tutor_name}</TableCell>
                        <TableCell>{course.course_name}</TableCell>
                        <TableCell>{course.location}</TableCell>
                        <TableCell>{course.price}</TableCell>
                        <TableCell>{course.duration}</TableCell>
                        <TableCell>
                          <Chip
                            label={course.status}
                            color={
                              course.status === 'approved'
                                ? 'success'
                                : course.status === 'rejected'
                                ? 'error'
                                : 'warning'
                            }
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {course.status === 'pending' ? (
                            <Stack direction="row" spacing={1} justifyContent="flex-end">
                              <Button
                                variant="outlined"
                                color="success"
                                size="small"
                                onClick={() =>
                                  handleStatusUpdate(course.tutor_course_id, 'approved')
                                }
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                size="small"
                                onClick={() => handleReject(course.tutor_course_id)}
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

      {/* Reject Reason Dialog */}
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
