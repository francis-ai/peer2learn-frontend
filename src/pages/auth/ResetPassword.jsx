import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Box,
  Typography,
  TextField,
  Button,
  Container,
  useTheme,
  Fade,
  InputAdornment,
  IconButton,
  Snackbar,
  Alert
} from '@mui/material';
import { Lock, Visibility, VisibilityOff, ArrowBack } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function ResetPassword() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { token } = useParams(); // ✅ get token from URL path
  const navigate = useNavigate();
  const theme = useTheme();

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setSnackbar({ open: true, message: 'Passwords do not match', severity: 'error' });
      return;
    }

    if (!token) {
      setSnackbar({ open: true, message: 'Token is missing', severity: 'error' });
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${BASE_URL}/api/auth/students/reset-password/${token}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: newPassword })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || 'Failed to reset password');
      }

      setSuccess(true);
      setSnackbar({ open: true, message: 'Password updated successfully!', severity: 'success' });
    } catch (err) {
      setSnackbar({ open: true, message: err.message, severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Fade in timeout={500}>
        <Box sx={{ 
          mt: { xs: 12, md: 12 },
          mb: 8,
          p: { xs: 3, md: 6 },
          backgroundColor: 'background.paper',
          borderRadius: '16px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.08)',
          border: '1px solid rgba(0,0,0,0.05)',
          position: 'relative'
        }}>
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
            <Typography variant="h4" sx={{ 
              fontWeight: 700,
              mb: 1,
              background: 'linear-gradient(90deg, #3a86ff, #4361ee)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              {success ? 'Password Updated!' : 'Reset Password'}
            </Typography>
            <Typography color="text.secondary">
              {success 
                ? 'Your password has been successfully updated'
                : 'Create a new password for your account'}
            </Typography>
          </Box>

          {!success ? (
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="New Password"
                variant="outlined"
                margin="normal"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                required
              />

              <TextField
                fullWidth
                label="Confirm New Password"
                variant="outlined"
                margin="normal"
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Lock color="action" />
                    </InputAdornment>
                  ),
                }}
                sx={{ mb: 3, '& .MuiOutlinedInput-root': { borderRadius: '12px' } }}
                required
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
                  '&:hover': { background: 'linear-gradient(90deg, #4361ee, #3a0ca3)' },
                  mb: 2
                }}
              >
                {isSubmitting ? 'Updating...' : 'Update Password'}
              </Button>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <Box
                sx={{
                  width: 100,
                  height: 100,
                  borderRadius: '50%',
                  backgroundColor: alpha(theme.palette.success.main, 0.1),
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3
                }}
              >
                <Lock sx={{ fontSize: 48, color: theme.palette.success.main }} />
              </Box>
              <Button
                fullWidth
                variant="contained"
                onClick={() => navigate('/login')}
                sx={{
                  py: 1.5,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  background: 'linear-gradient(90deg, #3a86ff, #4361ee)',
                  boxShadow: '0 4px 12px rgba(58, 134, 255, 0.3)',
                  '&:hover': { background: 'linear-gradient(90deg, #4361ee, #3a0ca3)' }
                }}
              >
                Return to Login
              </Button>
            </Box>
          )}
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
