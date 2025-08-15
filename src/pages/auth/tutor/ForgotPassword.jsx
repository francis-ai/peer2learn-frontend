import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Link, Grid,
  CircularProgress, Alert, Container, Paper, Avatar, InputAdornment
} from '@mui/material';
import { Email as EmailIcon, School as TutorIcon } from '@mui/icons-material';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!email) {
      setError('Please enter your email');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/tutors/forgot-password`, { email });
      console.log('Response:', response.data);
      setSuccess(true);
    } catch (err) {
      console.error('Forgot password error:', err);
      const message = err.response?.data?.message || 'Failed to send reset link. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <TutorIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Forgot Password
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mt: 3, width: '100%' }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success ? (
              <Alert severity="success" sx={{ mb: 2 }}>
                Password reset link has been sent to your email!
              </Alert>
            ) : (
              <>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Enter your email address and we'll send you a link to reset your password.
                </Typography>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  label="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <EmailIcon />
                      </InputAdornment>
                    ),
                  }}
                />
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{ mt: 3, mb: 2, py: 1.5 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
                </Button>
              </>
            )}
            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/tutor/login" variant="body2">
                  Back to login
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
