// components/EnrollForm/StepDeliveryMethod.jsx
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
} from "@mui/material";
import { Computer, LocationOn } from "@mui/icons-material";
import { motion } from "framer-motion";

export default function StepDeliveryMethod({ formData, setFormData, offices, BASE_URL }) {
  return (
    <Box>
      {/* Step Title */}
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          How would you like to take this course?
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Choose your preferred learning option below
        </Typography>

        {/* Delivery Option Buttons */}
        <Grid container spacing={2} sx={{ mt: 3, justifyContent: "center" }}>
          <Grid item xs={6} sm={4} md={3}>
            <Button
              fullWidth
              variant={formData.deliveryMethod === "online" ? "contained" : "outlined"}
              startIcon={<Computer />}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  deliveryMethod: "online",
                  officeId: "", // clear office selection
                }))
              }
              sx={{
                py: 3,
                fontWeight: "bold",
                borderRadius: 3,
                boxShadow: formData.deliveryMethod === "online" ? 4 : "none",
              }}
            >
              Online
            </Button>
          </Grid>

          <Grid item xs={6} sm={4} md={3}>
            <Button
              fullWidth
              variant={formData.deliveryMethod === "onsite" ? "contained" : "outlined"}
              startIcon={<LocationOn />}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  deliveryMethod: "onsite",
                }))
              }
              sx={{
                py: 3,
                fontWeight: "bold",
                borderRadius: 3,
                boxShadow: formData.deliveryMethod === "onsite" ? 4 : "none",
              }}
            >
              On-Site
            </Button>
          </Grid>
        </Grid>
      </Box>

      {/* On-Site Selection Section */}
      {formData.deliveryMethod === "onsite" && (
        <Box sx={{ mt: 5 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold" textAlign="center">
            Select Your Nearest Cohub Location
          </Typography>
          <Typography variant="body2" color="text.secondary" textAlign="center" mb={3}>
            Tap a location to continue
          </Typography>

          <Grid container spacing={3}>
            {offices.map((cohub) => {
              const isSelected = formData.officeId === cohub.id;
              return (
                <Grid item xs={12} sm={6} md={4} key={cohub.id}>
                  <motion.div
                    whileHover={{ scale: 1.03 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Card
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          officeId: cohub.id,
                        }))
                      }
                      sx={{
                        cursor: "pointer",
                        borderRadius: 3,
                        overflow: "hidden",
                        boxShadow: isSelected ? 6 : 2,
                        border: isSelected ? "2px solid #1976d2" : "1px solid #e0e0e0",
                        transform: isSelected ? "scale(1.02)" : "scale(1)",
                        transition: "all 0.3s ease",
                        backgroundColor: isSelected ? "#e3f2fd" : "#fff",
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="180"
                        image={
                          cohub.office_images?.length
                            ? `${BASE_URL}/uploads/cohub/${cohub.office_images[0]}`
                            : "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=400&fit=crop"
                        }
                        alt={cohub.name}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography
                          variant="h6"
                          fontWeight="bold"
                          sx={{ mb: 0.5, color: "#1976d2" }}
                        >
                          {cohub.office_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {cohub.address}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {cohub.location}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mt: 0.5 }}
                        >
                          📞 {cohub.phone_number}
                        </Typography>
                      </CardContent>
                    </Card>
                  </motion.div>
                </Grid>
              );
            })}
          </Grid>
        </Box>
      )}
    </Box>
  );
}
