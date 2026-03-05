// // import { useState, useEffect } from 'react';
// // import { Link, useLocation, useNavigate } from 'react-router-dom';
// // import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Box, Typography, Divider, Button, alpha, useTheme, Menu, MenuItem } from '@mui/material';
// // import MenuIcon from '@mui/icons-material/Menu';
// // import CloseIcon from '@mui/icons-material/Close';
// // import AccountCircle from '@mui/icons-material/AccountCircle';
// // import { useAuth } from '../context/studentAuthContext';
// // import Logo from '../assets/images/peer2learn.png';
// // import axios from 'axios';

// // const BASE_URL = process.env.REACT_APP_BASE_URL;

// // export default function Navbar() {
// //   const { student } = useAuth();
// //   const studentId = student?.id;
// //   const [name, setName] = useState("");
// //   const [mobileOpen, setMobileOpen] = useState(false);
// //   const [scrolled, setScrolled] = useState(false);
// //   const [anchorEl, setAnchorEl] = useState(null); // profile menu
// //   const [loginAnchorEl, setLoginAnchorEl] = useState(null); // login dropdown%
// //   const location = useLocation();
// //   const theme = useTheme();
// //   const navigate = useNavigate();

// //   useEffect(() => {
// //     if (!studentId) return;
// //     axios.get(`${BASE_URL}/api/students/profile/${studentId}`)
// //       .then(res => setName(res.data.name || ""))
// //       .catch(err => console.error(err));
// //   }, [studentId]);

// //   useEffect(() => {
// //     const onScroll = () => setScrolled(window.scrollY > 10);
// //     window.addEventListener('scroll', onScroll);
// //     return () => window.removeEventListener('scroll', onScroll);
// //   }, []);

// //   useEffect(() => setMobileOpen(false), [location]);

// //   const navItems = [
// //     { path: '/dashboard', label: 'Dashboard' },
// //     { path: '/my-classes', label: 'Classes' },
// //     { path: '/payment', label: 'Payment' },
// //     { path: '/reviews', label: 'Reviews' },
// //     { path: '/messages', label: 'Messages' },
// //     { path: '/notifications', label: 'Notifications' },
// //     { path: '/profile', label: 'Profile' },
// //   ];

// //   const loginItems = [
// //     { label: 'Login as Student', path: '/login' },
// //     { label: 'Login as Tutor', path: '/tutor/login' },
// //   ];

// //   const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
// //   const handleProfileMenu = e => setAnchorEl(e.currentTarget);
// //   const handleProfileClose = () => setAnchorEl(null);
// //   const handleLoginMenu = e => setLoginAnchorEl(e.currentTarget);
// //   const handleLoginClose = () => setLoginAnchorEl(null);

// //   const desktopAuth = () => student ? (
// //     <>
// //       <IconButton onClick={handleProfileMenu} sx={{ p: 0 }}>
// //         <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
// //           <AccountCircle sx={{ fontSize: 40, color: theme.palette.text.primary }} />
// //           <Typography fontWeight={500} sx={{ color: theme.palette.text.primary }}>{name || student.name || "Student"}</Typography>
// //         </Box>
// //       </IconButton>
// //       <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileClose}
// //         PaperProps={{ elevation: 0, sx: { mt: 1.5, filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))', '&:before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)' }}}}>
// //         <MenuItem onClick={() => { handleProfileClose(); navigate('/profile'); }}>Profile</MenuItem>
// //         <Divider />
// //         <MenuItem onClick={() => { handleProfileClose(); navigate('/logout'); }}>Logout</MenuItem>
// //       </Menu>
// //     </>
// //   ) : (
// //     <>
// //       <Button onClick={handleLoginMenu} variant="text" sx={{ fontWeight: 600, textTransform: 'none' }}>Login</Button>
// //       <Menu anchorEl={loginAnchorEl} open={Boolean(loginAnchorEl)} onClose={handleLoginClose}>
// //         {loginItems.map(item => <MenuItem key={item.path} onClick={() => { handleLoginClose(); navigate(item.path); }}>{item.label}</MenuItem>)}
// //       </Menu>
// //       <Button component={Link} to="/register" variant="contained" sx={{ ml: 1, fontWeight: 600, textTransform: 'none', background: 'linear-gradient(90deg,#3a86ff,#4361ee)', '&:hover': { background: 'linear-gradient(90deg,#4361ee,#3a0ca3)' }}}>Get Started</Button>
// //     </>
// //   );

// //   const mobileAuth = () => student ? (
// //     <>
// //       <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
// //         <AccountCircle sx={{ fontSize: 48, color: theme.palette.text.primary }} />
// //         <Typography variant="subtitle1" fontWeight={600}>{name || student.name || "Student"}</Typography>
// //       </Box>
// //       <Button component={Link} to="/profile" fullWidth variant="outlined" sx={{ mb: 1 }}>Profile</Button>
// //       <Button fullWidth variant="contained" sx={{ mb: 1, background: 'linear-gradient(90deg,#3a86ff,#4361ee)'}} onClick={() => navigate('/logout')}>Logout</Button>
// //     </>
// //   ) : (
// //     <>
// //       {loginItems.map(item => <Button key={item.path} fullWidth variant="contained" sx={{ mb: 1, background: 'linear-gradient(90deg,#3a86ff,#4361ee)'}} onClick={() => { handleDrawerToggle(); navigate(item.path); }}>{item.label}</Button>)}
// //       <Button component={Link} to="/register" fullWidth variant="contained" sx={{ mb: 1, background: 'linear-gradient(90deg,#3a86ff,#4361ee)'}}>Get Started</Button>
// //     </>
// //   );

// //   return (
// //     <>
// //       <AppBar position="fixed" elevation={0} sx={{ background: scrolled ? alpha(theme.palette.background.paper, 0.9) : 'transparent', backdropFilter: scrolled ? 'blur(10px)' : 'none', py: scrolled ? 0.5 : 2, borderBottom: scrolled ? `1px solid ${alpha(theme.palette.divider,0.1)}` : 'none', transition:'all 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
// //         <Toolbar sx={{ maxWidth:'xl', mx:'auto', width:'90%', justifyContent:'space-between', px:{ xs:2, md:6 }}}>
// //           <Box component={Link} to="/" sx={{ display:'flex', alignItems:'center', textDecoration:'none', gap:1 }}>
// //             <img src={Logo} alt="Logo" style={{ height: '65px', objectFit:'contain' }} />
// //           </Box>

// //           {student && (
// //             <Box sx={{ display:{ xs:'none', md:'flex' }, position:'absolute', left:'50%', transform:'translateX(-50%)', gap:1 }}>
// //               {navItems.map(item => (
// //                 <Button key={item.path} component={Link} to={item.path} sx={{ color: location.pathname===item.path? theme.palette.primary.main : alpha(theme.palette.text.primary,0.9), fontWeight:600, textTransform:'none', px:2, position:'relative', '&::after':{ content:'""', position:'absolute', bottom:4, left:'50%', transform:'translateX(-50%)', width: location.pathname===item.path?'60%':0, height:'3px', backgroundColor:theme.palette.primary.main, borderRadius:'2px', transition:'width 0.3s ease'}}}>{item.label}</Button>
// //               ))}
// //             </Box>
// //           )}

// //           <Box sx={{ display:{ xs:'none', md:'flex' }, gap:1, alignItems:'center' }}>{desktopAuth()}</Box>

// //           <IconButton color="inherit" edge="end" onClick={handleDrawerToggle} sx={{ display:{ md:'none' }, color:theme.palette.text.primary, backgroundColor:alpha(theme.palette.primary.main,0.1), '&:hover':{backgroundColor:alpha(theme.palette.primary.main,0.2)}}}><MenuIcon /></IconButton>
// //         </Toolbar>
// //       </AppBar>

// //       <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted:true }} sx={{ display:{ xs:'block', md:'none' }, '& .MuiDrawer-paper':{ width:280, boxSizing:'border-box', background:theme.palette.background.default, borderLeft:`1px solid ${alpha(theme.palette.divider,0.1)}` }}}>
// //         <Box sx={{ display:'flex', flexDirection:'column', height:'100%', p:2 }}>
// //           <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2, pt:1 }}>
// //             <Box component={Link} to="/" onClick={handleDrawerToggle} sx={{ display:'flex', alignItems:'center', textDecoration:'none', gap:1 }}>
// //               <img src={Logo} alt="Logo" style={{ height: '70px', objectFit:'contain' }} />
// //             </Box>
// //             <IconButton onClick={handleDrawerToggle}><CloseIcon /></IconButton>
// //           </Box>
// //           <Divider sx={{ mb:2 }} />
// //           {student && <List sx={{ flex:1 }}>{navItems.map(item => <ListItem key={item.path} disablePadding sx={{ mb:0.5 }}><ListItemButton component={Link} to={item.path} onClick={handleDrawerToggle} selected={location.pathname===item.path} sx={{ borderRadius:'8px', py:1.5, px:2, '&.Mui-selected':{ backgroundColor: alpha(theme.palette.primary.main,0.1), '& .MuiTypography-root':{ color:theme.palette.primary.main, fontWeight:600}}}}><ListItemText primary={item.label} primaryTypographyProps={{ fontWeight:500 }} /></ListItemButton></ListItem>)}</List>}
// //           <Box sx={{ display:'flex', flexDirection:'column', gap:1, p:2 }}>{mobileAuth()}</Box>
// //         </Box>
// //       </Drawer>
// //     </>
// //   );
// // }





// import { useState, useEffect } from "react";
// import { Link, useLocation, useNavigate } from "react-router-dom";
// import {
//   AppBar,
//   Toolbar,
//   IconButton,
//   Drawer,
//   List,
//   ListItem,
//   ListItemButton,
//   ListItemText,
//   Box,
//   Typography,
//   Divider,
//   Button,
//   alpha,
//   useTheme,
//   Menu,
//   MenuItem,
// } from "@mui/material";

// import MenuIcon from "@mui/icons-material/Menu";
// import CloseIcon from "@mui/icons-material/Close";
// import AccountCircle from "@mui/icons-material/AccountCircle";

// import { useAuth } from "../context/studentAuthContext";
// import Logo from "../assets/images/peer2learn.png";

// export default function Navbar() {
//   const { student } = useAuth();

//   const location = useLocation();
//   const navigate = useNavigate();
//   const theme = useTheme();

//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [scrolled, setScrolled] = useState(false);

//   const [anchorEl, setAnchorEl] = useState(null);

//   const open = Boolean(anchorEl);

//   const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
//   const handleMenuClose = () => setAnchorEl(null);

//   const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

//   useEffect(() => {
//     const handleScroll = () => setScrolled(window.scrollY > 10);

//     window.addEventListener("scroll", handleScroll);

//     return () => window.removeEventListener("scroll", handleScroll);
//   }, []);

//   useEffect(() => {
//     setMobileOpen(false);
//   }, [location]);

//   /*
//   =========================
//   Scroll to Services
//   =========================
//   */

//   const scrollToServices = () => {
//     if (location.pathname !== "/") {
//       navigate("/", { state: { scrollTo: "services" } });
//     } else {
//       const el = document.getElementById("services");
//       if (el) el.scrollIntoView({ behavior: "smooth" });
//     }
//   };

//   /*
//   =========================
//   Student Dashboard Links
//   =========================
//   */

//   const dashboardLinks = [
//     { label: "Dashboard", path: "/dashboard" },
//     { label: "My Classes", path: "/my-classes" },
//     { label: "Payments", path: "/payment" },
//     { label: "Reviews", path: "/reviews" },
//     { label: "Messages", path: "/messages" },
//     { label: "Notifications", path: "/notifications" },
//     { label: "Profile", path: "/profile" },
//   ];

//   /*
//   =========================
//   PUBLIC NAV LINKS
//   =========================
//   */

//   const publicLinks = [
//     { label: "Home", path: "/" },
//     { label: "Services", action: scrollToServices },
//     { label: "Contact Us", path: "/contact-us" },
//     { label: "FAQs", path: "/faqs" },
//   ];

//   return (
//     <>
//       <AppBar
//         position="fixed"
//         elevation={0}
//         sx={{
//           background: scrolled
//             ? alpha(theme.palette.background.paper, 0.9)
//             : "transparent",
//           backdropFilter: scrolled ? "blur(10px)" : "none",
//           py: scrolled ? 0.5 : 2,
//           borderBottom: scrolled
//             ? `1px solid ${alpha(theme.palette.divider, 0.1)}`
//             : "none",
//           transition: "all .4s ease",
//         }}
//       >
//         <Toolbar
//           sx={{
//             maxWidth: "1200px",
//             width: "92%",
//             mx: "auto",
//             justifyContent: "space-between",
//           }}
//         >
//           {/* Logo */}

//           <Box
//             component={Link}
//             to="/"
//             sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}
//           >
//             <img src={Logo} alt="logo" style={{ height: 65 }} />
//           </Box>

//           {/* Desktop Public Nav */}

//           <Box sx={{ display: { xs: "none", md: "flex" }, gap: 3 }}>
//             {publicLinks.map((item) =>
//               item.path ? (
//                 <Button
//                   key={item.label}
//                   component={Link}
//                   to={item.path}
//                   sx={{
//                     color: theme.palette.text.primary,
//                     fontWeight: 600,
//                     textTransform: "none",
//                   }}
//                 >
//                   {item.label}
//                 </Button>
//               ) : (
//                 <Button
//                   key={item.label}
//                   onClick={item.action}
//                   sx={{
//                     color: theme.palette.text.primary,
//                     fontWeight: 600,
//                     textTransform: "none",
//                   }}
//                 >
//                   {item.label}
//                 </Button>
//               )
//             )}
//           </Box>

//           {/* Right Section */}

//           <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center" }}>
//             {student ? (
//               <>
//                 <Button
//                   onClick={handleMenuOpen}
//                   startIcon={<AccountCircle />}
//                   sx={{
//                     textTransform: "none",
//                     fontWeight: 600,
//                     color: theme.palette.text.primary,
//                   }}
//                 >
//                   {student.name}
//                 </Button>

//                 {/* Dropdown */}

//                 <Menu
//                   anchorEl={anchorEl}
//                   open={open}
//                   onClose={handleMenuClose}
//                   PaperProps={{
//                     elevation: 3,
//                     sx: { mt: 1.5, minWidth: 220 },
//                   }}
//                 >
//                   {dashboardLinks.map((item) => (
//                     <MenuItem
//                       key={item.path}
//                       onClick={() => {
//                         navigate(item.path);
//                         handleMenuClose();
//                       }}
//                     >
//                       {item.label}
//                     </MenuItem>
//                   ))}

//                   <Divider />

//                   <MenuItem
//                     onClick={() => {
//                       navigate("/logout");
//                       handleMenuClose();
//                     }}
//                   >
//                     Logout
//                   </MenuItem>
//                 </Menu>
//               </>
//             ) : (
//               <>
//                 <Button
//                   component={Link}
//                   to="/login"
//                   sx={{
//                     fontWeight: 600,
//                     textTransform: "none",
//                     color: theme.palette.text.primary,
//                   }}
//                 >
//                   Login
//                 </Button>

//                 <Button
//                   component={Link}
//                   to="/register"
//                   variant="contained"
//                   sx={{
//                     ml: 2,
//                     textTransform: "none",
//                     fontWeight: 600,
//                     background:
//                       "linear-gradient(90deg,#3a86ff,#4361ee)",
//                   }}
//                 >
//                   Get Started
//                 </Button>
//               </>
//             )}
//           </Box>

//           {/* Mobile Menu Button */}

//           <IconButton
//             onClick={handleDrawerToggle}
//             sx={{ display: { md: "none" } }}
//           >
//             <MenuIcon />
//           </IconButton>
//         </Toolbar>
//       </AppBar>

//       {/* MOBILE DRAWER */}

//       <Drawer
//         anchor="right"
//         open={mobileOpen}
//         onClose={handleDrawerToggle}
//         sx={{
//           "& .MuiDrawer-paper": {
//             width: 260,
//           },
//         }}
//       >
//         <Box sx={{ p: 2 }}>
//           <IconButton onClick={handleDrawerToggle}>
//             <CloseIcon />
//           </IconButton>

//           <Divider sx={{ my: 2 }} />

//           {/* Public Links */}

//           <List>
//             {publicLinks.map((item) => (
//               <ListItem key={item.label} disablePadding>
//                 <ListItemButton
//                   onClick={() => {
//                     handleDrawerToggle();

//                     if (item.path) navigate(item.path);
//                     else item.action();
//                   }}
//                 >
//                   <ListItemText primary={item.label} />
//                 </ListItemButton>
//               </ListItem>
//             ))}
//           </List>

//           <Divider sx={{ my: 2 }} />

//           {/* Auth Section */}

//           {student ? (
//             <>
//               <Typography sx={{ px: 2, mb: 1, fontWeight: 600 }}>
//                 {student.name}
//               </Typography>

//               <List>
//                 {dashboardLinks.map((item) => (
//                   <ListItem key={item.path} disablePadding>
//                     <ListItemButton
//                       onClick={() => {
//                         navigate(item.path);
//                         handleDrawerToggle();
//                       }}
//                     >
//                       <ListItemText primary={item.label} />
//                     </ListItemButton>
//                   </ListItem>
//                 ))}

//                 <ListItem disablePadding>
//                   <ListItemButton
//                     onClick={() => {
//                       navigate("/logout");
//                       handleDrawerToggle();
//                     }}
//                   >
//                     <ListItemText primary="Logout" />
//                   </ListItemButton>
//                 </ListItem>
//               </List>
//             </>
//           ) : (
//             <>
//               <Button
//                 fullWidth
//                 variant="contained"
//                 sx={{ mb: 1 }}
//                 onClick={() => navigate("/login")}
//               >
//                 Login
//               </Button>

//               <Button
//                 fullWidth
//                 variant="outlined"
//                 onClick={() => navigate("/register")}
//               >
//                 Register
//               </Button>
//             </>
//           )}
//         </Box>
//       </Drawer>
//     </>
//   );
// }


import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Box,
  Typography,
  Divider,
  Button,
  alpha,
  useTheme,
  Menu,
  MenuItem,
  Avatar,
  Badge,
  Container,
  Fade,
  Zoom,
} from "@mui/material";

import {
  Menu as MenuIcon,
  Close as CloseIcon,
  Dashboard as DashboardIcon,
  Class as ClassIcon,
  Payment as PaymentIcon,
  Star as StarIcon,
  Message as MessageIcon,
  Notifications as NotificationsIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Login as LoginIcon,
  AppRegistration as RegisterIcon,
  KeyboardArrowDown as ArrowDownIcon,
} from "@mui/icons-material";

import { useAuth } from "../context/studentAuthContext";
import Logo from "../assets/images/peer2learn.png";

export default function Navbar() {
  const { student } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [hoveredLink, setHoveredLink] = useState(null);

  const open = Boolean(anchorEl);

  const handleMenuOpen = (e) => setAnchorEl(e.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [location]);

  const scrollToServices = () => {
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: "services" } });
    } else {
      const el = document.getElementById("services");
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  };

  const dashboardLinks = [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { label: "My Classes", path: "/my-classes", icon: <ClassIcon /> },
    { label: "Payments", path: "/payment", icon: <PaymentIcon /> },
    { label: "Reviews", path: "/reviews", icon: <StarIcon /> },
    { label: "Messages", path: "/messages", icon: <MessageIcon />, badge: 2 },
    { label: "Notifications", path: "/notifications", icon: <NotificationsIcon />},
    { label: "Profile", path: "/profile", icon: <PersonIcon /> },
  ];

  const publicLinks = [
    { label: "Home", path: "/"},
    { label: "Services", action: scrollToServices},
    { label: "Contact Us", path: "/contact-us"},
    { label: "FAQs", path: "/faqs" },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <AppBar
        position="fixed"
        elevation={scrolled ? 4 : 0}
        sx={{
          background: scrolled
            ? alpha(theme.palette.background.paper, 0.95)
            : "transparent",
          backdropFilter: scrolled ? "blur(10px)" : "none",
          borderBottom: scrolled
            ? `1px solid ${alpha(theme.palette.divider, 0.1)}`
            : "none",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          py: scrolled ? 0.5 : 1.5,
        }}
      >
        <Container maxWidth="xl">
          <Toolbar disableGutters sx={{ justifyContent: "space-between" }}>
            {/* Logo with animation */}
            <Box
              component={Link}
              to="/"
              sx={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                position: "relative",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: -4,
                  left: 0,
                  width: scrolled ? "100%" : "0%",
                  height: "2px",
                  background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  transition: "width 0.3s ease",
                },
              }}
            >
              <Zoom in={true} style={{ transitionDelay: "100ms" }}>
                <img
                  src={Logo}
                  alt="Peer2Learn"
                  style={{
                    height: scrolled ? 55 : 65,
                    transition: "height 0.3s ease",
                    objectFit: "contain",
                  }}
                />
              </Zoom>
            </Box>

            {/* Desktop Public Nav with hover effects */}
            <Box
              sx={{
                display: { xs: "none", md: "flex" },
                gap: 1,
                alignItems: "center",
              }}
            >
              {publicLinks.map((item, index) => {
                const isActiveLink = item.path && isActive(item.path);
                
                return (
                  <Fade in={true} style={{ transitionDelay: `${index * 50}ms` }} key={item.label}>
                    <Box sx={{ position: "relative" }}>
                      {item.path ? (
                        <Button
                          component={Link}
                          to={item.path}
                          onMouseEnter={() => setHoveredLink(item.label)}
                          onMouseLeave={() => setHoveredLink(null)}
                          sx={{
                            color: isActiveLink
                              ? theme.palette.primary.main
                              : scrolled
                              ? theme.palette.text.primary
                              : "#000",
                            fontWeight: 600,
                            textTransform: "none",
                            fontSize: "1rem",
                            px: 2,
                            py: 1,
                            position: "relative",
                            overflow: "hidden",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              bottom: 0,
                              left: "50%",
                              transform: "translateX(-50%)",
                              width: hoveredLink === item.label || isActiveLink ? "80%" : "0%",
                              height: "3px",
                              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                              borderRadius: "3px",
                              transition: "width 0.3s ease",
                            },
                            "&:hover": {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {item.label}
                          </Box>
                        </Button>
                      ) : (
                        <Button
                          onClick={item.action}
                          onMouseEnter={() => setHoveredLink(item.label)}
                          onMouseLeave={() => setHoveredLink(null)}
                          sx={{
                            color: scrolled ? theme.palette.text.primary : "#000",
                            fontWeight: 600,
                            textTransform: "none",
                            fontSize: "1rem",
                            px: 2,
                            py: 1,
                            position: "relative",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              bottom: 0,
                              left: "50%",
                              transform: "translateX(-50%)",
                              width: hoveredLink === item.label ? "80%" : "0%",
                              height: "3px",
                              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                              borderRadius: "3px",
                              transition: "width 0.3s ease",
                            },
                            "&:hover": {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {item.label}
                          </Box>
                        </Button>
                      )}
                    </Box>
                  </Fade>
                );
              })}
            </Box>

            {/* Right Section with enhanced auth UI */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {student ? (
                <Fade in={true}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    {/* Profile Menu */}
                    <Button
                      onClick={handleMenuOpen}
                      sx={{
                        textTransform: "none",
                        borderRadius: "40px",
                        py: 0.5,
                        px: 1.5,
                        backgroundColor: open
                          ? alpha(theme.palette.primary.main, 0.1)
                          : "transparent",
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.primary.main, 0.15),
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <Avatar
                          sx={{
                            width: 32,
                            height: 32,
                            bgcolor: theme.palette.primary.main,
                            fontSize: "0.875rem",
                            fontWeight: 600,
                          }}
                        >
                          {student.name?.charAt(0).toUpperCase() || "S"}
                        </Avatar>
                        <Typography
                          sx={{
                            color: scrolled ? theme.palette.text.primary : "#000",
                            fontWeight: 500,
                            display: { xs: "none", sm: "block" },
                          }}
                        >
                          {student.name?.split(" ")[0] || "Student"}
                        </Typography>
                        <ArrowDownIcon
                          sx={{
                            color: scrolled ? theme.palette.text.primary : "#000",
                            fontSize: 20,
                            transform: open ? "rotate(180deg)" : "none",
                            transition: "transform 0.3s",
                          }}
                        />
                      </Box>
                    </Button>

                    {/* Enhanced Dropdown Menu */}
                    <Menu
                      anchorEl={anchorEl}
                      open={open}
                      onClose={handleMenuClose}
                      onClick={handleMenuClose}
                      PaperProps={{
                        elevation: 8,
                        sx: {
                          mt: 1.5,
                          minWidth: 240,
                          borderRadius: "12px",
                          overflow: "visible",
                          "&::before": {
                            content: '""',
                            display: "block",
                            position: "absolute",
                            top: 0,
                            right: 20,
                            width: 10,
                            height: 10,
                            bgcolor: "background.paper",
                            transform: "translateY(-50%) rotate(45deg)",
                            zIndex: 0,
                          },
                        },
                      }}
                      transformOrigin={{ horizontal: "right", vertical: "top" }}
                      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                    >
                      <Box sx={{ px: 2, py: 1.5 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Signed in as
                        </Typography>
                        <Typography variant="body1" fontWeight={600}>
                          {student.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {student.email}
                        </Typography>
                      </Box>
                      <Divider />
                      {dashboardLinks.map((item) => (
                        <MenuItem
                          key={item.path}
                          onClick={() => {
                            navigate(item.path);
                            handleMenuClose();
                          }}
                          sx={{
                            py: 1,
                            position: "relative",
                            "&:hover": {
                              backgroundColor: alpha(theme.palette.primary.main, 0.1),
                            },
                          }}
                        >
                          <ListItemIcon sx={{ minWidth: 36 }}>
                            {item.badge ? (
                              <Badge badgeContent={item.badge} color="error" variant="dot">
                                {item.icon}
                              </Badge>
                            ) : (
                              item.icon
                            )}
                          </ListItemIcon>
                          <ListItemText primary={item.label} />
                        </MenuItem>
                      ))}
                      <Divider />
                      <MenuItem
                        onClick={() => {
                          navigate("/logout");
                          handleMenuClose();
                        }}
                        sx={{
                          py: 1,
                          color: "error.main",
                          "&:hover": {
                            backgroundColor: alpha(theme.palette.error.main, 0.1),
                          },
                        }}
                      >
                        <ListItemIcon sx={{ minWidth: 36 }}>
                          <LogoutIcon fontSize="small" color="error" />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                      </MenuItem>
                    </Menu>
                  </Box>
                </Fade>
              ) : (
                <Fade in={true}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                    <Button
                      component={Link}
                      to="/login"
                      startIcon={<LoginIcon />}
                      sx={{
                        fontWeight: 600,
                        textTransform: "none",
                        color: scrolled ? theme.palette.text.primary : "#000",
                        border: `1px solid ${alpha(
                          scrolled ? theme.palette.text.primary : "#000",
                          0.3
                        )}`,
                        borderRadius: "8px",
                        px: 2,
                        "&:hover": {
                          borderColor: theme.palette.primary.main,
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    >
                      Login
                    </Button>
                    <Button
                      component={Link}
                      to="/register"
                      variant="contained"
                      startIcon={<RegisterIcon />}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        px: 3,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        boxShadow: theme.shadows[4],
                        "&:hover": {
                          background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                          transform: "translateY(-2px)",
                          boxShadow: theme.shadows[8],
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      Get Started
                    </Button>
                  </Box>
                </Fade>
              )}

              {/* Mobile Menu Button with animation */}
              <IconButton
                onClick={handleDrawerToggle}
                sx={{
                  display: { md: "none" },
                  color: scrolled ? theme.palette.text.primary : "#000",
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  "&:hover": {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    transform: "scale(1.1)",
                  },
                  transition: "all 0.2s",
                }}
              >
                {mobileOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Enhanced Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        sx={{
          "& .MuiDrawer-paper": {
            width: 300,
            borderTopLeftRadius: "20px",
            borderBottomLeftRadius: "20px",
            background: "#fff",
          },
        }}
      >
        <Box sx={{ p: 3 }}>
          {/* Mobile Header */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <img src={Logo} alt="Peer2Learn" style={{ height: 50 }} />
            <IconButton onClick={handleDrawerToggle}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Public Links with icons */}
          <List>
            {publicLinks.map((item) => (
              <ListItem key={item.label} disablePadding sx={{ mb: 1 }}>
                <ListItemButton
                  onClick={() => {
                    handleDrawerToggle();
                    if (item.path) navigate(item.path);
                    else item.action();
                  }}
                  sx={{
                    borderRadius: "10px",
                    "&:hover": {
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                    },
                  }}
                >
                  <ListItemText 
                    primary={item.label} 
                    primaryTypographyProps={{ fontWeight: 500 }}
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>

          <Divider sx={{ my: 2 }} />

          {/* Mobile Auth Section */}
          {student ? (
            <>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                <Avatar
                  sx={{
                    width: 50,
                    height: 50,
                    bgcolor: theme.palette.primary.main,
                  }}
                >
                  {student.name?.charAt(0).toUpperCase() || "S"}
                </Avatar>
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {student.name}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    {student.email}
                  </Typography>
                </Box>
              </Box>

              <List>
                {dashboardLinks.map((item) => (
                  <ListItem key={item.path} disablePadding sx={{ mb: 1 }}>
                    <ListItemButton
                      onClick={() => {
                        navigate(item.path);
                        handleDrawerToggle();
                      }}
                      sx={{
                        borderRadius: "10px",
                        "&:hover": {
                          backgroundColor: alpha(theme.palette.primary.main, 0.1),
                        },
                      }}
                    >
                      <ListItemIcon sx={{ minWidth: 40, color: theme.palette.primary.main }}>
                        {item.badge ? (
                          <Badge badgeContent={item.badge} color="error" variant="dot">
                            {item.icon}
                          </Badge>
                        ) : (
                          item.icon
                        )}
                      </ListItemIcon>
                      <ListItemText 
                        primary={item.label} 
                        primaryTypographyProps={{ fontWeight: 500 }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
                <ListItem disablePadding sx={{ mt: 2 }}>
                  <ListItemButton
                    onClick={() => {
                      navigate("/logout");
                      handleDrawerToggle();
                    }}
                    sx={{
                      borderRadius: "10px",
                      color: "error.main",
                      "&:hover": {
                        backgroundColor: alpha(theme.palette.error.main, 0.1),
                      },
                    }}
                  >
                    <ListItemIcon sx={{ minWidth: 40, color: "error.main" }}>
                      <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Logout" 
                      primaryTypographyProps={{ fontWeight: 500 }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </>
          ) : (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<LoginIcon />}
                onClick={() => {
                  navigate("/login");
                  handleDrawerToggle();
                }}
                sx={{
                  py: 1.5,
                  borderRadius: "10px",
                  borderColor: theme.palette.primary.main,
                  color: theme.palette.primary.main,
                  "&:hover": {
                    borderColor: theme.palette.primary.dark,
                    backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  },
                }}
              >
                Login
              </Button>
              <Button
                fullWidth
                variant="contained"
                startIcon={<RegisterIcon />}
                onClick={() => {
                  navigate("/register");
                  handleDrawerToggle();
                }}
                sx={{
                  py: 1.5,
                  borderRadius: "10px",
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                }}
              >
                Get Started
              </Button>
            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}