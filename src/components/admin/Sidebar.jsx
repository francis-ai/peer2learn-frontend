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
  People,
  School,
  Book,
  AccountBalance,
  Assignment,
  Class,
  Settings,
  Logout,
  Star,
  MonetizationOn,
  HowToReg,
  RequestPage,
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

const menuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/admin/' },
  { text: 'Manage Students', icon: <People />, path: '/admin/students' },
  { text: 'Manage Tutors', icon: <School />, path: '/admin/tutors' },
  { text: 'Manage Course', icon: <Book />, path: '/admin/courses' },
  { text: 'Manage Offices', icon: <AccountBalance />, path: '/admin/offices' },
  { text: 'Manage Cohubs', icon: <AccountBalance />, path: '/admin/cohubs' },
  { text: 'Tutor Courses', icon: <HowToReg />, path: '/admin/tutor-courses' }, 
  { text: 'Track Assignments', icon: <Assignment />, path: '/admin/assignments' },
  { text: 'Track Classes Progress', icon: <Class />, path: '/admin/classes' },
  { text: 'Tutor Withdrawals Request', icon: <RequestPage />, path: '/admin/withdrawals' }, 
  { text: 'Payments & Transactions', icon: <MonetizationOn />, path: '/admin/payments' },
  { text: 'Reviews & Feedback', icon: <Star />, path: '/admin/reviews' },
];

export default function AdminSidebar({ open, onClose, isMobile }) {
  const theme = useTheme();
   const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('cohubToken');
    localStorage.removeItem('cohub'); // clear stored cohub user info
    navigate('/admin/login');
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
          backgroundColor: 'grey', 
          display: { xs: 'none', md: 'flex' }, // Hide on mobile, show on desktop
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
            A
          </Avatar>
          <Typography variant="h6" fontWeight="bold">
            Admin Panel
          </Typography>
        </Box>
      </Toolbar>

      <Divider />

      <List sx={{ px: 2, pt: {xs: 9, md: 0} }}>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton 
            component={ Link }
            to={item.path}
            sx={{ borderRadius: 1, mb: 0.5 }}>
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
            to="/admin/settings">
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton 
            component={Link}
            to="/admin/other-settings">
              <ListItemIcon sx={{ minWidth: 40 }}>
                <Settings />
              </ListItemIcon>
              <ListItemText primary="Other Settings" />
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