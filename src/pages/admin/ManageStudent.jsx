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
  CircularProgress,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import {
  Search as SearchIcon,
  Verified as VerifiedIcon,
  Block as BlockedIcon,
  Visibility as VisibilityIcon,
} from '@mui/icons-material';
import * as XLSX from 'xlsx';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function ManageStudent() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [viewOpen, setViewOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [allModalOpen, setAllModalOpen] = useState(false);

  const rowsPerPage = 5;

  useEffect(() => {
    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter((student) => {
      const name = student.name ?? '';
      const email = student.email ?? '';
      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredStudents(filtered);
    setPage(1);
  }, [searchTerm, students]);

  const fetchStudents = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/all-students`);
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      setSnackbar({ open: true, message: 'Failed to load students.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'flagged' : 'active';
    try {
      const res = await fetch(`${BASE_URL}/api/admin/student-status/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update status');

      setStudents((prev) =>
        prev.map((student) => (student.id === id ? { ...student, status: newStatus } : student))
      );
      setSnackbar({ open: true, message: `Student status updated to ${newStatus}`, severity: 'success' });
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const handleViewStudent = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/api/admin/students/${id}`);
      const data = await res.json();
      setSelectedStudent(data);
      setViewOpen(true);
    } catch (err) {
      setSnackbar({ open: true, message: 'Failed to load student details.', severity: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseView = () => {
    setViewOpen(false);
    setSelectedStudent(null);
  };

  // Open modal to view all students
  const handleOpenAllModal = () => {
    setAllModalOpen(true);
  };
  const handleCloseAllModal = () => setAllModalOpen(false);

  // Export all students to Excel
  const handleDownloadExcel = () => {
    const wsData = students.map((s) => ({
      ID: s.id,
      Name: s.name,
      Email: s.email,
      Phone: s.phone_number,
      Status: s.status,
      'Join Date': s.created_at ? new Date(s.created_at).toLocaleDateString() : 'N/A',
    }));
    const ws = XLSX.utils.json_to_sheet(wsData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    XLSX.writeFile(wb, 'students.xlsx');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Student Management
      </Typography>

      {/* Action Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <Box sx={{ mr: 1, display: 'flex', alignItems: 'center' }}>
                    <SearchIcon color="action" />
                  </Box>
                ),
              }}
              sx={{ flexGrow: 1 }}
            />
            <Button variant="contained" color="primary" onClick={handleOpenAllModal}>
              View All
            </Button>
            <Button variant="outlined" color="secondary" onClick={handleDownloadExcel}>
              Download Excel
            </Button>
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
                    <TableCell>Student</TableCell>
                    <TableCell>Email & Phone number</TableCell>
                    <TableCell>Join Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell align="right">Action</TableCell>
                    <TableCell align="right">View</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredStudents
                    .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                    .map((student) => (
                      <TableRow key={student.id} hover>
                        <TableCell>
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              {student.name
                                ? student.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                    .toUpperCase()
                                : '?'}
                            </Avatar>
                            <Typography>{student.name || 'N/A'}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell>{student.email || 'N/A'} - {student.phone_number || 'N/A'}</TableCell>
                        <TableCell>
                          {student.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            icon={student.status === 'active' ? <VerifiedIcon /> : <BlockedIcon />}
                            label={student.status || 'N/A'}
                            color={student.status === 'active' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          <Button
                            variant="outlined"
                            color={student.status === 'active' ? 'error' : 'success'}
                            onClick={() => toggleStatus(student.id, student.status)}
                            size="small"
                          >
                            {student.status === 'active' ? 'Flag Account' : 'Activate Account'}
                          </Button>
                        </TableCell>
                        <TableCell align="right">
                          <IconButton color="primary" onClick={() => handleViewStudent(student.id)}>
                            <VisibilityIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={Math.ceil(filteredStudents.length / rowsPerPage)}
                page={page}
                onChange={handleChangePage}
                color="primary"
              />
            </Box>
          </CardContent>
        </Card>
      )}

      {/* View Individual Student Modal */}
      <Dialog open={viewOpen} onClose={handleCloseView} maxWidth="sm" fullWidth>
        <DialogTitle>Student Details</DialogTitle>
        <DialogContent dividers>
          {selectedStudent ? (
            <Box>
              <Typography variant="h6" gutterBottom>{selectedStudent.name}</Typography>
              <Typography>Email: {selectedStudent.email}</Typography>
              <Typography>Phone: {selectedStudent.phone_number}</Typography>
              <Typography>Status: {selectedStudent.status}</Typography>
              <Typography>Join Date: {selectedStudent.created_at ? new Date(selectedStudent.created_at).toLocaleDateString() : 'N/A'}</Typography>
            </Box>
          ) : (
            <CircularProgress />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseView} color="primary">Close</Button>
        </DialogActions>
      </Dialog>

      {/* View All Students Modal */}
      <Dialog open={allModalOpen} onClose={handleCloseAllModal} maxWidth="lg" fullWidth>
        <DialogTitle>All Students</DialogTitle>
        <DialogContent dividers>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Name</TableCell>
                  <TableCell>Email</TableCell>
                  <TableCell>Phone</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Join Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id} hover>
                    <TableCell>{student.id}</TableCell>
                    <TableCell>{student.name}</TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{student.phone_number}</TableCell>
                    <TableCell>{student.status}</TableCell>
                    <TableCell>{student.created_at ? new Date(student.created_at).toLocaleDateString() : 'N/A'}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAllModal} color="primary">Close</Button>
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