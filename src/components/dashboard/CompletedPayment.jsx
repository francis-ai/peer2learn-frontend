import {
  Box,
  Card,
  CardContent,
  Chip,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress
} from '@mui/material';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/studentAuthContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const CompletedPayments = ({ formatDate, formatCurrency }) => {
  const { student } = useAuth();
  const [completedCourses, setCompletedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student?.id) return;

    const fetchPayments = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/students/completed-payment/${student.id}`);
        setCompletedCourses(res.data); 
      } catch (error) {
        console.error('Error fetching completed payments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, [student?.id]); 

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (completedCourses.length === 0) {
    return (
      <Box sx={{ textAlign: 'center', mt: 5 }}>
        <Typography>No completed payments found.</Typography>
      </Box>
    );
  }

  return (
    <Grid container spacing={3}>
      {completedCourses.map((course) => (
        <Grid item xs={12} key={course.id}>
          <Card elevation={3}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">{course.title}</Typography>
                <Chip label="Payment Completed" color="success" />
              </Box>

              <Typography color="text.secondary" gutterBottom>
                Instructor: {course.instructor}
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee' }}>
                    <Typography variant="subtitle2">Total Amount</Typography>
                    <Typography variant="h6">{formatCurrency(course.totalAmount)}</Typography>
                  </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                  <Paper elevation={0} sx={{ p: 2, border: '1px solid #eee' }}>
                    <Typography variant="subtitle2">Amount Paid</Typography>
                    <Typography variant="h6" color="success.main">
                      {formatCurrency(course.amountPaid)}
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              <Typography variant="subtitle1" gutterBottom sx={{ mt: 2 }}>
                Payment History
              </Typography>

              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Date</TableCell>
                      <TableCell>Amount</TableCell>
                      <TableCell>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {course.installments?.map((installment, index) => (
                      <TableRow key={index}>
                        <TableCell>{formatDate(installment.date)}</TableCell>
                        <TableCell>{formatCurrency(installment.amount)}</TableCell>
                        <TableCell>
                          <Chip label="Paid" color="success" size="small" />
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
    </Grid>
  );
};

export default CompletedPayments;
