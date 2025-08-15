import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Table,
  TableHead,
  TableBody,
  TableCell,
  TableRow,
  TableContainer,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Rating
} from '@mui/material';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/studentAuthContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Schedule = () => {
  const { student } = useAuth();
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openModal, setOpenModal] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState(null);

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchSchedules = useCallback(async () => {
    if (!student?.id) return;

    try {
      const res = await axios.get(`${BASE_URL}/api/students/class-schedules/${student.id}`);
      setSchedules(res.data);
    } catch (err) {
      console.error('Error fetching schedules:', err);
    } finally {
      setLoading(false);
    }
  }, [student?.id]);

  useEffect(() => {
    fetchSchedules();
  }, [fetchSchedules]);

  const handleOpenModal = (schedule) => {
    setSelectedSchedule(schedule);
    setRating(0);
    setReview('');
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSchedule(null);
  };

  const handleSubmitFeedback = async () => {
    if (!rating || !selectedSchedule) return;

    setSubmitting(true);

    try {
      // 1. Mark as completed
      await axios.put(`${BASE_URL}/api/students/mark-completed/${selectedSchedule.schedule_id}`);

      // 2. Submit feedback
      await axios.post(`${BASE_URL}/api/students/class-feedback`, {
        schedule_id: selectedSchedule.schedule_id,
        student_id: student.id,
        rating,
        review
      });

      // 3. Update UI
      setSchedules((prev) =>
        prev.map((s) =>
          s.schedule_id === selectedSchedule.schedule_id
            ? { ...s, student_completed: 1 }
            : s
        )
      );

      handleCloseModal();
    } catch (err) {
      console.error('Error submitting feedback:', err);
      alert('Failed to submit feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ p: 3, mt: 12, maxWidth: { md: '80%', xs: '100%' }, mx: 'auto' }}>
      <Box
        mb={2}
        color="primary.main"
        component={Link}
        to="/dashboard"
        sx={{ textDecoration: 'none', display: 'inline-block' }}
      >
        ← Back to Dashboard
      </Box>

      <Typography variant="h5" fontWeight="bold" gutterBottom>
        My Class Schedule
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
                <TableCell>Course</TableCell>
                <TableCell>Tutor</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Time</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {schedules.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    No schedules found.
                  </TableCell>
                </TableRow>
              ) : (
                schedules.map((s) => (
                  <TableRow key={s.schedule_id}>
                    <TableCell>{s.course_title}</TableCell>
                    <TableCell>{s.tutor_name}</TableCell>
                    <TableCell>{s.date}</TableCell>
                    <TableCell>{s.time}</TableCell>
                    <TableCell>
                      {s.student_completed ? (
                        <Button size="small" variant="outlined" disabled>
                          Completed
                        </Button>
                      ) : (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => handleOpenModal(s)}
                        >
                          Mark as Completed
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Feedback Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} fullWidth maxWidth="sm">
        <DialogTitle>Class Feedback</DialogTitle>
        <DialogContent sx={{ mt: 1 }}>
          <Typography gutterBottom>
            Please rate and give a short feedback about this class.
          </Typography>

          <Box sx={{ my: 2 }}>
            <Rating
              value={rating}
              onChange={(e, newVal) => setRating(newVal)}
              size="large"
            />
          </Box>

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Review (optional)"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            variant="outlined"
          />
        </DialogContent>

        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={handleCloseModal} disabled={submitting}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmitFeedback}
            disabled={!rating || submitting}
          >
            {submitting ? 'Submitting...' : 'Submit'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Schedule;
