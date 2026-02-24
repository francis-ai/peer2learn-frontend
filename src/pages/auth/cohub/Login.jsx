import React, { useState } from 'react';
import { 
  Box, Typography, TextField, Button, Link, Grid, InputAdornment,
  IconButton, CircularProgress, Alert, Checkbox, FormControlLabel,
  Container, Paper, Avatar, Stack
} from '@mui/material';
import { 
  Lock as LockIcon,
  Email as EmailIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Work as WorkIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ✅ Add this
import { useCohubAuth } from '../../../context/cohubAuthContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { setCohub } = useCohubAuth();
  const navigate = useNavigate(); // ✅ Use navigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!email || !password) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(`${BASE_URL}/api/auth/cohub/login`,
        { email, password },
        { withCredentials: true }
      );

      const { cohub, token } = response.data;
      console.log('✅ Login success:', cohub);

      localStorage.setItem('cohub', JSON.stringify(cohub));
      localStorage.setItem('cohubToken', token);
      setCohub(cohub);

      // ✅ Clean redirect using React Router
      navigate('/cohub/dashboard', { replace: true });

      // 👇 fallback in case React navigation fails
      setTimeout(() => {
        if (!window.location.pathname.includes('/cohub/dashboard')) {
          window.location.href = '/cohub/dashboard';
        }
      }, 800);
    } catch (err) {
      console.error('❌ Login error:', err);
      const message = err.response?.data?.message || 'Login failed. Please try again.';
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
          <WorkIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Cohub Login
        </Typography>
        <Paper elevation={3} sx={{ p: 3, mt: 3, width: '100%' }}>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

            <TextField
              margin="normal"
              required
              fullWidth
              label="Email Address"
              autoComplete="email"
              autoFocus
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

            <TextField
              margin="normal"
              required
              fullWidth
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <FormControlLabel
                control={
                  <Checkbox 
                    checked={rememberMe} 
                    onChange={(e) => setRememberMe(e.target.checked)}
                    color="primary" 
                  />
                }
                label="Remember me"
              />
              <Link href="/cohub/forgot-password" variant="body2">
                Forgot password?
              </Link>
            </Stack>

            <Button
              type="submit"
              fullWidth
              variant="contained"
              disabled={loading}
              sx={{ mt: 3, mb: 2, py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'Sign In'}
            </Button>

            <Grid container justifyContent="center">
              <Grid item>
                <Link href="/cohub/register" variant="body2">
                  Don't have an account? Register
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}
