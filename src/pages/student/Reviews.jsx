import {
  Box,
  Card,
  CardContent,
  Typography,
  Avatar,
  IconButton,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  Stack
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { useAuth } from '../../context/studentAuthContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Reviews = () => {
  const { student } = useAuth();
  const theme = useTheme();

  const [reviews, setReviews] = useState([]);
  const [selectedReview, setSelectedReview] = useState(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchStudentReviews = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/students/my-reviews/${student.id}`);
        setReviews(res.data);
      } catch (err) {
        console.error('Failed to fetch reviews:', err);
      }
    };

    if (student?.id) {
      fetchStudentReviews();
    }
  }, [student]);

  const handleOpen = (review) => {
    setSelectedReview(review);
    setRating(review.rating || 0);
    setReviewText(review.review || '');
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedReview(null);
    setRating(0);
    setReviewText('');
  };

 const handleUpdateReview = async () => {
  if (!selectedReview || !rating) return;

  // Try to get tutor_id from selectedReview, or fallback from reviews list
  const tutor_id =
    selectedReview.tutor_id ||
    (reviews.find((r) => r.enrollment_id === selectedReview.enrollment_id)?.tutor_id ?? null);

  if (!tutor_id) {
    console.error('Tutor ID not found. Cannot update review.');
    setSnackbar({ open: true, severity: 'error', message: 'Tutor ID missing. Update failed.' });
    return;
  }

  const payload = {
    tutor_id,
    student_id: student.id,
    enrollment_id: selectedReview.enrollment_id,
    rating,
    review: reviewText
  };

  // 🔍 Debug: Log everything before submission
  console.log("Attempting to update review with payload:", payload);
  console.log("Selected Review:", selectedReview);
  console.log("Student:", student);

  try {
    setLoading(true);
    await axios.post(`${BASE_URL}/api/students/tutor-review`, payload);
    setSnackbar({ open: true, severity: 'success', message: 'Review updated successfully!' });

    // Update locally
    const updated = reviews.map((r) =>
      r.enrollment_id === selectedReview.enrollment_id
        ? { ...r, rating, review: reviewText }
        : r
    );
    setReviews(updated);
    handleClose();
  } catch (err) {
    console.error('Update failed:', err);
    setSnackbar({ open: true, severity: 'error', message: 'Failed to update review.' });
  } finally {
    setLoading(false);
  }
};



  return (
    <Box sx={{ p: 3, mt: 10, maxWidth: '800px', mx: 'auto' }}>
      <Typography variant="h5" fontWeight={600} gutterBottom>
        My Reviews
      </Typography>

      {reviews.length === 0 ? (
        <Typography>No reviews submitted yet.</Typography>
      ) : (
        reviews.map((review) => (
          <Card key={review.enrollment_id} sx={{ mb: 3 }}>
            <CardContent>
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar
                  src={`${BASE_URL}/uploads/tutors/${review.tutor_avatar}`}
                  sx={{
                    width: 56,
                    height: 56,
                    border: `2px solid ${theme.palette.primary.main}`
                  }}
                />
                <Box sx={{ flex: 1 }}>
                  <Typography fontWeight={600}>{review.tutor_name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {review.course_name}
                  </Typography>
                </Box>
                <IconButton onClick={() => handleOpen(review)}>
                  <EditIcon />
                </IconButton>
              </Stack>

              <Box sx={{ mt: 2 }}>
                <Rating value={review.rating} readOnly />
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {review.review || <em>No written feedback.</em>}
                </Typography>
              </Box>
            </CardContent>
          </Card>
        ))
      )}

      {/* Edit Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit Review</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Rating
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              size="large"
            />
            <TextField
              multiline
              rows={4}
              label="Your Review"
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              fullWidth
              placeholder="Update your review..."
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleUpdateReview} disabled={loading || !rating} variant="contained">
            {loading ? 'Updating...' : 'Update Review'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Reviews;
