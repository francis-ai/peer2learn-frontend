import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Chip,
  CircularProgress,
} from "@mui/material";
import { useCohubAuth } from "../../context/cohubAuthContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const CohubWithdrawal = () => {
  const { cohub } = useCohubAuth();
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // New withdrawal form
  const [formData, setFormData] = useState({
    account_name: "",
    account_number: "",
    bank_name: "",
    amount: "",
  });

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  // 🪙 Fetch withdrawals
  useEffect(() => {
    const fetchWithdrawals = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/cohub/withdrawals/${cohub.id}`);
        const data = await res.json();
        if (data.success) {
          setWithdrawals(data.withdrawals);
        }
      } catch (error) {
        console.error("Error fetching withdrawals:", error);
      } finally {
        setLoading(false);
      }
    };

    if (cohub?.id) fetchWithdrawals();
  }, [cohub?.id]);

  
  // 📤 Handle form submit
  const handleSubmit = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/cohub/withdraw`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, cohub_id: cohub.id }),
      });

      const data = await res.json();
      if (data.success) {
        alert("Withdrawal request submitted successfully ✅");
        setWithdrawals([data.withdrawal, ...withdrawals]); // Update table instantly
        setOpen(false);
        setFormData({
          account_name: "",
          account_number: "",
          bank_name: "",
          amount: "",
        });
      } else {
        alert(data.message || "Failed to submit withdrawal request");
      }
    } catch (error) {
      console.error("Error submitting withdrawal:", error);
    }
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 1 }}>
          Loading withdrawal records...
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Withdrawal Requests
      </Typography>

      {/* 🪙 Request Withdrawal Button */}
      <Button
        variant="contained"
        sx={{ mb: 2 }}
        onClick={() => setOpen(true)}
      >
        Request Withdrawal
      </Button>

      {/* 📦 Withdrawals Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Account Name</strong></TableCell>
              <TableCell><strong>Account Number</strong></TableCell>
              <TableCell><strong>Bank</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Date Requested</strong></TableCell>
              <TableCell><strong>Date Paid</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {withdrawals
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((w) => (
                <TableRow key={w.id}>
                  <TableCell>{w.account_name}</TableCell>
                  <TableCell>{w.account_number}</TableCell>
                  <TableCell>{w.bank_name}</TableCell>
                  <TableCell>₦{Number(w.amount).toLocaleString()}</TableCell>
                  <TableCell>
                    <Chip
                      label={w.status}
                      color={
                        w.status === "approved"
                          ? "success"
                          : w.status === "rejected"
                          ? "error"
                          : "warning"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {new Date(w.created_at).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {w.date_paid
                      ? new Date(w.date_paid).toLocaleDateString()
                      : "—"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={withdrawals.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />

      {/* 💸 Withdrawal Modal */}
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Request Withdrawal</DialogTitle>
        <DialogContent>
          <TextField
            label="Account Name"
            fullWidth
            margin="dense"
            value={formData.account_name}
            onChange={(e) =>
              setFormData({ ...formData, account_name: e.target.value })
            }
          />
          <TextField
            label="Account Number"
            fullWidth
            margin="dense"
            value={formData.account_number}
            onChange={(e) =>
              setFormData({ ...formData, account_number: e.target.value })
            }
          />
          <TextField
            label="Bank Name"
            fullWidth
            margin="dense"
            value={formData.bank_name}
            onChange={(e) =>
              setFormData({ ...formData, bank_name: e.target.value })
            }
          />
          <TextField
            label="Amount"
            type="number"
            fullWidth
            margin="dense"
            value={formData.amount}
            onChange={(e) =>
              setFormData({ ...formData, amount: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default CohubWithdrawal;
