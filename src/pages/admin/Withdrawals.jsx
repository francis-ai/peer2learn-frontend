import React, { useEffect, useState, useCallback} from "react";
import {
  Box,
  Typography,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from "@mui/material";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Withdrawals = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage] = useState(10);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [openRejectModal, setOpenRejectModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

  // Fetch withdrawals
  const fetchWithdrawals = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/tutor-withdrawals`);
      setWithdrawals(res.data);
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Error fetching withdrawals", severity: "error" });
    }
  }, []);

  // Filter data
  const filterData = useCallback(() => {
    const lower = search.toLowerCase();
    const filteredData = withdrawals.filter(
      (w) =>
        w.tutor_name?.toLowerCase().includes(lower) ||
        w.bank_name?.toLowerCase().includes(lower) ||
        w.status?.toLowerCase().includes(lower)
    );
    setFiltered(filteredData);
  }, [search, withdrawals]);

  // Run once on mount
  useEffect(() => {
    fetchWithdrawals();
  }, [fetchWithdrawals]);

  // Run whenever search or withdrawals change
  useEffect(() => {
    filterData();
  }, [filterData]);


  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleStatusUpdate = async (withdrawalId, status, reason = "") => {
    try {
      await axios.put(`${BASE_URL}/api/admin/tutor-withdrawals/${withdrawalId}/status`, {
        status,
        rejection_reason: reason
      });
      setSnackbar({ open: true, message: `Status updated to ${status}`, severity: "success" });
      fetchWithdrawals();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: "Error updating status", severity: "error" });
    }
  };

  const handleRejectClick = (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setRejectReason("");
    setOpenRejectModal(true);
  };

  const confirmReject = () => {
    if (selectedWithdrawal) {
      handleStatusUpdate(selectedWithdrawal.withdrawal_id, "rejected", rejectReason);
    }
    setOpenRejectModal(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        Tutor Withdrawals
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search withdrawals..."
        variant="outlined"
        size="small"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2, width: "100%", maxWidth: 400 }}
      />

      {/* Table */}
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="withdrawals table">
          <TableHead>
            <TableRow>
              <TableCell><strong>Tutor</strong></TableCell>
              <TableCell><strong>Amount</strong></TableCell>
              <TableCell><strong>Bank</strong></TableCell>
              <TableCell><strong>Account</strong></TableCell>
              <TableCell><strong>Status</strong></TableCell>
              <TableCell><strong>Requested At</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((w) => (
              <TableRow key={w.withdrawal_id}>
                <TableCell>{w.tutor_name}</TableCell>
                <TableCell>₦{Number(w.amount).toLocaleString()}</TableCell>
                <TableCell>{w.bank_name}</TableCell>
                <TableCell>{w.account_number}</TableCell>
                <TableCell sx={{ textTransform: "capitalize" }}>{w.status}</TableCell>
                <TableCell>{new Date(w.created_at).toLocaleString()}</TableCell>
                <TableCell>
                  {w.status === "pending" && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        size="small"
                        onClick={() => handleStatusUpdate(w.withdrawal_id, "approved")}
                        sx={{ mr: 1 }}
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        size="small"
                        onClick={() => handleRejectClick(w)}
                        sx={{ mr: 1 }}
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  {w.status === "approved" && (
                    <Button
                      variant="contained"
                      color="primary"
                      size="small"
                      onClick={() => handleStatusUpdate(w.withdrawal_id, "paid")}
                    >
                      Mark as Paid
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  No withdrawals found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filtered.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        rowsPerPageOptions={[10]}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Reject Modal */}
      <Dialog open={openRejectModal} onClose={() => setOpenRejectModal(false)}>
        <DialogTitle>Reject Withdrawal</DialogTitle>
        <DialogContent>
          <TextField
            label="Reason for rejection"
            multiline
            rows={3}
            fullWidth
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={confirmReject}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Withdrawals;
