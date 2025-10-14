import React, { useState, useEffect } from "react";
import { useCohubAuth } from "../../context/cohubAuthContext";
import {
  FormControlLabel,
  Switch,
  Snackbar,
  Alert,
  Typography,
  Grid,
  Card,
  CardMedia,
} from "@mui/material";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Dashboard = () => {
  const { cohub, setCohub } = useCohubAuth();
  const [isAvailable, setIsAvailable] = useState(cohub?.is_available || 0);
  const [officeImages, setOfficeImages] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ✅ Fetch office images
  useEffect(() => {
    if (!cohub?.id) return;

    const fetchOfficeImages = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/cohub/cohub-office-image/${cohub.id}`
        );

        if (res.data?.office_images) {
          // Ensure we store it as an array
          const parsed =
            typeof res.data.office_images === "string"
              ? JSON.parse(res.data.office_images)
              : res.data.office_images;

          setOfficeImages(Array.isArray(parsed) ? parsed : []);
        } else {
          setOfficeImages([]);
        }
      } catch (error) {
        console.error("Failed to fetch office images:", error);
        setOfficeImages([]);
      }
    };

    fetchOfficeImages();
  }, [cohub?.id]);

  // ✅ Toggle availability
  const handleToggle = async (event) => {
    const newValue = event.target.checked ? 1 : 0;
    setIsAvailable(newValue);

    try {
      await axios.put(`${BASE_URL}/api/cohub/update-availability/${cohub.id}`, {
        is_available: newValue,
      });

      setCohub({ ...cohub, is_available: newValue });

      setSnackbar({
        open: true,
        message: "Availability updated!",
        severity: "success",
      });
    } catch (error) {
      console.error(error);
      setSnackbar({
        open: true,
        message: "Failed to update availability",
        severity: "error",
      });
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        Welcome, {cohub?.name || "Cohub User"} 👋
      </Typography>
      <Typography variant="body1" gutterBottom>
        Email: {cohub?.email || "Not available"}
      </Typography>

      {/* ✅ Availability Toggle */}
      <FormControlLabel
        control={
          <Switch checked={isAvailable === 1} onChange={handleToggle} color="primary" />
        }
        label={isAvailable === 1 ? "Available" : "Not Available"}
      />

      {/* ✅ Display Office Images in Cards */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
        Office Images
      </Typography>

      {officeImages.length > 0 ? (
        <Grid container spacing={2}>
          {officeImages.map((img, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  borderRadius: 2,
                  boxShadow: 3,
                  overflow: "hidden",
                  transition: "0.3s",
                  "&:hover": { transform: "scale(1.03)" },
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={`${BASE_URL}/uploads/cohub/${img}`}
                  alt={`Office Image ${index + 1}`}
                />
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 3 }}>
          No office images uploaded.
        </Typography>
      )}

      {/* ✅ Snackbar Alert */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default Dashboard;
