import { useState, useEffect, useCallback } from 'react';
import {
  Box, Button, Card, CardContent, Typography, Grid, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Menu, MenuItem, ListItemIcon, Divider, Chip, Snackbar, Alert, Select, InputLabel, FormControl
} from '@mui/material';
import {
  Add as AddIcon, MoreVert as MoreIcon, Edit as EditIcon,
  Delete as DeleteIcon, Schedule as ScheduleIcon, Error as ErrorIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useTutorAuth } from '../../context/tutorAuthContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;


export default function MyCourses() {
  const { tutor } = useTutorAuth();
  const tutorId = tutor?.id;
  const [courses, setCourses] = useState([]);
  const [allCourseTitles, setAllCourseTitles] = useState([]);

  const [openModal, setOpenModal] = useState(false);
  const [currentCourse, setCurrentCourse] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const fetchCourses = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/tutors/my-courses/${tutorId}`);
      setCourses(res.data);
    } catch (err) {
      console.error(err);
    }
  }, [tutorId]);

  const fetchCourseTitles = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/view/courses`);
      setAllCourseTitles(res.data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
    fetchCourseTitles();
  }, [fetchCourses, fetchCourseTitles]);
  


  const handleOpenModal = (course = null) => {
    setCurrentCourse(course);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCurrentCourse(null);
  };

  const handleMenuOpen = (event, courseId) => {
    setAnchorEl(event.currentTarget);
    setSelectedCourseId(courseId);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedCourseId(null);
  };

  const handleEdit = () => {
    const courseToEdit = courses.find(c => c.id === selectedCourseId);
    handleOpenModal(courseToEdit);
    handleMenuClose();
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${BASE_URL}/api/tutors/delete-course/${selectedCourseId}`);
      setSnackbar({ open: true, message: 'Course deleted successfully', severity: 'success' });
      fetchCourses();
    } catch (err) {
      setSnackbar({ open: true, message: 'Error deleting course', severity: 'error' });
    }
    handleMenuClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const courseData = {
      tutor_id: tutorId,
      course_id: formData.get('course_id'),
      course_description: formData.get('description'),
      price: parseFloat(formData.get('price')),
      duration: formData.get('duration')
    };

    try {
      if (currentCourse) {
        await axios.put(`${BASE_URL}/api/tutors/update-course/${currentCourse.id}`, courseData);
        setSnackbar({ open: true, message: 'Course updated successfully', severity: 'success' });
      } else {
        await axios.post(`${BASE_URL}/api/tutors/submit-course`, courseData);
        setSnackbar({ open: true, message: 'Course submitted successfully', severity: 'success' });
      }
      fetchCourses();
      handleCloseModal();
    } catch (err) {
      console.error(err);
      setSnackbar({ open: true, message: 'Submission failed', severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">My Courses</Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={() => handleOpenModal()}>
          Add New Course
        </Button>
      </Box>

      <Grid container spacing={3}>
        {courses.map((course) => (
          <Grid item xs={12} sm={6} md={4} key={course.id}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="h6" fontWeight="bold">{course.name}</Typography>
                  <IconButton size="small" onClick={(e) => handleMenuOpen(e, course.id)}>
                    <MoreIcon />
                  </IconButton>
                </Box>

                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {course.course_description}
                </Typography>

                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip label={`₦ ${course.price}`} size="small" />
                  <Chip icon={<ScheduleIcon fontSize="small" />} label={course.duration} size="small" />
                  {course.status === 'flagged' && (
                    <Chip
                      icon={<ErrorIcon />}
                      label="Flagged"
                      color="error"
                      size="small"
                      sx={{ textTransform: 'capitalize' }}
                    />
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Course Modal */}
      <Dialog open={openModal} onClose={handleCloseModal} maxWidth="sm" fullWidth>
        <DialogTitle>{currentCourse ? 'Edit Course' : 'Add New Course'}</DialogTitle>
        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent dividers>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <FormControl fullWidth margin="normal">
                  <InputLabel required>Course Title</InputLabel>
                  <Select
                    name="course_id"
                    defaultValue={currentCourse?.course_id || ''}
                    required
                    disabled={!!currentCourse}
                  >
                    {allCourseTitles.map(course => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  multiline
                  rows={3}
                  name="description"
                  label="Description"
                  defaultValue={currentCourse?.course_description || ''}
                  margin="normal"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  type="number"
                  name="price"
                  label="Price (₦)"
                  defaultValue={currentCourse?.price || ''}
                  margin="normal"
                  inputProps={{ step: "0.01" }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  required
                  name="duration"
                  label="Duration"
                  defaultValue={currentCourse?.duration || ''}
                  margin="normal"
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseModal}>Cancel</Button>
            <Button type="submit" variant="contained">
              {currentCourse ? 'Update Course' : 'Create Course'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Options Menu */}
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
        <MenuItem onClick={handleEdit}>
          <ListItemIcon><EditIcon fontSize="small" /></ListItemIcon>Edit
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleDelete}>
          <ListItemIcon><DeleteIcon fontSize="small" color="error" /></ListItemIcon>
          <Typography color="error">Delete</Typography>
        </MenuItem>
      </Menu>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
