import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Paper,
  CircularProgress,
  Box,
  Typography,
  Avatar,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { alpha, useTheme } from "@mui/material/styles";
import { useAuth } from "../context/studentAuthContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function TutorDetails() {
  const { student } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const theme = useTheme();

  const [tutor, setTutor] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    const fetchTutor = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/landing-tutors/${id}`);
        setTutor(res.data);
      } catch (err) {
        console.error("Fetch tutor error:", err);
      }
    };

    fetchTutor();
  }, [id]);

  const handleApply = (e) => {
    if (!student) {
      e.preventDefault();
      setSnackbar({
        open: true,
        message: "Please login to apply for courses.",
        severity: "warning",
      });

      setTimeout(() => navigate("/login"), 1500);
    }
  };

  // Loading Screen
  if (!tutor)
    return (
      <Paper
        elevation={0}
        sx={{
          minHeight: "60vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          p: 4,
        }}
      >
        <CircularProgress size={50} sx={{ mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          Loading tutor details...
        </Typography>
      </Paper>
    );

  return (
    <>
      <Box sx={{ p: { xs: 2, md: 6 }, mt: 8, maxWidth: "1000px", mx: "auto" }}>
        {/* Tutor Info Card */}
        <Paper
          elevation={2}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 4,
            mb: 5,
            backgroundColor: "#fff",
          }}
        >
          {/* Avatar */}
          <Avatar
            src={
              tutor.profile_img
                ? `${BASE_URL}/uploads/tutors/${tutor.profile_img}`
                : "/images/default-avatar.png"
            }
            sx={{
              width: 120,
              height: 120,
              mx: "auto",
              mb: 3,
              boxShadow: 3,
              border: "4px solid",
              borderColor: alpha(theme.palette.primary.main, 0.4),
            }}
          />

          {/* Tutor Name */}
          <Typography variant="h4" fontWeight={700} align="center" sx={{ mb: 1 }}>
            {tutor.tutor_name}
          </Typography>

          {/* Course Name */}
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 3 }}
          >
            Course: {tutor.name}
          </Typography>

          {/* Description */}
          <Typography
            variant="body1"
            sx={{ mb: 4, textAlign: "center", lineHeight: 1.7 }}
          >
            {tutor.course_description}
          </Typography>

          {/* Price */}
          <Box
            sx={{
              textAlign: "center",
              mb: 3,
              fontSize: "1.4rem",
              fontWeight: 700,
              color: theme.palette.primary.main,
            }}
          >
            Price: ₦{Number(tutor.price).toLocaleString()}
          </Box>

          {/* Enroll Button */}
          <Box textAlign="center">
            <Button
              variant="contained"
              component={Link}
              to={`/enroll/${id}`}
              onClick={handleApply}
              size="large"
              sx={{
                px: 5,
                py: 1.4,
                borderRadius: 3,
                textTransform: "none",
                fontWeight: 600,
                fontSize: "1rem",
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }}
            >
              Enroll in this Course
            </Button>
          </Box>
        </Paper>

        {/* HOW TO APPLY SECTION */}
        <Paper
          elevation={1}
          sx={{
            p: { xs: 3, md: 4 },
            borderRadius: 4,
            backgroundColor: "#f8fafc",
          }}
        >
          <Typography variant="h5" fontWeight={700} sx={{ mb: 2 }}>
            How to Apply for This Course
          </Typography>

          <Typography sx={{ mb: 3, color: "text.secondary" }}>
            Follow these simple steps to start your learning journey:
          </Typography>

          <List>
            {[
              "Click the Enroll button above.",
              "Login or create an account if you don't have one.",
              "From the Enroll page, select the category and course you want to apply for",
              "Select Mode of lecture (Onsite/Online)",
              "select preferred tutor based on reviews and amount charged",
              "Make payment using any available payment method.",
              "You will receive confirmation and learning materials immediately.",
            ].map((step, index) => (
              <ListItem key={index}>
                <ListItemIcon>
                  <CheckCircleIcon color="primary" />
                </ListItemIcon>
                <ListItemText primary={step} />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
}
