import { 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider, 
  Toolbar,
  Box,
  styled
} from '@mui/material';
import {
  Dashboard,
  School,
  People,
  CalendarMonth,
  Chat,
  Payments,
  Settings,
  Logout,
  Mail
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import Logo from '../../assets/images/peer2learn.png';
import { useTutorAuth } from "../../context/tutorAuthContext";

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

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/tutor' },
  { text: 'Courses', icon: <School />, path: '/tutor/courses' },
  { text: 'Students', icon: <People />, path: '/tutor/students' },
  { text: 'Schedule', icon: <CalendarMonth />, path: '/tutor/schedule' },
  { text: 'Earnings', icon: <Payments />, path: '/tutor/earnings' },
  { text: 'Messages', icon: <Chat />, path: '/tutor/messages' }, // fixed icon
  { text: 'Assignment', icon: <School />, path: '/tutor/assignment' },
  { text: 'Reviews', icon: <Chat />, path: '/tutor/reviews' },
  { text: 'Notification', icon: <Mail />, path: '/tutor/notification' }
];

const TutorSidebar = ({ open, onClose, isMobile }) => {
  const { setTutor } = useTutorAuth();   // ✅ Get setTutor

  const handleLogout = () => {
    localStorage.removeItem('tutorToken');
    localStorage.removeItem('tutor');

    setTutor(null);
  };

  return (
    <SidebarDrawer
      variant={isMobile ? 'temporary' : 'persistent'}
      open={open}
      onClose={onClose}
      ModalProps={{ keepMounted: true }}
    >
      <Toolbar 
        sx={{ 
          px: 3, 
          py: 4, 
          backgroundColor: '#000', 
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center'
        }}
      >
        <Box 
          component={Link} 
          to="/tutor/" 
          sx={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
            gap: 1,
            mx: "auto"
          }}
        >
          <img 
            src={Logo} 
            alt="Logo" 
            style={{ height: '90px', objectFit: 'contain' }} 
          />
        </Box>
      </Toolbar>

      <Divider />

      <List sx={{ px: 2, pt: {xs: 9, md: 0} }}>
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

      <Box sx={{ mt: 'auto', p: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton 
              component={Link}
              to="/tutor/profile-settings"
            >
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

export default TutorSidebar;