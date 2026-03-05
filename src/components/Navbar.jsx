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
import SchoolIcon from "@mui/icons-material/School";
import CastForEducationIcon from "@mui/icons-material/CastForEducation";

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

  const [loginAnchor, setLoginAnchor] = useState(null);
  const [registerAnchor, setRegisterAnchor] = useState(null);

  const openLogin = Boolean(loginAnchor);
  const openRegister = Boolean(registerAnchor);

  const handleLoginOpen = (e) => setLoginAnchor(e.currentTarget);
  const handleRegisterOpen = (e) => setRegisterAnchor(e.currentTarget);

  const handleLoginClose = () => setLoginAnchor(null);
  const handleRegisterClose = () => setRegisterAnchor(null);

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
                  <Box sx={{ display: { xs: "none", md: "flex" }, alignItems: "center", gap: 1.5 }}>
                    {/* LOGIN DROPDOWN */}
                    <Button
                      startIcon={<LoginIcon />}
                      onClick={handleLoginOpen}
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

                    <Menu
                      anchorEl={loginAnchor}
                      open={openLogin}
                      onClose={handleLoginClose}
                    >
                      <MenuItem
                        onClick={() => {
                          navigate("/login");
                          handleLoginClose();
                        }}
                      >
                        <ListItemIcon>
                          <SchoolIcon fontSize="small" />
                        </ListItemIcon>
                        Login as Student
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          navigate("/tutor/login");
                          handleLoginClose();
                        }}
                      >
                        <ListItemIcon>
                          <CastForEducationIcon fontSize="small" />
                        </ListItemIcon>
                        Login as Tutor
                      </MenuItem>
                    </Menu>


                    {/* REGISTER DROPDOWN */}
                    <Button
                      variant="contained"
                      startIcon={<RegisterIcon />}
                      onClick={handleRegisterOpen}
                      sx={{
                        textTransform: "none",
                        fontWeight: 600,
                        px: 3,
                        background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                        boxShadow: theme.shadows[4],
                        "&:hover": {
                          transform: "translateY(-2px)",
                          boxShadow: theme.shadows[8],
                        },
                        transition: "all 0.2s ease",
                      }}
                    >
                      Get Started
                    </Button>

                    <Menu
                      anchorEl={registerAnchor}
                      open={openRegister}
                      onClose={handleRegisterClose}
                    >
                      <MenuItem
                        onClick={() => {
                          navigate("/register");
                          handleRegisterClose();
                        }}
                      >
                        <ListItemIcon>
                          <SchoolIcon fontSize="small" />
                        </ListItemIcon>
                        Register as Student
                      </MenuItem>

                      <MenuItem
                        onClick={() => {
                          navigate("/tutor/register");
                          handleRegisterClose();
                        }}
                      >
                        <ListItemIcon>
                          <CastForEducationIcon fontSize="small" />
                        </ListItemIcon>
                        Register as Tutor
                      </MenuItem>
                    </Menu>

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
              <Typography fontWeight={600} color="text.secondary">
                Login
              </Typography>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<SchoolIcon />}
                onClick={() => {
                  navigate("/login");
                  handleDrawerToggle();
                }}
                sx={{ borderRadius: "10px", py: 1.4 }}
              >
                Login as Student
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<CastForEducationIcon />}
                onClick={() => {
                  navigate("/tutor/login");
                  handleDrawerToggle();
                }}
                sx={{ borderRadius: "10px", py: 1.4 }}
              >
                Login as Tutor
              </Button>

              <Divider sx={{ my: 1 }} />

              <Typography fontWeight={600} color="text.secondary">
                Register
              </Typography>

              <Button
                fullWidth
                variant="contained"
                startIcon={<SchoolIcon />}
                onClick={() => {
                  navigate("/register");
                  handleDrawerToggle();
                }}
                sx={{
                  borderRadius: "10px",
                  py: 1.4,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                }}
              >
                Register as Student
              </Button>

              <Button
                fullWidth
                variant="contained"
                startIcon={<CastForEducationIcon />}
                onClick={() => {
                  navigate("/tutor/register");
                  handleDrawerToggle();
                }}
                sx={{
                  borderRadius: "10px",
                  py: 1.4,
                  background: `linear-gradient(135deg, ${theme.palette.secondary.main} 0%, ${theme.palette.primary.main} 100%)`,
                }}
              >
                Register as Tutor
              </Button>

            </Box>
          )}
        </Box>
      </Drawer>
    </>
  );
}