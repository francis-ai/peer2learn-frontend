import { useState, useEffect, useCallback } from 'react';
import {
  Box, Button, Card, CardContent, Typography, Grid, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Menu, MenuItem, ListItemIcon, Divider, Chip, Snackbar, Alert, 
  FormControl, InputLabel, Select, Paper, Stack,
  useTheme, useMediaQuery
} from '@mui/material';
import {
  MoreVert as MoreIcon, Edit as EditIcon,
  Delete as DeleteIcon, Schedule as ScheduleIcon, 
  Error as ErrorIcon, 
  CheckCircle as CheckIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { useTutorAuth } from '../../context/tutorAuthContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;
const CATEGORIES = ['Tech', 'Academics', 'Language'];

// Terms and Conditions content
const TERMS_CONTENT = `
Peer2Learn – Terms and Conditions

Note:  50% discount applies to all courses offered online across the platform. Tutors are advised to set their base prices accordingly.

Contact Us
For questions or support, contact us at support@peer2learn.com
`;

export default function MyCourses() {
  const { tutor } = useTutorAuth();
  const tutorId = tutor?.id;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [courses, setCourses] = useState([]);
  const [allCourseTitles, setAllCourseTitles] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');

  // Modal states
  const [openCourseModal, setOpenCourseModal] = useState(false);
  const [openAddCourseModal, setOpenAddCourseModal] = useState(false);
  const [openTermsModal, setOpenTermsModal] = useState(false);
  
  const [currentCourse, setCurrentCourse] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCourseId, setSelectedCourseId] = useState(null);

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  console.log(isMobile);
  // Form state
  const [formData, setFormData] = useState({
    course_id: '',
    course_name: '',
    category: '',
    description: '',
    price: '',
    duration: ''
  });

  // Form validation
  const [errors, setErrors] = useState({});

  // Fetch tutor's courses
  const fetchCourses = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/tutors/my-courses/${tutorId}`);
      setCourses(res.data || []);
    } catch (err) {
      console.error(err);
    }
  }, [tutorId]);

  // Fetch courses for a category
  const fetchCourseTitles = useCallback(async (category) => {
    if (!category) return;
    try {
      const res = await axios.get(`${BASE_URL}/api/tutors/courses/category/${category}`);
      setAllCourseTitles(res.data || []);
    } catch (err) {
      console.error(err);
      setAllCourseTitles([]);
    }
  }, []);

  useEffect(() => {
    if (tutorId) fetchCourses();
  }, [tutorId, fetchCourses]);

  // Form validation
  const validateForm = () => {
    const newErrors = {};
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.course_id) newErrors.course_id = 'Course selection is required';
    if (!formData.description?.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.duration?.trim()) newErrors.duration = 'Duration is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Open modal (for add or edit)
  const handleOpenModal = (course = null) => {
    setCurrentCourse(course);
    if (course) {
      setFormData({
        course_id: course.course_id || '',
        course_name: course.name || '',
        category: course.category || '',
        description: course.course_description || '',
        price: course.price || '',
        duration: course.duration || ''
      });
      setSelectedCategory(course.category || '');
      if (course.category) fetchCourseTitles(course.category);
    } else {
      setFormData({ course_id: '', course_name: '', category: '', description: '', price: '', duration: '' });
      setSelectedCategory('');
      setAllCourseTitles([]);
    }
    setErrors({});
    setOpenCourseModal(true);
  };

  const handleCloseModal = () => {
    setOpenCourseModal(false);
    setCurrentCourse(null);
    setFormData({ course_id: '', course_name: '', category: '', description: '', price: '', duration: '' });
    setSelectedCategory('');
    setAllCourseTitles([]);
    setErrors({});
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSnackbar({ open: true, message: 'Please fix the errors before submitting', severity: 'error' });
      return;
    }

    // For new courses, show terms modal. For edits, submit directly.
    if (!currentCourse) {
      setOpenTermsModal(true);
    } else {
      await submitCourse();
    }
  };

  // Actual course submission
  const submitCourse = async () => {
    try {
      const payload = {
        tutor_id: tutorId,
        category: formData.category,
        course_id: formData.course_id,
        course_description: formData.description,
        price: parseFloat(formData.price),
        duration: formData.duration,
      };

      if (currentCourse) {
        await axios.put(`${BASE_URL}/api/tutors/update-course/${currentCourse.id}`, payload);
        setSnackbar({ open: true, message: 'Course updated successfully', severity: 'success' });
      } else {
        await axios.post(`${BASE_URL}/api/tutors/submit-course`, payload);
        setSnackbar({ open: true, message: 'Course created successfully', severity: 'success' });
      }

      await fetchCourses();
      handleCloseModal();
      setOpenTermsModal(false);
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Submission failed';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    }
  };

  // Menu handlers
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
      console.error(err);
      setSnackbar({ open: true, message: 'Error deleting course', severity: 'error' });
    }
    handleMenuClose();
  };

  // Add New Course modal handlers
  const openAddCourse = (categoryForNew = '') => {
    setFormData(prev => ({ ...prev, category: categoryForNew || selectedCategory }));
    setOpenAddCourseModal(true);
  };

  const handleSaveNewCourse = async () => {
    const name = formData.course_name?.trim();
    const category = formData.category;

    if (!name) {
      setSnackbar({ open: true, message: 'Please enter a course name', severity: 'warning' });
      return;
    }
    if (!category) {
      setSnackbar({ open: true, message: 'Please select a category', severity: 'warning' });
      return;
    }

    try {
      const res = await axios.post(`${BASE_URL}/api/view/courses`, { name, category });
      const created = res.data || {};
      const newId = created.id || created.insertId || created.courseId || created.course_id || created.data?.id;

      await fetchCourseTitles(category);
      
      setFormData(prev => ({
        ...prev,
        course_id: newId || '',
        course_name: name,
      }));
      setSelectedCategory(category);

      setOpenAddCourseModal(false);
      setSnackbar({ open: true, message: 'New course added!', severity: 'success' });
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || 'Error adding course';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    }
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom 
        sx={{ 
          color: '#000',
        }}>
          My Courses
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
          Manage your courses and create new offerings for students
        </Typography>

        <Button 
          variant="contained" 
          size="large"
          color="primary"
          onClick={() => handleOpenModal()}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5
          }}
        >
          Add New Course
        </Button>
      </Box>

      {/* Course Cards Grid */}
      {courses.length === 0 ? (
        <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No Courses Yet
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Start by creating your first course to help students learn
          </Typography>
          <Button variant="contained" onClick={() => handleOpenModal()}>
            Create Your First Course
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          {courses.map((course) => (
            <Grid item xs={12} sm={6} md={4} key={course.id}>
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                borderRadius: 3,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                }
              }}>
                <CardContent sx={{ flexGrow: 1, p: 3 }}>
                  {/* Card Header */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {course.name}
                      </Typography>

                      <Typography variant="body2" color="text.secondary" sx={{ mb: 3, lineHeight: 1.6 }}>
                        {course.course_description}
                      </Typography>
                    </Box>
                    <IconButton 
                      size="small" 
                      onClick={(e) => handleMenuOpen(e, course.id)}
                      sx={{ mt: -0.5 }}
                    >
                      <MoreIcon />
                    </IconButton>
                  </Box>

                  {/* Chips */}
                  <Stack direction="row" flexWrap="wrap" gap={1}>
                    <Chip 
                      label={`₦${course.price}`} 
                      variant="outlined" 
                      size="small" 
                    />
                    <Chip 
                      icon={<ScheduleIcon />} 
                      label={course.duration} 
                      variant="outlined" 
                      size="small" 
                    />
                    {course.status === 'flagged' && (
                      <Chip icon={<ErrorIcon />} label="Flagged" color="error" size="small" />
                    )}
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {/* Main Course Modal */}
      <Dialog 
        open={openCourseModal} 
        onClose={handleCloseModal} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          <Typography variant="h5" fontWeight="bold">
            {currentCourse ? 'Edit Course' : 'Create New Course'}
          </Typography>
        </DialogTitle>

        <Box component="form" onSubmit={handleSubmit}>
          <DialogContent dividers sx={{ p: 4 }}>
            <Stack spacing={3} sx={{ maxWidth: 400, mx: 'auto' }}>
              {/* Category */}
              <FormControl fullWidth error={!!errors.category}>
                <InputLabel>Category</InputLabel>
                <Select
                  value={formData.category}
                  label="Category"
                  onChange={(e) => {
                    const selected = e.target.value;
                    setFormData(prev => ({ ...prev, category: selected, course_id: '' }));
                    setSelectedCategory(selected);
                    fetchCourseTitles(selected);
                  }}
                >
                  <MenuItem value="" disabled>Select Category</MenuItem>
                  {CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
                </Select>
                {errors.category && <Typography variant="caption" color="error">{errors.category}</Typography>}
              </FormControl>

              {/* Course Selection */}
              <FormControl fullWidth error={!!errors.course_id} disabled={!selectedCategory}>
                <InputLabel>Course</InputLabel>
                <Select
                  value={formData.course_id}
                  label="Course"
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === 'add_new') {
                      openAddCourse(selectedCategory);
                      return;
                    }
                    const selected = allCourseTitles.find(c => String(c.id) === String(val));
                    setFormData(prev => ({
                      ...prev,
                      course_id: selected?.id || '',
                      course_name: selected?.name || '',
                    }));
                  }}
                >
                  <MenuItem value="" disabled>
                    {selectedCategory ? 'Select Course' : 'Select category first'}
                  </MenuItem>
                  {allCourseTitles.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>
                  ))}
                  <MenuItem value="add_new" sx={{ fontStyle: 'italic', color: 'primary.main' }}>
                    + Add New Course
                  </MenuItem>
                </Select>
                {errors.course_id && <Typography variant="caption" color="error">{errors.course_id}</Typography>}
              </FormControl>

              {/* Description */}
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Course Description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                error={!!errors.description}
                helperText={errors.description}
              />

              {/* Price and Duration */}
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Price (₦)"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  error={!!errors.price}
                  helperText={errors.price}
                />
                <TextField
                  fullWidth
                  label="Duration"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                  error={!!errors.duration}
                  helperText={errors.duration}
                  InputProps={{ 
                    startAdornment: <ScheduleIcon sx={{ mr: 1, color: 'text.secondary' }} />
                  }}
                />
              </Stack>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ p: 3, gap: 1 }}>
            <Button onClick={handleCloseModal} size="large">
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant="contained" 
              size="large"
              sx={{ minWidth: 120 }}
            >
              {currentCourse ? 'Update' : 'Continue'}
            </Button>
          </DialogActions>
        </Box>
      </Dialog>

      {/* Add Course Modal */}
      <Dialog 
        open={openAddCourseModal} 
        onClose={() => setOpenAddCourseModal(false)}
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ textAlign: 'center', py: 3 }}>
          <Typography variant="h5" fontWeight="bold">
            Add New Course
          </Typography>
        </DialogTitle>
        <DialogContent sx={{ p: 4 }}>
          <Stack spacing={3} sx={{ maxWidth: 400 }}>
            <TextField
              fullWidth
              autoFocus
              label="Course Name"
              value={formData.course_name}
              onChange={(e) => setFormData(prev => ({ ...prev, course_name: e.target.value }))}
            />
            <FormControl fullWidth>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                label="Category"
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              >
                {CATEGORIES.map(cat => <MenuItem key={cat} value={cat}>{cat}</MenuItem>)}
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setOpenAddCourseModal(false)}>Cancel</Button>
          <Button onClick={handleSaveNewCourse} variant="contained">
            Save Course
          </Button>
        </DialogActions>
      </Dialog>

      {/* Terms and Conditions Modal */}
      <Dialog 
        open={openTermsModal} 
        onClose={() => setOpenTermsModal(false)}
        maxWidth="md"
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          textAlign: 'center',
          py: 3
        }}>
          <Typography variant="h5" fontWeight="bold">
            Terms & Conditions
          </Typography>
        </DialogTitle>
        <DialogContent dividers sx={{ p: 4, maxHeight: 400, overflow: 'auto' }}>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line', lineHeight: 1.8 }}>
            {TERMS_CONTENT}
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button onClick={() => setOpenTermsModal(false)} size="large">
            Cancel
          </Button>
          <Button 
            onClick={submitCourse} 
            variant="contained" 
            size="large"
            startIcon={<CheckIcon />}
            sx={{ minWidth: 180 }}
          >
            I Agree & Create Course
          </Button>
        </DialogActions>
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
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} variant="filled" sx={{ borderRadius: 2 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}