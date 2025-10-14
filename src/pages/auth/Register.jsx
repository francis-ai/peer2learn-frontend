import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  InputAdornment,
  Fade,
  Container,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  // Stack
} from '@mui/material';
import { Person, Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!acceptedTerms) {
      setSnackbar({
        open: true,
        message: 'Please accept the Terms and Privacy Policy.',
        severity: 'warning',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await axios.post(`${BASE_URL}/api/auth/students/register`, {
        name,
        email,
        password,
      });

      localStorage.setItem('token', res.data.token);
      localStorage.setItem('student', JSON.stringify(res.data.student));

      setSnackbar({
        open: true,
        message: 'Registration successful! Please check your email to verify your account before logging in.',
        severity: 'success',
      });

      setTimeout(() => navigate('/dashboard'), 3000);
    } catch (err) {
      setSnackbar({
        open: true,
        message: err.response?.data?.message || 'Registration failed.',
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // // Social signup handlers
  // const handleGoogleSignup = () => {
  //   window.location.href = `${BASE_URL}/api/auth/students/google`;
  // };

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
          }}
        >
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 5 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                mb: 1,
                background: 'linear-gradient(90deg, #3a86ff, #4361ee)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Sign Up
            </Typography>
            <Typography color="text.secondary">
              Create your account to get started
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Full Name"
              variant="outlined"
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              required
            />

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
                ),
              }}
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              required
              type="email"
            />

            <TextField
              fullWidth
              label="Password"
              variant="outlined"
              margin="normal"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
              required
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  color="primary"
                />
              }
              label={
                <Typography variant="body2">
                  I agree to the{' '}
                  <Link to="/terms" style={{ textDecoration: 'none', color: '#3a86ff', fontWeight: 500 }}>
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" style={{ textDecoration: 'none', color: '#3a86ff', fontWeight: 500 }}>
                    Privacy Policy
                  </Link>
                </Typography>
              }
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting || !acceptedTerms}
              sx={{
                py: 1.5,
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(90deg, #3a86ff, #4361ee)',
                boxShadow: '0 4px 12px rgba(58, 134, 255, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #4361ee, #3a0ca3)',
                },
                mb: 2,
              }}
            >
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>

            {/* Social signup section */}
            {/* <Stack spacing={2} sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleGoogleSignup}
                sx={{
                  borderRadius: '12px',
                  textTransform: 'none',
                  fontWeight: 500,
                  borderColor: '#ccc',
                }}
              >
                <img
                  src="https://www.svgrepo.com/show/475656/google-color.svg"
                  alt="Google"
                  style={{ width: 20, marginRight: 8 }}
                />
                Sign up with Google
              </Button>
            </Stack> */}

            <Typography
              sx={{
                textAlign: 'center',
                mt: 3,
                color: 'text.secondary',
              }}
            >
              Already have an account?{' '}
              <Link to="/login" style={{ textDecoration: 'none', color: '#3a86ff', fontWeight: 600 }}>
                Sign in
              </Link>
            </Typography>
          </Box>
        </Box>
      </Fade>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
