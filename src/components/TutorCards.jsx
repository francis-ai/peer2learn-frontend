import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  Avatar,
  Button,
  CircularProgress,
  // Chip,
  Snackbar,
  Alert,
  Grid,
  Container,
  alpha,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../context/studentAuthContext";
import { School, ArrowForward } from "@mui/icons-material";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function LandingTutors() {
  const { student } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    (async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/landing-tutors`);
        setTutors(res.data || []);
      } catch (err) {
        console.error("❌ Failed to fetch landing tutors:", err);
        setSnackbar({
          open: true,
          message: "Failed to load tutors. Please try again.",
          severity: "error",
        });
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleApply = (e) => {
    if (!student) {
      e.preventDefault();
      setSnackbar({
        open: true,
        message: "Please login to apply for courses.",
        severity: "warning",
      });
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 12 }}>
        <CircularProgress size={60} thickness={4} />
      </Box>
    );

  if (tutors.length === 0)
    return (
      <Box sx={{ textAlign: "center", py: 12 }}>
        <School sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
        <Typography variant="h5" color="text.secondary">
          No featured tutors available yet.
        </Typography>
      </Box>
    );

  return (
    <Container
      maxWidth="xl"
      disableGutters
      sx={{
        py: { xs: 6, md: 10 },
        px: { xs: 2, sm: 4 },
        overflowX: "hidden",
      }}
    >
      {/* Header */}
      <Box textAlign="center" sx={{ mb: 8 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            fontWeight: 700,
            mb: 2,
            color: theme.palette.text.primary,
            [theme.breakpoints.down('sm')]: {
              fontSize: '1.5rem'
            }
          }}
          data-aos="fade-down"
        >
          Meet Our Expert Tutors
        </Typography>
        <Typography variant="subtitle1" color="#64748b">
          Learn from professionals who make education personal and inspiring.
        </Typography>
      </Box>

      {/* Tutor Cards */}
      {isMobile ? (
        <Box
          sx={{
            display: "flex",
            gap: 3,
            overflowX: "auto",
            px: 1,
            pb: 2,
            scrollSnapType: "x mandatory",
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {tutors.slice(0, 6).map((tutor) => (
            <Box key={tutor.id} sx={{ scrollSnapAlign: "start" }}>
              <TutorCard tutor={tutor} handleApply={handleApply} theme={theme} />
            </Box>
          ))}
        </Box>
      ) : (
        <Grid container spacing={4} justifyContent="center">
          {tutors.slice(0, 6).map((tutor) => (
            <Grid item key={tutor.id} xs={12} sm={6} md={4} lg={3}>
              <TutorCard tutor={tutor} handleApply={handleApply} theme={theme} />
            </Grid>
          ))}
        </Grid>
      )}

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{
            width: "100%",
            borderRadius: 3,
            fontWeight: 500,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

// ✅ Redesigned Compact Tutor Card
function TutorCard({ tutor, handleApply, theme }) {
  return (
    <Card
      sx={{
        width: 280,
        mx: "auto",
        borderRadius: 5,
        boxShadow: "0 6px 25px rgba(0,0,0,0.08)",
        textAlign: "center",
        p: 3,
        transition: "all 0.3s ease",
        backgroundColor: "#fff",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 12px 35px rgba(0,0,0,0.12)",
        },
      }}
    >
      <Avatar
        src={
          tutor.profile_img
            ? `${BASE_URL}/uploads/tutors/${tutor.profile_img}`
            : "/images/default-avatar.png"
        }
        alt={tutor.tutor_name}
        sx={{
          width: 90,
          height: 90,
          mx: "auto",
          mb: 2,
          border: "3px solid",
          borderColor: alpha(theme.palette.primary.main, 0.5),
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      />

      <Typography variant="h6" fontWeight={700} sx={{ color: "#1e293b" }}>
        {tutor.tutor_name}
      </Typography>
      <Typography variant="body2" sx={{ color: "#64748b", mb: 1 }}>
        {tutor.category || "General Tutor"}
      </Typography>

      <Typography
        variant="body2"
        sx={{
          color: "#64748b",
          fontSize: "0.9rem",
          minHeight: 45,
        }}
      >
        {tutor.course_description ||
          "Helping you achieve academic excellence with a personalized approach."}
      </Typography>

      {/* <Chip
        label={`₦${Number(tutor.price).toLocaleString()}`}
        sx={{
          mt: 2,
          backgroundColor: alpha(theme.palette.primary.main, 0.08),
          color: theme.palette.primary.main,
          fontWeight: 600,
        }}
      /> */}

      <Button
        variant="contained"
        component={Link}
        to="/enroll"
        onClick={handleApply}
        endIcon={<ArrowForward />}
        fullWidth
        sx={{
          mt: 3,
          py: 1.2,
          borderRadius: 3,
          textTransform: "none",
          fontWeight: 600,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          boxShadow: `0 4px 15px ${alpha(theme.palette.primary.main, 0.25)}`,
          "&:hover": {
            boxShadow: `0 8px 25px ${alpha(theme.palette.primary.main, 0.35)}`,
            transform: "translateY(-2px)",
          },
          transition: "all 0.3s ease",
        }}
      >
        Enroll Now
      </Button>
    </Card>
  );
}
