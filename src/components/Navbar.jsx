import { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  Divider,
  Button,
  alpha,
  useTheme,
  Menu,
  MenuItem,
} from '@mui/material';
import axios from "axios";
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/studentAuthContext'; 
import Logo from '../assets/images/peer2learn.png';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Navbar() {
  const { student } = useAuth(); 
  const studentId = student?.id;
  const [name, setName] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();
  

  useEffect(() => {
    if (!studentId) return;

    const fetchName = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/students/profile/${studentId}`);
        console.log("Student profile response:", res.data); // ✅ log the response
        setName(res.data.name || "");
      } catch (err) {
        console.error("Failed to fetch student name:", err);
      }
    };

    fetchName();
  }, [studentId]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);


  // Navigation items - only shown when logged in
  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/my-classes', label: 'Classes' },
    { path: '/payment', label: 'Payment' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/notifications', label: 'Notifications' },
    { path: '/profile', label: 'Profile' },
  ];

  // Auth items - only shown when NOT logged in
  const authItems = [
    { path: '/login', label: 'Login', variant: 'text' },
    { path: '/register', label: 'Get Started', variant: 'contained' },
  ];

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          background: scrolled ? alpha(theme.palette.background.paper, 0.9) : 'transparent',
          backdropFilter: scrolled ? 'blur(10px)' : 'none',
          transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
          py: scrolled ? 0.5 : 2,
          borderBottom: scrolled ? `1px solid ${alpha(theme.palette.divider, 0.1)}` : 'none',
        }}
      >
        <Toolbar 
          sx={{ 
            maxWidth: 'xl',
            mx: 'auto',
            width: '90%',
            justifyContent: 'space-between',
            px: { xs: 2, md: 6 }
          }}
        >
          {/* Logo Section */}
          <Box 
            component={Link} 
            to="/" 
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              gap: 1,
              zIndex: 10
            }}
          >
           <img 
            src={Logo} 
            alt="Logo" 
            style={{ height: '65px', objectFit: 'contain' }} 
          />
          </Box>

          {/* Desktop Navigation - only shown when logged in */}
          {student && (
            <Box 
              sx={{ 
                display: { xs: 'none', md: 'flex' },
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
                gap: 1
              }}
            >
              {navItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  sx={{
                    color: location.pathname === item.path ? 
                      theme.palette.primary.main : 
                      alpha(theme.palette.text.primary, 0.9),
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    textTransform: 'none',
                    position: 'relative',
                    px: 2,
                    '&:hover': {
                      color: theme.palette.primary.main,
                      '&::after': {
                        width: '60%'
                      }
                    },
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      bottom: 4,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: location.pathname === item.path ? '60%' : 0,
                      height: '3px',
                      backgroundColor: theme.palette.primary.main,
                      borderRadius: '2px',
                      transition: 'width 0.3s ease'
                    }
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Auth Buttons or Profile Menu */}
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 1, alignItems: 'center' }}>
            {student ? (
              <>
                <IconButton
                  onClick={handleMenuOpen}
                  sx={{ 
                    p: 0,
                    '&:hover': {
                      backgroundColor: 'transparent', 
                    }
                  }}
                >
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: 1,
                    px: 1,
                    '&:hover': {
                      cursor: 'pointer' 
                    }
                  }}>
                    <AccountCircle sx={{ fontSize: 40, color: theme.palette.text.primary }} />
                    <Typography fontWeight={500} sx={{ color: theme.palette.text.primary }}>
                      {name || student.name || "Student"}
                    </Typography>
                  </Box>
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  <MenuItem onClick={() => { handleMenuClose(); navigate('/profile'); }}>
                    <ListItemText primary="Profile" />
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => {
                    handleMenuClose();
                    navigate('/logout');
                  }}>
                    <ListItemText primary="Logout" />
                  </MenuItem>
                </Menu>
              </>
            ) : (
              authItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  variant={item.variant}
                  sx={{
                    fontWeight: 600,
                    textTransform: 'none',
                    px: 3,
                    ...(item.variant === 'contained' && {
                      background: 'linear-gradient(90deg, #3a86ff, #4361ee)',
                      boxShadow: '0 4px 12px rgba(58, 134, 255, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #4361ee, #3a0ca3)'
                      }
                    })
                  }}
                >
                  {item.label}
                </Button>
              ))
            )}
          </Box>

          {/* Mobile Menu Button */}
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="end"
            onClick={handleDrawerToggle}
            sx={{ 
              display: { md: 'none' },
              color: theme.palette.text.primary,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.2)
              }
            }}
          >
            <MenuIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: 280,
            background: theme.palette.background.default,
            borderLeft: `1px solid ${alpha(theme.palette.divider, 0.1)}`
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            p: 2
          }}
        >
          {/* Drawer Header */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 2,
              pt: 1
            }}
          >
            <Box 
              component={Link} 
              to='/' 
              onClick={handleDrawerToggle}
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                gap: 1
              }}
            >
              <img 
                src={Logo} 
                alt="Logo" 
                style={{ height: '70px', objectFit: 'contain' }} 
              />
            </Box>
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ mb: 2 }} />

          {/* Mobile Navigation Links - only shown when logged in */}
          {student && (
            <List sx={{ flex: 1 }}>
              {navItems.map((item) => (
                <ListItem 
                  key={item.path} 
                  disablePadding
                  sx={{ mb: 0.5 }}
                >
                  <ListItemButton
                    component={Link}
                    to={item.path}
                    onClick={handleDrawerToggle}
                    selected={location.pathname === item.path}
                    sx={{
                      borderRadius: '8px',
                      py: 1.5,
                      px: 2,
                      '&.Mui-selected': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        '& .MuiTypography-root': {
                          color: theme.palette.primary.main,
                          fontWeight: 600
                        }
                      },
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.05)
                      }
                    }}
                  >
                    <ListItemText
                      primary={item.label}
                      primaryTypographyProps={{
                        fontWeight: 500
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          )}

          {/* Mobile Auth Buttons or Profile Info */}
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
            {student ? (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <AccountCircle sx={{ fontSize: 48, color: theme.palette.text.primary }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    {name || student.name || "Student"}
                  </Typography>
                </Box>
                <Button
                  component={Link}
                  to="/profile"
                  fullWidth
                  variant="outlined"
                  onClick={handleDrawerToggle}
                  sx={{
                    fontWeight: 600,
                    textTransform: 'none',
                    py: 1.5,
                  }}
                >
                  Profile
                </Button>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={() => {
                    handleDrawerToggle(); 
                    navigate('/logout');
                  }}
                  sx={{
                    fontWeight: 600,
                    textTransform: 'none',
                    py: 1.5,
                    background: 'linear-gradient(90deg, #3a86ff, #4361ee)',
                    boxShadow: '0 4px 12px rgba(58, 134, 255, 0.3)',
                    '&:hover': {
                      background: 'linear-gradient(90deg, #4361ee, #3a0ca3)'
                    }
                  }}
                >
                  Logout
                </Button>
              </>
            ) : (
              authItems.map((item) => (
                <Button
                  key={item.path}
                  component={Link}
                  to={item.path}
                  variant={item.variant}
                  fullWidth
                  onClick={handleDrawerToggle}
                  sx={{
                    fontWeight: 600,
                    textTransform: 'none',
                    py: 1.5,
                    ...(item.variant === 'contained' && {
                      background: 'linear-gradient(90deg, #3a86ff, #4361ee)',
                      boxShadow: '0 4px 12px rgba(58, 134, 255, 0.3)',
                      '&:hover': {
                        background: 'linear-gradient(90deg, #4361ee, #3a0ca3)'
                      }
                    })
                  }}
                >
                  {item.label}
                </Button>
              ))
            )}
          </Box>
        </Box>
      </Drawer>
    </>
  );
}