import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Typography, Grid, Card, CardContent, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Paper, CircularProgress, Alert,
  Button, Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  MenuItem, Snackbar, Select, FormControl, InputLabel, Tabs, Tab, TablePagination
} from '@mui/material';
import {
  Payments as WithdrawIcon,
  Add as AddIcon
} from '@mui/icons-material';
import axios from 'axios';
import moment from 'moment';
import { useTutorAuth } from '../../context/tutorAuthContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Earnings() {
  const { tutor } = useTutorAuth();
  const tutorId = tutor?.id;

  const [earningsData, setEarningsData] = useState(null);
  const [bankDetails, setBankDetails] = useState([]);
  const [withdrawals, setWithdrawals] = useState([]);
  const [selectedBank, setSelectedBank] = useState('');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openAddAccount, setOpenAddAccount] = useState(false);
  const [newBank, setNewBank] = useState({ bank_name: '', account_number: '', account_name: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  // Tabs state: 0 = Payments, 1 = Withdrawals
  const [tabIndex, setTabIndex] = useState(0);

  // Pagination states for payments and withdrawals
  const [paymentPage, setPaymentPage] = useState(0);
  const [withdrawalPage, setWithdrawalPage] = useState(0);
  const rowsPerPage = 10;

  // Fetch Earnings
  const fetchEarnings = useCallback(async () => {
    if (!tutorId) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/tutors/tutor-earnings/${tutorId}`);
      setEarningsData(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load earnings.');
    } finally {
      setLoading(false);
    }
  }, [tutorId]);

  // Fetch Bank Details
  const fetchBankDetails = useCallback(async () => {
    if (!tutorId) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/tutors/bank-details/${tutorId}`);
      setBankDetails(res.data.data ? [res.data.data] : []);
    } catch {
      setBankDetails([]);
    }
  }, [tutorId]);

  // Fetch Withdrawals
  const fetchWithdrawals = useCallback(async () => {
    if (!tutorId) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/tutors/withdrawals/${tutorId}`);
      setWithdrawals(res.data.data || []);
    } catch {
      setWithdrawals([]);
    }
  }, [tutorId]);

  // Add Bank Account
  const handleAddAccount = async () => {
    try {
      await axios.post(`${BASE_URL}/api/tutors/bank-details/${tutorId}`, newBank);
      setSnackbar({ open: true, message: 'Bank account added successfully', severity: 'success' });
      setOpenAddAccount(false);
      fetchBankDetails();
    } catch {
      setSnackbar({ open: true, message: 'Failed to add bank account', severity: 'error' });
    }
  };

  // Process Withdrawal
  const handleWithdraw = async () => {
    if (!selectedBank || !withdrawAmount) {
      return setSnackbar({ open: true, message: 'Please select a bank and enter an amount', severity: 'warning' });
    }
    try {
      await axios.post(`${BASE_URL}/api/tutors/withdraw/${tutorId}`, {
        bank_id: selectedBank,
        amount: withdrawAmount
      });
      setSnackbar({ open: true, message: 'Withdrawal request submitted', severity: 'success' });
      setWithdrawAmount('');
      fetchEarnings();
      fetchWithdrawals();
    } catch (err) {
      const msg = err.response?.data?.message || 'Withdrawal failed';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    }
  };

  useEffect(() => {
    fetchEarnings();
    fetchBankDetails();
    fetchWithdrawals();
  }, [fetchEarnings, fetchBankDetails, fetchWithdrawals]);

  const formatCurrency = (value) =>
    `₦${parseFloat(value).toLocaleString(undefined, { minimumFractionDigits: 2 })}`;

  // Tab change handler
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // Pagination handlers
  const handlePaymentPageChange = (event, newPage) => {
    setPaymentPage(newPage);
  };

  const handleWithdrawalPageChange = (event, newPage) => {
    setWithdrawalPage(newPage);
  };

  return (
    <Box sx={{ py: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Earnings
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          {/* Summary Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={12} md={4}>
              <Card sx={{width: {md: '240px', xs: '290px'}}}>
                <CardContent>
                  <Typography color="text.secondary">Total Earnings</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(earningsData.totalEarnings)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{width: {md: '240px', xs: '290px'}}}>
                <CardContent>
                  <Typography color="text.secondary">Available Balance</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(earningsData.availableBalance)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{width: {md: '240px', xs: '290px'}}}>
                <CardContent>
                  <Typography color="text.secondary">Total Withdrawn</Typography>
                  <Typography variant="h5" fontWeight="bold">
                    {formatCurrency(earningsData.totalWithdrawn)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={4}>
              <Card sx={{width: {md: '240px', xs: '290px'}}}>
                <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                  <WithdrawIcon color="secondary" sx={{ fontSize: 40, mr: 2 }} />
                  <Box>
                    <Typography color="text.secondary">No. of Payments</Typography>
                    <Typography variant="h5" fontWeight="bold">
                      {earningsData.numberOfPayments}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>

          {/* Withdraw Funds Card */}
          <Card sx={{ mb: 4 }}>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                Withdraw Funds
              </Typography>

              {bankDetails.length > 0 ? (
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel id="bank-select-label">Select Bank</InputLabel>
                  <Select
                    labelId="bank-select-label"
                    value={selectedBank}
                    label="Select Bank"
                    onChange={(e) => setSelectedBank(e.target.value)}
                  >
                    {bankDetails.map((bank) => (
                      <MenuItem key={bank.bank_id} value={bank.bank_id}>
                        {bank.bank_name} - {bank.account_number} ({bank.account_name})
                      </MenuItem>
                    ))}
                  </Select>

                  <Button
                    variant="outlined"
                    startIcon={<AddIcon />}
                    sx={{ mt: 2 }}
                    onClick={() => setOpenAddAccount(true)}
                  >
                    Add New Account
                  </Button>
                </FormControl>
              ) : (
                <Button
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={() => setOpenAddAccount(true)}
                  sx={{ mb: 2 }}
                >
                  Add Account for Withdrawal
                </Button>
              )}

              <TextField
                label="Amount"
                type="number"
                fullWidth
                sx={{ mb: 2 }}
                value={withdrawAmount}
                onChange={(e) => setWithdrawAmount(e.target.value)}
              />

              <Button variant="contained" color="primary" onClick={handleWithdraw}>
                Request Withdrawal
              </Button>
            </CardContent>
          </Card>

          {/* Tabs for Payment History & Withdrawal History */}
          <Box sx={{ width: '100%', mb: 4 }}>
            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="earnings tabs" centered>
              <Tab label="Payment History" />
              <Tab label="Withdrawal History" />
            </Tabs>

            {/* Payment History Tab Panel */}
            {tabIndex === 0 && (
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Payment History
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Paid Amount</TableCell>
                          <TableCell>Earning</TableCell>
                          <TableCell>Course Total</TableCell>
                          <TableCell>Payment Plan</TableCell>
                          <TableCell>Student Email</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {(earningsData.payments || [])
                          .slice(paymentPage * rowsPerPage, paymentPage * rowsPerPage + rowsPerPage)
                          .map((payment, index) => (
                            <TableRow key={index}>
                              <TableCell>{moment(payment.paid_at).format('MMM D, YYYY - h:mm A')}</TableCell>
                              <TableCell>{formatCurrency(payment.paid_amount)}</TableCell>
                              <TableCell>{formatCurrency(payment.earning)}</TableCell>
                              <TableCell>{formatCurrency(payment.course_total)}</TableCell>
                              <TableCell>{payment.payment_plan}</TableCell>
                              <TableCell>{payment.student_email}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[10]}
                    component="div"
                    count={earningsData.payments ? earningsData.payments.length : 0}
                    rowsPerPage={rowsPerPage}
                    page={paymentPage}
                    onPageChange={handlePaymentPageChange}
                  />
                </CardContent>
              </Card>
            )}

            {/* Withdrawal History Tab Panel */}
            {tabIndex === 1 && (
              <Card sx={{ mt: 2 }}>
                <CardContent>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    Withdrawal History
                  </Typography>
                  <TableContainer component={Paper}>
                    <Table size="small">
                      <TableHead>
                        <TableRow>
                          <TableCell>Date</TableCell>
                          <TableCell>Amount</TableCell>
                          <TableCell>Bank</TableCell>
                          <TableCell>Status</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {withdrawals
                          .slice(withdrawalPage * rowsPerPage, withdrawalPage * rowsPerPage + rowsPerPage)
                          .map((w) => (
                            <TableRow key={w.withdrawal_id}>
                              <TableCell>{moment(w.requested_at).format('MMM D, YYYY - h:mm A')}</TableCell>
                              <TableCell>{formatCurrency(w.amount)}</TableCell>
                              <TableCell>{w.bank_name} - {w.account_number}</TableCell>
                              <TableCell>{w.status}</TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </TableContainer>
                  <TablePagination
                    rowsPerPageOptions={[10]}
                    component="div"
                    count={withdrawals.length}
                    rowsPerPage={rowsPerPage}
                    page={withdrawalPage}
                    onPageChange={handleWithdrawalPageChange}
                  />
                </CardContent>
              </Card>
            )}
          </Box>
        </>
      )}

      {/* Add Account Modal */}
      <Dialog open={openAddAccount} onClose={() => setOpenAddAccount(false)}>
        <DialogTitle>Add Bank Account</DialogTitle>
        <DialogContent>
          <TextField
            label="Bank Name"
            fullWidth
            sx={{ mb: 2 }}
            value={newBank.bank_name}
            onChange={(e) => setNewBank({ ...newBank, bank_name: e.target.value })}
          />
          <TextField
            label="Account Number"
            fullWidth
            sx={{ mb: 2 }}
            value={newBank.account_number}
            onChange={(e) => setNewBank({ ...newBank, account_number: e.target.value })}
          />
          <TextField
            label="Account Name"
            fullWidth
            value={newBank.account_name}
            onChange={(e) => setNewBank({ ...newBank, account_name: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenAddAccount(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAddAccount}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar with Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
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
