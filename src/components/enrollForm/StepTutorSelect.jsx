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
} from "@mui/material";
import { CheckCircle } from "@mui/icons-material";
import { useState } from "react";

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
    <Box>
      <Typography variant="h6" gutterBottom>
        Available Tutors
      </Typography>
      <Typography color="text.secondary" gutterBottom>
        {formData.location === "Online"
          ? "Tutors available for online sessions (50% discount applied)"
          : `Tutors in ${formData.location}`}
      </Typography>

      <Grid container spacing={2} sx={{ mt: 2 }}>
        {tutors.length === 0 ? (
          <Grid item xs={12}>
            <Typography>No tutors available for this selection.</Typography>
          </Grid>
        ) : (
          tutors.map((item) => {
            const isSelected = formData.selectedTutor === item.tutor_course_id;
            const displayPrice =
              formData.deliveryMethod === "online"
                ? `${parseInt(item.price / 2, 10).toLocaleString()} (50% off)`
                : parseInt(item.price, 10).toLocaleString();

            return (
              <Grid item xs={12} key={item.tutor_course_id}>
                <Card
                  variant={isSelected ? "elevation" : "outlined"}
                  elevation={isSelected ? 3 : 0}
                  onClick={() => !item.is_occupied && onSelectTutor(item.tutor_course_id)}
                  sx={{
                    p: 2,
                    cursor: item.is_occupied ? "not-allowed" : "pointer",
                    opacity: item.is_occupied ? 0.6 : 1,
                    borderColor: isSelected ? "primary.main" : "",
                    "&:hover": {
                      borderColor: item.is_occupied ? "" : "primary.main",
                    },
                  }}
                >
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center">
                      <Avatar sx={{ mr: 2 }}>{(item.tutor_name || "?").charAt(0)}</Avatar>
                      <Box>
                        <Typography fontWeight="bold">{item.tutor_name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Course: {item.course_name} • Price: ₦{displayPrice}
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
                          Duration: {item.duration} • Location: {formData.location}
                        </Typography>
                      </Box>
                    </Box>

                    <Box display="flex" flexDirection="column" alignItems="flex-end">
                      {item.is_occupied && (
                        <Chip label="Tutor is Occupied" color="error" size="small" sx={{ mb: 1 }} />
                      )}

                      <Button
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          openReviews(item);
                        }}
                        variant="outlined"
                        sx={{ mb: 1 }}
                      >
                        View Reviews
                      </Button>

                      {isSelected && <CheckCircle color="primary" sx={{ mt: 1 }} />}
                    </Box>
                  </Box>
                </Card>
              </Grid>
            );
          })
        )}
      </Grid>

      {/* Reviews Modal */}
      <Dialog open={reviewModalOpen} onClose={closeReviews} maxWidth="sm" fullWidth>
        <DialogTitle>Reviews for {reviewTutorName}</DialogTitle>
        <DialogContent dividers>
          {(selectedTutorReviews || []).length === 0 ? (
            <Typography>No reviews available.</Typography>
          ) : (
            <List>
              {selectedTutorReviews.map((review, idx) => (
                <ListItem key={idx} alignItems="flex-start" divider>
                  <ListItemText
                    primary={`⭐ ${review.rating} - ${review.student_name}`}
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
