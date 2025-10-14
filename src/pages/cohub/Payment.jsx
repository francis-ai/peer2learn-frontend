import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  CircularProgress,
  Grid,
  Card,
  CardContent,
} from "@mui/material";
import { useCohubAuth } from "../../context/cohubAuthContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const CohubPayments = () => {
  const { cohub } = useCohubAuth();
  const [payments, setPayments] = useState([]);
  const [totals, setTotals] = useState({
    totalEarning: 0,
    totalWithdrawn: 0,
    availableBalance: 0,
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/cohub/payments/${cohub.id}`);
        const data = await res.json();

        if (data.success) {
          setPayments(data.payments);
          if (data.totals) setTotals(data.totals);
        } else {
          console.error("Failed to fetch payments:", data.message);
        }
      } catch (error) {
        console.error("Error fetching payments:", error);
      } finally {
        setLoading(false);
      }
    };

    if (cohub?.id) fetchPayments();
  }, [cohub?.id]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter payments by search term
  const filteredPayments = payments.filter(
    (payment) =>
      payment.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      payment.tutor_name?.toLowerCase().includes(search.toLowerCase()) ||
      payment.course_name?.toLowerCase().includes(search.toLowerCase()) ||
      payment.office_name?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Loading payment records...
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Payment Records
      </Typography>

      {/* 💳 Totals Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderLeft: "4px solid #1976d2" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Total Earnings
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="primary">
                ₦{Number(totals.totalEarning).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderLeft: "4px solid #2e7d32" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Available Balance
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="success.main">
                ₦{Number(totals.availableBalance).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ borderLeft: "4px solid #d32f2f" }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Total Withdrawn
              </Typography>
              <Typography variant="h5" fontWeight="bold" color="error.main">
                ₦{Number(totals.totalWithdrawn).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* 🔍 Search Bar */}
      <TextField
        label="Search by student, tutor, course, or office"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* 📜 Payments Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Student Name</strong></TableCell>
              <TableCell><strong>Tutor Name</strong></TableCell>
              <TableCell><strong>Course Name</strong></TableCell>
              <TableCell><strong>Office</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Payment Date</strong></TableCell>
              <TableCell><strong>Reference</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPayments
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>{payment.student_name}</TableCell>
                  <TableCell>{payment.tutor_name}</TableCell>
                  <TableCell>{payment.course_name}</TableCell>
                  <TableCell>{payment.office_name}</TableCell>
                  <TableCell>
                    ₦{Number(payment.cohub_earning || payment.amount).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    {new Date(payment.paid_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{payment.reference || "—"}</TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* 📄 Pagination */}
      <TablePagination
        component="div"
        count={filteredPayments.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Container>
  );
};

export default CohubPayments;
