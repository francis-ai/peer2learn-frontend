import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Pagination,
  Snackbar,
  Alert,
  Card,
  CardContent
} from '@mui/material';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Payments() {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [summary, setSummary] = useState({
    total_amount_received: 0,
    total_platform_earnings: 0,
    total_tutor_earnings: 0,
    total_cohub_earnings: 0,
    total_developer_earnings: 0
  });

  const fetchPayments = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/admin/all-payments`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to fetch payments');
      setPayments(data.data);
      setSummary(data.summary);
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    }
  };

  const handleSearch = useCallback(
    (query) => {
      const lower = query.toLowerCase();
      const filtered = payments.filter(
        (p) =>
          p.student_name.toLowerCase().includes(lower) ||
          p.tutor_name.toLowerCase().includes(lower) ||
          p.course_name.toLowerCase().includes(lower) ||
          p.reference.toLowerCase().includes(lower)
      );
      setFilteredPayments(filtered);
    },
    [payments]
  );

  useEffect(() => {
    fetchPayments();
  }, []);

  useEffect(() => {
    handleSearch(search);
  }, [payments, search, handleSearch]);

  const handleCloseSnackbar = () => setSnackbar((prev) => ({ ...prev, open: false }));

  const paginatedData = filteredPayments.slice((page - 1) * rowsPerPage, page * rowsPerPage);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 3 }}>
        Payment History
      </Typography>

      {/* 💳 Summary Cards */}
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <Card sx={{ flex: 1, minWidth: 250, backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Platform Earnings
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              ₦{summary.total_platform_earnings.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 250, backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Tutor Earnings
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              ₦{summary.total_tutor_earnings.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 250, backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Cohub Earnings
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              ₦{summary.total_cohub_earnings.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 250, backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Developer Earnings
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              ₦{summary.total_developer_earnings.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>

        <Card sx={{ flex: 1, minWidth: 250, backgroundColor: '#f5f5f5' }}>
          <CardContent>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Total Received
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              ₦{summary.total_amount_received.toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* 🔍 Search */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search by student, tutor, course, or reference"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </Box>

      {/* 📊 Payment Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Tutor</TableCell>
              <TableCell>Course</TableCell>
              <TableCell>Plan</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Platform Earn</TableCell>
              <TableCell>Tutor Earn</TableCell>
              <TableCell>Cohub Earn</TableCell>
              <TableCell>Developer Earn</TableCell>
              <TableCell>Reference</TableCell>
              <TableCell>Date Paid</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((payment) => (
              <TableRow key={payment.id} hover>
                <TableCell>{payment.student_name}</TableCell>
                <TableCell>{payment.tutor_name}</TableCell>
                <TableCell>{payment.course_name}</TableCell>
                <TableCell>{payment.payment_plan}</TableCell>
                <TableCell>₦{Number(payment.amount).toLocaleString()}</TableCell>
                <TableCell>₦{Number(payment.platform_profit).toLocaleString()}</TableCell>
                <TableCell>₦{Number(payment.tutor_earning).toLocaleString()}</TableCell>
                <TableCell>₦{Number(payment.cohub_earning).toLocaleString()}</TableCell>
                <TableCell>₦{Number(payment.developer_earning).toLocaleString()}</TableCell>
                <TableCell>{payment.reference}</TableCell>
                <TableCell>{new Date(payment.paid_at).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 📄 Pagination */}
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
        <Pagination
          count={Math.ceil(filteredPayments.length / rowsPerPage)}
          page={page}
          onChange={(e, newPage) => setPage(newPage)}
          color="primary"
        />
      </Box>

      {/* 🔔 Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
