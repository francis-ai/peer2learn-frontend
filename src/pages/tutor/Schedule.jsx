import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Divider,
  Button,
  Chip,
  Badge,
  Tabs,
  Tab,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert
} from '@mui/material';
import {
  CalendarToday as CalendarIcon,
  Class as ClassIcon,
  Person as PersonIcon,
  AccessTime as AccessTimeIcon,
  Notifications as NotificationIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import axios from 'axios';
import { useTutorAuth } from '../../context/tutorAuthContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Schedule() {
  const { tutor } = useTutorAuth();
  const tutorId = tutor?.id;

  // State management
  const [tabValue, setTabValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]);
  const [formData, setFormData] = useState({
    studentId: '',
    date: '',
    time: ''
  });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [snackbar, setSnackbar] = useState({ 
    open: false, 
    message: '', 
    severity: 'success' 
  });

  // Helper functions
  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Data fetching
  const fetchEnrolledStudents = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/tutors/enrolled-students/${tutorId}`);
      setStudents(res.data);
    } catch (err) {
      console.error('Failed to fetch students:', err);
      showSnackbar('Failed to fetch students', 'error');
    }
  }, [tutorId]);

  const fetchSchedules = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/tutors/schedules/${tutorId}`);
      setAllSchedules(res.data);
    } catch (err) {
      console.error('Failed to fetch schedules:', err);
      showSnackbar('Failed to fetch schedules', 'error');
    }
  }, [tutorId]);

  useEffect(() => {
    if (tutorId) {
      fetchEnrolledStudents();
      fetchSchedules();
    }
  }, [tutorId, fetchEnrolledStudents, fetchSchedules]);

  // Categorize sessions
  const upcoming = allSchedules.filter(session => session.is_completed === 0);
  const completed = allSchedules.filter(session => session.is_completed === 1);

  // Form handling
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({ studentId: '', date: '', time: '' });
    setEditMode(false);
    setEditingScheduleId(null);
  };

  const handleSaveSchedule = async () => {
    const { studentId, date, time } = formData;
    if (!studentId || !date || !time) {
      showSnackbar('Please fill all fields', 'error');
      return;
    }

    const payload = { 
      enrollment_id: studentId, 
      date, 
      time,
      ...(editMode && { id: editingScheduleId })
    };

    try {
      setLoading(true);
      const url = editMode 
        ? `${BASE_URL}/api/tutors/schedule/${editingScheduleId}`
        : `${BASE_URL}/api/tutors/schedule`;
      
      const method = editMode ? 'put' : 'post';
      await axios[method](url, { ...payload, tutor_id: tutorId });

      showSnackbar(
        `Schedule ${editMode ? 'updated' : 'added'} successfully!`
      );
      setOpenModal(false);
      resetForm();
      fetchSchedules();
    } catch (err) {
      console.error('Failed to save schedule:', err);
      showSnackbar('Failed to save schedule', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      await axios.put(`${BASE_URL}/api/tutors/schedule/${id}/complete`);
      showSnackbar('Session marked as completed');
      fetchSchedules();
    } catch (err) {
      console.error('Failed to mark as completed:', err);
      showSnackbar('Failed to mark as completed', 'error');
    }
  };

  // UI Components
  const SessionItem = ({ session, showActions = true }) => (
    <ListItem 
      secondaryAction={showActions && (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            size="small"
            disabled={session.is_completed === 1}
            onClick={() => handleMarkCompleted(session.id)}
            startIcon={<CheckCircleIcon fontSize="small" />}
          >
            Mark Completed
          </Button>
          <Button 
            size="small" 
            onClick={() => {
              setFormData({
                studentId: session.enrollment_id,
                date: session.date,
                time: session.time
              });
              setEditingScheduleId(session.id);
              setEditMode(true);
              setOpenModal(true);
            }}
          >
            Edit
          </Button>
        </Box>
      )}
    >
      <ListItemAvatar>
        <Avatar>{session.student_name.charAt(0)}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={<Typography fontWeight="bold">{session.course_name}</Typography>}
        secondary={
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 0.5 }}>
            <Chip icon={<PersonIcon />} label={session.student_name} size="small" />
            <Chip 
              icon={<CalendarIcon />} 
              label={new Date(session.date).toLocaleDateString()} 
              size="small" 
            />
            <Chip 
              icon={<AccessTimeIcon />} 
              label={session.time} 
              size="small" 
              color={session.is_completed === 0 ? 'primary' : 'default'}
            />
            {session.is_completed === 1 && (
              <Chip 
                icon={<CheckCircleIcon />} 
                label="Completed" 
                color="success" 
                size="small"
              />
            )}
          </Box>
        }
      />
    </ListItem>
  );

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5" fontWeight="bold">
          My Schedule
        </Typography>
        <Button variant="contained" onClick={() => setOpenModal(true)}>
          Add Schedule
        </Button>
      </Box>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
          <Tab label={
            <Badge badgeContent={upcoming.length} color="primary">
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <NotificationIcon sx={{ mr: 1 }} />Upcoming
              </Box>
            </Badge>
          } />
          <Tab label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <CalendarIcon sx={{ mr: 1 }} />All Sessions
            </Box>
          } />
          <Tab label={
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <ClassIcon sx={{ mr: 1 }} />Completed
            </Box>
          } />
        </Tabs>
      </Paper>

      {/* Tab Content */}
      {tabValue === 0 && (
        <Card>
          <CardContent sx={{ p: 0 }}>
            {upcoming.length === 0 ? (
              <Typography sx={{ p: 2 }}>No upcoming sessions scheduled</Typography>
            ) : (
              <List>
                {upcoming.map((session) => (
                  <div key={session.id}>
                    <SessionItem session={session} />
                    <Divider variant="inset" component="li" />
                  </div>
                ))}
              </List>
            )}
          </CardContent>
        </Card>
      )}

      {tabValue === 1 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            All Sessions ({allSchedules.length})
          </Typography>
          {allSchedules.length === 0 ? (
            <Typography>No sessions scheduled</Typography>
          ) : (
            <List>
              {allSchedules.map((session) => (
                <Card key={session.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <SessionItem session={session} showActions={false} />
                  </CardContent>
                </Card>
              ))}
            </List>
          )}
        </Box>
      )}

      {tabValue === 2 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Completed Sessions ({completed.length})
          </Typography>
          {completed.length === 0 ? (
            <Typography>No completed sessions</Typography>
          ) : (
            <List>
              {completed.map((session) => (
                <Card key={session.id} sx={{ mb: 2 }}>
                  <CardContent>
                    <SessionItem session={session} showActions={false} />
                  </CardContent>
                </Card>
              ))}
            </List>
          )}
        </Box>
      )}

      {/* Schedule Modal */}
      <Dialog open={openModal} onClose={() => {
        setOpenModal(false);
        resetForm();
      }} fullWidth maxWidth="sm">
        <DialogTitle>{editMode ? 'Edit Schedule' : 'Schedule a Class'}</DialogTitle>
        <DialogContent sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1 }}>
          <TextField 
            select 
            label="Select Student" 
            name="studentId"
            value={formData.studentId} 
            onChange={handleFormChange}
            fullWidth
            required
          >
            {students.map((student) => (
              <MenuItem key={student.enrollment_id} value={student.enrollment_id}>
                {student.student_name} - {student.course_name}
              </MenuItem>
            ))}
          </TextField>
          <TextField 
            label="Date" 
            type="date" 
            name="date"
            value={formData.date} 
            onChange={handleFormChange}
            InputLabelProps={{ shrink: true }} 
            fullWidth
            required
          />
          <TextField 
            label="Time" 
            type="time" 
            name="time"
            value={formData.time} 
            onChange={handleFormChange}
            InputLabelProps={{ shrink: true }} 
            fullWidth
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => {
            setOpenModal(false);
            resetForm();
          }}>
            Cancel
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSaveSchedule} 
            disabled={loading}
          >
            {loading 
              ? (editMode ? 'Updating...' : 'Adding...') 
              : (editMode ? 'Update Schedule' : 'Add Schedule')}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Alert 
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))} 
          severity={snackbar.severity} 
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}