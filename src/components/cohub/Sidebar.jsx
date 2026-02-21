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
  Settings,
  Logout,
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import Logo from '../../assets/images/peer2learn.png';

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
  { text: 'Payments', icon: <Dashboard />, path: '/cohub/payments' },
  { text: 'Withdrawals', icon: <Dashboard />, path: '/cohub/withdrawal' },
];

const CohubSidebar = ({ open, onClose, isMobile }) => {
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
            backgroundColor: '#000', 
            display: { xs: 'none', md: 'flex' }, // Hide on mobile, show on desktop
            alignItems: 'center'
          }}
        >
          {/* Logo Section */}
          <Box 
            component={Link} 
            to="/tutor/" 
            sx={{
              display: 'flex',
              alignItems: 'center',
              textDecoration: 'none',
              gap: 1,
              zIndex: 10,
              mx: "auto"
            }}
          >
            <img 
              src={Logo} 
              alt="Logo" 
              style={{ height: '90px', objectFit: 'contain', mx: 'auto' }} 
            />
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



// import { 
//   Drawer, 
//   List, 
//   ListItem, 
//   ListItemButton, 
//   ListItemIcon, 
//   ListItemText, 
//   Divider, 
//   Toolbar,
//   Box,
//   styled
// } from '@mui/material';
// import {
//   Dashboard,
//   Settings,
//   Logout,
// } from '@mui/icons-material';
// import { Link } from 'react-router-dom';
// import Logo from '../../assets/images/peer2learn.png';
// import { useCohubAuth } from "../../context/cohubAuthContext";

// const SidebarDrawer = styled(Drawer)(({ theme }) => ({
//   width: 280,
//   flexShrink: 0,
//   '& .MuiDrawer-paper': {
//     width: 280,
//     boxSizing: 'border-box',
//     backgroundColor: theme.palette.background.paper,
//     borderRight: 'none',
//     boxShadow: theme.shadows[16]
//   }
// }));

// // Update these paths to Cohub-specific routes
// const menuItems = [
//   { text: 'Dashboard', icon: <Dashboard />, path: '/cohub' },
//   { text: 'Our Users', icon: <Dashboard />, path: '/cohub/users' },
//   { text: 'Payments', icon: <Dashboard />, path: '/cohub/payments' },
//   { text: 'Withdrawals', icon: <Dashboard />, path: '/cohub/withdrawal' },
// ];

// const CohubSidebar = ({ open, onClose, isMobile }) => {
//   const { setCohub } = useCohubAuth();

//   const handleLogout = () => {
//     localStorage.removeItem('tutorToken');
//     localStorage.removeItem('tutor');

//     setCohub(null);
//   };
  


//   return (
//     <SidebarDrawer
//       variant={isMobile ? 'temporary' : 'persistent'}
//       open={open}
//       onClose={onClose}
//       ModalProps={{ keepMounted: true }}
//     >
//       {/* Header - shows on desktop */}
//        <Toolbar 
//           sx={{ 
//             px: 3, 
//             py: 4, 
//             backgroundColor: '#000', 
//             display: { xs: 'none', md: 'flex' }, // Hide on mobile, show on desktop
//             alignItems: 'center'
//           }}
//         >
//           {/* Logo Section */}
//           <Box 
//             component={Link} 
//             to="/tutor/" 
//             sx={{
//               display: 'flex',
//               alignItems: 'center',
//               textDecoration: 'none',
//               gap: 1,
//               zIndex: 10,
//               mx: "auto"
//             }}
//           >
//             <img 
//               src={Logo} 
//               alt="Logo" 
//               style={{ height: '90px', objectFit: 'contain', mx: 'auto' }} 
//             />
//           </Box>
//         </Toolbar>

//       <Divider />

//       {/* Menu Items */}
//       <List sx={{ px: 2, pt: { xs: 9, md: 0 } }}>
//         {menuItems.map((item) => (
//           <ListItem key={item.text} disablePadding>
//             <ListItemButton 
//               component={Link}
//               to={item.path}
//               sx={{ borderRadius: 1, mb: 0.5 }}
//             >
//               <ListItemIcon sx={{ minWidth: 40 }}>
//                 {item.icon}
//               </ListItemIcon>
//               <ListItemText 
//                 primary={item.text} 
//                 primaryTypographyProps={{ fontWeight: 500 }}
//               />
//             </ListItemButton>
//           </ListItem>
//         ))}
//       </List>

//       {/* Footer Links */}
//       <Box sx={{ mt: 'auto', p: 2 }}>
//         <Divider sx={{ mb: 2 }} />
//         <List>
//           <ListItem disablePadding>
//             <ListItemButton component={Link} to="/cohub/profile-settings">
//               <ListItemIcon sx={{ minWidth: 40 }}>
//                 <Settings />
//               </ListItemIcon>
//               <ListItemText primary="Profile Settings" />
//             </ListItemButton>
//           </ListItem>
//           <ListItem disablePadding>
//             <ListItemButton onClick={handleLogout}>
//               <ListItemIcon sx={{ minWidth: 40 }}>
//                 <Logout />
//               </ListItemIcon>
//               <ListItemText primary="Logout" />
//             </ListItemButton>
//           </ListItem>
//         </List>
//       </Box>
//     </SidebarDrawer>
//   );
// };

// export default CohubSidebar;
