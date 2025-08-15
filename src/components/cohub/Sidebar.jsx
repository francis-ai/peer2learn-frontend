import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Toolbar,
  useTheme,
  Avatar,
  Typography,
  Box,
  styled
} from '@mui/material';
import {
  Dashboard,
  Settings,
  Logout,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const SidebarDrawer = styled(Drawer)(({ theme }) => ({
  width: 280,
  flexShrink: 0,
  '& .MuiDrawer-paper': {
    width: 280,
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.paper,
    borderRight: 'none',
    boxShadow: theme.shadows[16]
  }
}));

// Update these paths to Cohub-specific routes
const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/cohub' },
  { text: 'Our Users', icon: <Dashboard />, path: '/cohub/users' },
];

const CohubSidebar = ({ open, onClose, isMobile }) => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('cohubToken');
    localStorage.removeItem('cohub'); // clear stored cohub user info
    navigate('/cohub/login');
  };
  

  return (
    <SidebarDrawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
    >
      {/* Header - shows on desktop */}
      <Toolbar 
        sx={{ 
          px: 3, 
          py: 4, 
          backgroundColor: 'grey', 
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center'
        }}
      >
        <Box display="flex" alignItems="center">
          <Avatar 
            sx={{ 
              width: 40, 
              height: 40, 
              mr: 2,
              bgcolor: theme.palette.primary.main 
            }}
          >
            C
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            Cohub Admin
          </Typography>
        </Box>
      </Toolbar>

      <Divider />

      {/* Menu Items */}
      <List sx={{ px: 2, pt: { xs: 9, md: 0 } }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
              component={Link}
              to={item.path}
              sx={{ borderRadius: 1, mb: 0.5 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ fontWeight: 500 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Footer Links */}
      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton component={Link} to="/cohub/profile-settings">
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Profile Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={handleLogout}>
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Logout />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </SidebarDrawer>
  );
};

export default CohubSidebar;
