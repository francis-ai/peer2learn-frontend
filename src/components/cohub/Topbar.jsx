import { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  IconButton, 
  Avatar, 
  Box, 
  Typography,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  Divider
} from '@mui/material';
import {
  Menu as MenuIcon,
  Logout,
  AccountCircle,
  ArrowDropDown
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useCohubAuth } from '../../context/cohubAuthContext'; 

const CohubTopbar = ({ onMenuClick, drawerWidth = 0 }) => {
  const { cohub } = useCohubAuth();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('cohubToken');
    localStorage.removeItem('cohub');
    navigate('/cohub/login');
  };

  return (
    <AppBar 
      position="fixed"
      sx={{
        width: { md: `calc(100% - ${drawerWidth}px)` },
        ml: { md: `${drawerWidth}px` },
        zIndex: theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        boxShadow: 'none',
        borderBottom: `1px solid ${theme.palette.divider}`,
        backdropFilter: 'blur(6px)',
        transition: theme.transitions.create(['width', 'margin'], {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
      }}
    >
      <Toolbar sx={{ 
        px: { xs: 2, sm: 3 },
        minHeight: '64px !important',
        justifyContent: 'space-between'
      }}>
        {/* Left Section */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            color="inherit"
            edge="start"
            onClick={onMenuClick}
            sx={{ 
              mr: 2,
              display: { md: 'none' },
              color: theme.palette.text.secondary
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ 
              display: { xs: 'block', sm: 'block' },
              fontWeight: 600,
              color: theme.palette.text.primary
            }}
          >
            Cohub Dashboard
          </Typography>
        </Box>

        {/* Right Section */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, sm: 1 } }}>
          <Box 
            sx={{ 
              display: 'flex', 
              alignItems: 'center',
              ml: 1,
              cursor: 'pointer',
              borderRadius: 1,
              p: '4px 8px 4px 4px',
              '&:hover': { backgroundColor: theme.palette.action.hover }
            }} 
            onClick={handleClick}
          >
            <Avatar 
              src="/avatars/cohub-profile.jpg" 
              sx={{ width: 32, height: 32, mr: 1 }}
            />
            <Typography 
              variant="body2" 
              sx={{ 
                display: { xs: 'none', sm: 'block' },
                fontWeight: 500,
                color: theme.palette.text.primary
              }}
            >
              {cohub?.name}
            </Typography>
            <ArrowDropDown sx={{ color: theme.palette.text.secondary, fontSize: '20px' }} />
          </Box>

          {/* Menu */}
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: 'visible',
                filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                mt: 1.5,
                minWidth: 200,
                '& .MuiAvatar-root': { width: 32, height: 32, ml: -0.5, mr: 1 },
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
            <MenuItem>
              <Typography 
                component={Link} 
                to="/cohub/profile-settings" 
                sx={{ textDecoration: 'none', color: 'black' }}
              >
                <ListItemIcon>
                  <AccountCircle fontSize="small" />
                </ListItemIcon>
                Profile
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <Logout fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default CohubTopbar;
