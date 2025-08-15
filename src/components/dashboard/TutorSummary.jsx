import {
  Card,
  CardContent,
  Box,
  Typography,
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Rating,
  Snackbar,
  Alert
} from '@mui/material';
import { School } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const TutorSummary = ({ student }) => {
  const theme = useTheme();
  const [tutors, setTutors] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTutor, setSelectedTutor] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [loading, setLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    severity: 'success',
    message: ''
  });

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/students/my-tutors/${student.id}`);
        setTutors(res.data);
      } catch (err) {
        console.error('Failed to fetch tutors:', err);
        setSnackbar({
          open: true,
          severity: 'error',
          message: 'Failed to fetch tutors.'
        });
      }
    };

    if (student?.id) {
      fetchTutors();
    }
  }, [student]);

  const handleOpenModal = (tutor) => {
    setSelectedTutor(tutor);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedTutor(null);
    setRating(0);
    setReview('');
  };

  const handleSnackbarClose = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleSubmitReview = async () => {
  if (!rating || !selectedTutor) return;

  const payload = {
    tutor_id: selectedTutor.tutor_id,
    student_id: student.id,
    enrollment_id: selectedTutor.enrollment_id,
    rating,
    review
  };

  console.log("Submitting review payload:", payload); // 🐞 Debug payload

  try {
    setLoading(true);
    await axios.post(`${BASE_URL}/api/students/tutor-review`, payload);

    setSnackbar({
      open: true,
      severity: 'success',
      message: 'Review submitted successfully!'
    });

    handleClose();
  } catch (err) {
    console.error('Failed to submit review:', err); // 🐞 Catch axios error
    setSnackbar({
      open: true,
      severity: 'error',
      message: 'Failed to submit review. Try again later.'
    });
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      {tutors.map((tutor) => (
        <Card key={tutor.tutor_id} sx={{ mb: 4 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <School sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                Your Tutor
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Avatar
                src={`${BASE_URL}/uploads/tutors/${tutor.avatar}`}
                sx={{
                  width: 56,
                  height: 56,
                  mr: 2,
                  border: `2px solid ${theme.palette.primary.main}`
                }}
              />
              <Box>
                <Typography sx={{ fontWeight: 600 }}>{tutor.tutor_name}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {tutor.course_name}
                </Typography>
              </Box>
            </Box>
            <Button variant="text" fullWidth onClick={() => handleOpenModal(tutor)}>
              Rate Tutor
            </Button>
          </CardContent>
        </Card>
      ))}

      {/* Rating Modal */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>Review for: {selectedTutor?.tutor_name}</DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
            <Rating
              value={rating}
              onChange={(e, newValue) => setRating(newValue)}
              size="large"
            />
            <TextField
              label="Write a review (optional)"
              multiline
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="How was your learning experience?"
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmitReview} disabled={loading || !rating}>
            {loading ? 'Submitting...' : 'Submit Review'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default TutorSummary;
