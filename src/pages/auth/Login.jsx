import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Box,
  Button,
  Container,
  Fade,
  IconButton,
  InputAdornment,
  Snackbar,
  TextField,
  Typography,
  Alert,
  Stack
} from '@mui/material';
import { Email, Lock, Visibility, VisibilityOff } from '@mui/icons-material';
import { useAuth } from '../../context/studentAuthContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;
console.log('BASE_URL:', BASE_URL);


export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const { setStudent } = useAuth(); // this is critical to update context!
  const navigate = useNavigate();

  const handleCloseSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    console.log('Submitting login:', { email, password });

    try {
      const res = await fetch(`${BASE_URL}/api/auth/students/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log('Login response:', data);

      if (!res.ok) {
        throw new Error(data.message || 'Login failed.');
      }

      // Store in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('student', JSON.stringify(data.student));
      console.log('Saved to localStorage:');
      console.log('Token:', localStorage.getItem('token'));
      console.log('Student:', JSON.parse(localStorage.getItem('student')));

      // Update Auth Context
      setStudent(data.student);
      console.log('Set student in context:', data.student);

      setSnackbar({
        open: true,
        message: 'Login successful!',
        severity: 'success',
      });

      setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err) {
      console.error('Login error:', err);
      setSnackbar({
        open: true,
        message: err.message,
        severity: 'error',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

   // Social signup handlers
  const handleGoogleSignin = () => {
    window.location.href = `${BASE_URL}/api/auth/students/google`;
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
          }}
        >
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
              Student Login
            </Typography>
            <Typography color="text.secondary">
              Log in to access your dashboard
            </Typography>
          </Box>

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
            <Typography
              component={ Link }
              to="/forgot-password"
              variant="body2"
              sx={{
                display: 'inline-block',
                color: 'blue',
                py: 1,
                textDecoration: 'none',
                '&:hover': {
                  color: 'darkblue'
                }
              }}
            >
              Forgot password?
            </Typography>


            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              disabled={isSubmitting}
              sx={{
                py: 1.5,
                mt: 1,
                borderRadius: '12px',
                fontSize: '1rem',
                fontWeight: 600,
                background: 'linear-gradient(90deg, #3a86ff, #4361ee)',
                boxShadow: '0 4px 12px rgba(58, 134, 255, 0.3)',
                '&:hover': {
                  background: 'linear-gradient(90deg, #4361ee, #3a0ca3)',
                },
                mb: 3,
              }}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </Button>

            {/* Social signup section */}
            <Stack spacing={2} sx={{ mt: 3 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleGoogleSignin}
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
                Sign in with Google
              </Button>
            </Stack>

            <Typography sx={{ textAlign: 'center', mt: 3, color: 'text.secondary' }}>
              Don't have an account?{' '}
              <Link to="/register" style={{ textDecoration: 'none', color: '#3a86ff', fontWeight: 600 }}>
                Create one
              </Link>
            </Typography>
          </Box>
        </Box>
      </Fade>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" onClose={handleCloseSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}
