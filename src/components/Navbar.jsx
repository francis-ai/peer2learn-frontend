import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, Box, Typography, Divider, Button, alpha, useTheme, Menu, MenuItem } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useAuth } from '../context/studentAuthContext';
import Logo from '../assets/images/peer2learn.png';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Navbar() {
  const { student } = useAuth();
  const studentId = student?.id;
  const [name, setName] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null); // profile menu
  const [loginAnchorEl, setLoginAnchorEl] = useState(null); // login dropdown%
  const location = useLocation();
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    if (!studentId) return;
    axios.get(`${BASE_URL}/api/students/profile/${studentId}`)
      .then(res => setName(res.data.name || ""))
      .catch(err => console.error(err));
  }, [studentId]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => setMobileOpen(false), [location]);

  const navItems = [
    { path: '/dashboard', label: 'Dashboard' },
    { path: '/my-classes', label: 'Classes' },
    { path: '/payment', label: 'Payment' },
    { path: '/reviews', label: 'Reviews' },
    { path: '/messages', label: 'Messages' },
    { path: '/notifications', label: 'Notifications' },
    { path: '/profile', label: 'Profile' },
  ];

  const loginItems = [
    { label: 'Login as Student', path: '/login' },
    { label: 'Login as Tutor', path: '/tutor/login' },
  ];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleProfileMenu = e => setAnchorEl(e.currentTarget);
  const handleProfileClose = () => setAnchorEl(null);
  const handleLoginMenu = e => setLoginAnchorEl(e.currentTarget);
  const handleLoginClose = () => setLoginAnchorEl(null);

  const desktopAuth = () => student ? (
    <>
      <IconButton onClick={handleProfileMenu} sx={{ p: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 1 }}>
          <AccountCircle sx={{ fontSize: 40, color: theme.palette.text.primary }} />
          <Typography fontWeight={500} sx={{ color: theme.palette.text.primary }}>{name || student.name || "Student"}</Typography>
        </Box>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleProfileClose}
        PaperProps={{ elevation: 0, sx: { mt: 1.5, filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.1))', '&:before': { content: '""', display: 'block', position: 'absolute', top: 0, right: 14, width: 10, height: 10, bgcolor: 'background.paper', transform: 'translateY(-50%) rotate(45deg)' }}}}>
        <MenuItem onClick={() => { handleProfileClose(); navigate('/profile'); }}>Profile</MenuItem>
        <Divider />
        <MenuItem onClick={() => { handleProfileClose(); navigate('/logout'); }}>Logout</MenuItem>
      </Menu>
    </>
  ) : (
    <>
      <Button onClick={handleLoginMenu} variant="text" sx={{ fontWeight: 600, textTransform: 'none' }}>Login</Button>
      <Menu anchorEl={loginAnchorEl} open={Boolean(loginAnchorEl)} onClose={handleLoginClose}>
        {loginItems.map(item => <MenuItem key={item.path} onClick={() => { handleLoginClose(); navigate(item.path); }}>{item.label}</MenuItem>)}
      </Menu>
      <Button component={Link} to="/register" variant="contained" sx={{ ml: 1, fontWeight: 600, textTransform: 'none', background: 'linear-gradient(90deg,#3a86ff,#4361ee)', '&:hover': { background: 'linear-gradient(90deg,#4361ee,#3a0ca3)' }}}>Get Started</Button>
    </>
  );

  const mobileAuth = () => student ? (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
        <AccountCircle sx={{ fontSize: 48, color: theme.palette.text.primary }} />
        <Typography variant="subtitle1" fontWeight={600}>{name || student.name || "Student"}</Typography>
      </Box>
      <Button component={Link} to="/profile" fullWidth variant="outlined" sx={{ mb: 1 }}>Profile</Button>
      <Button fullWidth variant="contained" sx={{ mb: 1, background: 'linear-gradient(90deg,#3a86ff,#4361ee)'}} onClick={() => navigate('/logout')}>Logout</Button>
    </>
  ) : (
    <>
      {loginItems.map(item => <Button key={item.path} fullWidth variant="contained" sx={{ mb: 1, background: 'linear-gradient(90deg,#3a86ff,#4361ee)'}} onClick={() => { handleDrawerToggle(); navigate(item.path); }}>{item.label}</Button>)}
      <Button component={Link} to="/register" fullWidth variant="contained" sx={{ mb: 1, background: 'linear-gradient(90deg,#3a86ff,#4361ee)'}}>Get Started</Button>
    </>
  );

  return (
    <>
      <AppBar position="fixed" elevation={0} sx={{ background: scrolled ? alpha(theme.palette.background.paper, 0.9) : 'transparent', backdropFilter: scrolled ? 'blur(10px)' : 'none', py: scrolled ? 0.5 : 2, borderBottom: scrolled ? `1px solid ${alpha(theme.palette.divider,0.1)}` : 'none', transition:'all 0.4s cubic-bezier(0.16,1,0.3,1)' }}>
        <Toolbar sx={{ maxWidth:'xl', mx:'auto', width:'90%', justifyContent:'space-between', px:{ xs:2, md:6 }}}>
          <Box component={Link} to="/" sx={{ display:'flex', alignItems:'center', textDecoration:'none', gap:1 }}>
            <img src={Logo} alt="Logo" style={{ height: '65px', objectFit:'contain' }} />
          </Box>

          {student && (
            <Box sx={{ display:{ xs:'none', md:'flex' }, position:'absolute', left:'50%', transform:'translateX(-50%)', gap:1 }}>
              {navItems.map(item => (
                <Button key={item.path} component={Link} to={item.path} sx={{ color: location.pathname===item.path? theme.palette.primary.main : alpha(theme.palette.text.primary,0.9), fontWeight:600, textTransform:'none', px:2, position:'relative', '&::after':{ content:'""', position:'absolute', bottom:4, left:'50%', transform:'translateX(-50%)', width: location.pathname===item.path?'60%':0, height:'3px', backgroundColor:theme.palette.primary.main, borderRadius:'2px', transition:'width 0.3s ease'}}}>{item.label}</Button>
              ))}
            </Box>
          )}

          <Box sx={{ display:{ xs:'none', md:'flex' }, gap:1, alignItems:'center' }}>{desktopAuth()}</Box>

          <IconButton color="inherit" edge="end" onClick={handleDrawerToggle} sx={{ display:{ md:'none' }, color:theme.palette.text.primary, backgroundColor:alpha(theme.palette.primary.main,0.1), '&:hover':{backgroundColor:alpha(theme.palette.primary.main,0.2)}}}><MenuIcon /></IconButton>
        </Toolbar>
      </AppBar>

      <Drawer variant="temporary" open={mobileOpen} onClose={handleDrawerToggle} ModalProps={{ keepMounted:true }} sx={{ display:{ xs:'block', md:'none' }, '& .MuiDrawer-paper':{ width:280, boxSizing:'border-box', background:theme.palette.background.default, borderLeft:`1px solid ${alpha(theme.palette.divider,0.1)}` }}}>
        <Box sx={{ display:'flex', flexDirection:'column', height:'100%', p:2 }}>
          <Box sx={{ display:'flex', justifyContent:'space-between', alignItems:'center', mb:2, pt:1 }}>
            <Box component={Link} to="/" onClick={handleDrawerToggle} sx={{ display:'flex', alignItems:'center', textDecoration:'none', gap:1 }}>
              <img src={Logo} alt="Logo" style={{ height: '70px', objectFit:'contain' }} />
            </Box>
            <IconButton onClick={handleDrawerToggle}><CloseIcon /></IconButton>
          </Box>
          <Divider sx={{ mb:2 }} />
          {student && <List sx={{ flex:1 }}>{navItems.map(item => <ListItem key={item.path} disablePadding sx={{ mb:0.5 }}><ListItemButton component={Link} to={item.path} onClick={handleDrawerToggle} selected={location.pathname===item.path} sx={{ borderRadius:'8px', py:1.5, px:2, '&.Mui-selected':{ backgroundColor: alpha(theme.palette.primary.main,0.1), '& .MuiTypography-root':{ color:theme.palette.primary.main, fontWeight:600}}}}><ListItemText primary={item.label} primaryTypographyProps={{ fontWeight:500 }} /></ListItemButton></ListItem>)}</List>}
          <Box sx={{ display:'flex', flexDirection:'column', gap:1, p:2 }}>{mobileAuth()}</Box>
        </Box>
      </Drawer>
    </>
  );
}
