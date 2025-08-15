import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Container,
  useTheme,
  Fade,
  InputAdornment,
  Snackbar,
  Alert,
  alpha
} from '@mui/material';
import { Email, ArrowBack } from '@mui/icons-material';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const navigate = useNavigate();
  const theme = useTheme();

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/students/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to send reset link.');
      }

      setEmailSent(true);
      setSnackbar({
        open: true,
        message: 'Reset link sent successfully!',
        severity: 'success'
      });
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.message,
        severity: 'error'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Fade in timeout={500}>
        <Box
          sx={{
            mt: { xs: 12, md: 12 },
            mb: 8,
            p: { xs: 3, md: 6 },
            backgroundColor: 'background.paper',
            borderRadius: '16px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
            border: '1px solid rgba(0,0,0,0.05)',
            position: 'relative'
          }}
        >
          {/* Back Button */}
          <Button
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{
              position: 'absolute',
              top: { xs: 16, md: 24 },
              left: { xs: 16, md: 24 },
              color: 'text.secondary',
              textTransform: 'none'
            }}
          >
            Back
          </Button>

          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                background: 'linear-gradient(90deg, #3a86ff, #4361ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {emailSent ? 'Check Your Email' : 'Forgot Password'}
            </Typography>
            <Typography color="text.secondary">
              {emailSent
                ? `We've sent instructions to ${email}`
                : 'Enter your email to reset your password'}
            </Typography>
          </Box>

          {/* Form or Confirmation */}
          {!emailSent ? (
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Email Address"
                variant="outlined"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email color="action" />
                    </InputAdornment>
                  )
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '12px'
                  }
                }}
                required
                type="email"
              />

              <Button
                fullWidth
                type="submit"
                variant="contained"
                size="large"
                disabled={isSubmitting}
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(90deg, #3a86ff, #4361ee)',
                  boxShadow: '0 4px 12px rgba(58, 134, 255, 0.3)',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #4361ee, #3a0ca3)'
                  },
                  mb: 2
                }}
              >
                {isSubmitting ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  backgroundColor: theme.palette.primary.light,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}
              >
                <Email sx={{ fontSize: 48, color: theme.palette.primary.main }} />
              </Box>
              <Typography sx={{ mb: 3 }}>
                If an account exists for {email}, you'll receive an email with password reset instructions.
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                onClick={() => setEmailSent(false)}
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: '2px solid',
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.08)
                  }
                }}
              >
                Resend Email
              </Button>
            </Box>
          )}

          <Typography
            sx={{
              textAlign: 'center',
              mt: 3,
              color: 'text.secondary'
            }}
          >
            Remember your password?{' '}
            <Link
              to="/login"
              style={{
                textDecoration: 'none',
                color: theme.palette.primary.main,
                fontWeight: 600
              }}
            >
              Sign in
            </Link>
          </Typography>
        </Box>
      </Fade>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
