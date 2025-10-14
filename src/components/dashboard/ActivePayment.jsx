import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Grid,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography
} from '@mui/material';
import { Snackbar, Alert } from '@mui/material';
import { Paid } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/studentAuthContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const PAYSTACK_PUBLIC_KEY = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY ||
  "pk_live_e2c76d414fdb6b5819fb2d8489e22872a1e64d9d";

const ActivePayments = ({ formatDate, formatCurrency }) => {
  const { student } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: '' });

  useEffect(() => {
    if (!student?.id) return;

    const fetchPayments = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/students/active-payment/${student.id}`);
        setCourses(res.data);
      } catch (error) {
        console.error('Error fetching active payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [student?.id]);

  const handleInstallmentPayment = (course, installment) => {
    const ref = `INSTALL-${student.id}-${Date.now()}`;

    if (!installment.date) {
      console.error('Missing due date');
      setSnackbar({
        open: true,
        message: 'Installment due date missing. Contact support.',
        severity: 'error'
      });
      return;
    }

    const date = new Date(installment.date);
    const formattedDueDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const payload = {
      reference: ref,
      enrollment_id: course.id,
      due_date: formattedDueDate,
      student_id: student.id,
      email: student.email,
      name: student.name,
      amount: installment.amount
    };

    // Log the payload to the console for inspection
    console.log("🔍 Installment Payment Payload:", payload);

    // 🔒 Comment out the actual Paystack setup for now
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: student.email,
      amount: Number(installment.amount) * 100,
      currency: 'NGN',
      ref,
      callback: function (response) {
        payload.reference = response.reference;

        axios.post(`${BASE_URL}/api/students/verify-installment-payment`, payload)
          .then(() => {
            setSnackbar({
              open: true,
              message: 'Installment payment verified successfully!',
              severity: 'success'
            });
            setTimeout(() => window.location.reload(), 2000);
          })
          .catch((err) => {
            console.error('Installment verification failed:', err.response?.data || err.message);
            setSnackbar({
              open: true,
              message: 'Failed to verify installment. Contact support.',
              severity: 'error'
            });
          });
      },
      onClose: function () {
        setSnackbar({
          open: true,
          message: 'Payment was cancelled.',
          severity: 'info'
        });
      }
    });

    handler.openIframe();
  };


  if (loading) return <Typography>Loading...</Typography>;
  if (!courses.length) return <Typography>No active payments found.</Typography>;

  return (
    <Grid container spacing={3}>
      {courses.map((course) => (
        <Grid item xs={12} key={course.id}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">{course.title}</Typography>
                <Chip
                  label={`${Math.round((course.amountPaid / course.totalAmount) * 100)}% Paid`}
                  color="primary"
                />
              </Box>

              <Typography color="text.secondary" gutterBottom>
                Instructor: {course.instructor}
              </Typography>

              <Box sx={{ mb: 2 }}>
                <LinearProgress
                  variant="determinate"
                  value={(course.amountPaid / course.totalAmount) * 100}
                  sx={{ height: 8, borderRadius: 4 }}
                />
              </Box>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee' }}>
                    <Typography variant="subtitle2">Total Amount</Typography>
                    <Typography variant="h6">{formatCurrency(course.totalAmount)}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee' }}>
                    <Typography variant="subtitle2">Amount Paid</Typography>
                    <Typography variant="h6" color="success.main">
                      {formatCurrency(course.amountPaid)}
                    </Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={4}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee' }}>
                    <Typography variant="subtitle2">Next Payment Due</Typography>
                    <Typography variant="h6">
                      {formatDate(course.nextPaymentDate)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Installment Plan
              </Typography>

              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Due Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell align="right">Action</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {course.installments.map((installment, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(installment.date)}</TableCell>
                        <TableCell>{formatCurrency(installment.amount)}</TableCell>
                        <TableCell>
                          <Chip
                            label={installment.status}
                            color={installment.status === 'paid' ? 'success' : 'warning'}
                            size="small"
                          />
                        </TableCell>
                        <TableCell align="right">
                          {installment.status === 'pending' && (
                            <Button
                              variant="outlined"
                              size="small"
                              startIcon={<Paid />}
                              onClick={() => handleInstallmentPayment(course, installment)}
                            >
                              Make Payment
                            </Button>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      ))}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Grid>
  );
};

export default ActivePayments;
