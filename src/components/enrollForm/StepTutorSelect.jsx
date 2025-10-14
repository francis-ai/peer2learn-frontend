// components/EnrollForm/StepTutorSelect.jsx
import {
  Box,
  Typography,
  Grid,
  Card,
  Avatar,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Tooltip,
} from "@mui/material";
import { CheckCircle, Star, RateReview } from "@mui/icons-material";
import { useState } from "react";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function StepTutorSelect({ tutors, formData, onSelectTutor }) {
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedTutorReviews, setSelectedTutorReviews] = useState([]);
  const [reviewTutorName, setReviewTutorName] = useState("");

  const openReviews = (tutor) => {
    setSelectedTutorReviews(tutor.reviews || []);
    setReviewTutorName(tutor.tutor_name || "Tutor");
    setReviewModalOpen(true);
  };

  const closeReviews = () => {
    setReviewModalOpen(false);
    setSelectedTutorReviews([]);
    setReviewTutorName("");
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h6" gutterBottom textAlign="center">
        Available Tutors
      </Typography>
      <Typography color="text.secondary" textAlign="center">
        {formData.deliveryMethod === "online"
          ? "Tutors available for online sessions (50% discount applied)"
          : "Tutors available for on-site sessions"}
      </Typography>

      <Grid container spacing={2} sx={{ mt: 3 }}>
        {tutors.length === 0 ? (
          <Grid item xs={12}>
            <Typography textAlign="center" color="text.secondary">
              No tutors available for this selection.
            </Typography>
          </Grid>
        ) : (
          tutors.map((item) => {
            const isSelected = formData.selectedTutor === item.tutor_course_id;
            const displayPrice =
              formData.deliveryMethod === "online"
                ? `${parseInt(item.price / 2, 10).toLocaleString()} (50% off)`
                : parseInt(item.price, 10).toLocaleString();

            return (
              <Grid item xs={12} sm={6} md={4} key={item.tutor_course_id}>
                <Card
                  onClick={() =>
                    !item.is_occupied && onSelectTutor(item.tutor_course_id)
                  }
                  sx={{
                    p: 2,
                    cursor: item.is_occupied ? "not-allowed" : "pointer",
                    opacity: item.is_occupied ? 0.6 : 1,
                    border: isSelected
                      ? "2px solid #1976d2"
                      : "1px solid #e0e0e0",
                    borderRadius: 3,
                    boxShadow: isSelected ? 6 : 2,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      boxShadow: 5,
                      transform: "translateY(-4px)",
                    },
                  }}
                >
                  <Box
                    display="flex"
                    flexDirection={{ xs: "column", sm: "row" }}
                    alignItems="center"
                    gap={2}
                  >
                    <Avatar
                      src={
                        item.tutor_image
                          ? `${BASE_URL}/uploads/tutors/${item.tutor_image}`
                          : undefined
                      }
                      sx={{
                        width: 64,
                        height: 64,
                        border: "2px solid #1976d2",
                        bgcolor: item.tutor_image ? "transparent" : "#1976d2",
                        color: "#fff",
                        fontWeight: "bold",
                        fontSize: "1.2rem",
                      }}
                    >
                      {!item.tutor_image && (item.tutor_name?.charAt(0).toUpperCase() || "?")}
                    </Avatar>

                    <Box flex={1} textAlign={{ xs: "center", sm: "left" }}>
                      <Typography fontWeight="bold" fontSize="1rem">
                        {item.tutor_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {item.course_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Duration: {item.duration}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ₦{displayPrice}
                        {formData.deliveryMethod === "online" && (
                          <span
                            style={{
                              textDecoration: "line-through",
                              marginLeft: 4,
                              color: "#999",
                            }}
                          >
                            ₦{parseInt(item.price, 10).toLocaleString()}
                          </span>
                        )}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        📍 {item.location}
                      </Typography>
                    </Box>

                    <Box
                      display="flex"
                      flexDirection="column"
                      alignItems="center"
                      justifyContent="center"
                      gap={1}
                    >
                      {item.is_occupied && (
                        <Chip
                          label="Occupied"
                          color="error"
                          size="small"
                          sx={{ fontSize: "0.7rem" }}
                        />
                      )}

                      <Tooltip title="View Reviews">
                        <IconButton
                          onClick={(e) => {
                            e.stopPropagation();
                            openReviews(item);
                          }}
                        >
                          <RateReview color="action" />
                        </IconButton>
                      </Tooltip>

                      {isSelected && <CheckCircle color="primary" />}
                    </Box>
                  </Box>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      {/* Reviews Modal */}
      <Dialog
        open={reviewModalOpen}
        onClose={closeReviews}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Reviews for {reviewTutorName}</DialogTitle>
        <DialogContent dividers>
          {selectedTutorReviews.length === 0 ? (
            <Typography>No reviews available.</Typography>
          ) : (
            <List>
              {selectedTutorReviews.map((review, idx) => (
                <ListItem key={idx} divider alignItems="flex-start">
                  <ListItemText
                    primary={
                      <>
                        <Star sx={{ color: "#FFD700", fontSize: 18, mr: 0.5 }} />
                        {review.rating} - {review.student_name}
                      </>
                    }
                    secondary={review.review}
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeReviews}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
