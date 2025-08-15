// All imports same as yours
import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Typography, Card, CardContent, Avatar, Grid, Chip, Divider,
  Button, Table, TableBody, TableCell, TableContainer, TableHead,
  TableRow, Paper, LinearProgress, Checkbox, TextField, IconButton,
  Stack, Snackbar, Alert
} from '@mui/material';
import {
  Email as EmailIcon,
  Phone as PhoneIcon,
  CalendarToday as DateIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ArrowBack as BackIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { useTutorAuth } from '../../context/tutorAuthContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function MyStudents() {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [newTopic, setNewTopic] = useState('');
  const [editingTopic, setEditingTopic] = useState(null);
  const [editTopicText, setEditTopicText] = useState('');
  const [loading, setLoading] = useState(true);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { tutor } = useTutorAuth();
  const tutorId = tutor?.id;

  useEffect(() => {
    if (!tutorId) return;
    axios.get(`${BASE_URL}/api/tutors/my-students/${tutorId}`)
      .then(res => {
        setStudents(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to load students', err);
        setLoading(false);
      });
  }, [tutorId]);

  const handleViewDetails = (student) => setSelectedStudent(student);
  const handleBackToList = () => setSelectedStudent(null);

  const handleToggleTopic = (enrollmentId, topicId) => {
    const course = selectedStudent.courses.find(c => c.enrollment_id === enrollmentId);
    const topic = course?.syllabus.find(t => t.id === topicId);
    if (!topic) return;

    const updated = {
      topic: topic.topic,
      covered: !topic.covered
    };

    axios.put(`${BASE_URL}/api/tutors/syllabus/${topicId}`, updated)
      .then(() => {
        const updatedStudent = {
          ...selectedStudent,
          courses: selectedStudent.courses.map(course => {
            if (course.enrollment_id === enrollmentId) {
              return {
                ...course,
                syllabus: course.syllabus.map(t => {
                  if (t.id === topicId) {
                    return {
                      ...t,
                      covered: !t.covered,
                      dateCovered: !t.covered ? new Date().toISOString().split('T')[0] : null
                    };
                  }
                  return t;
                })
              };
            }
            return course;
          })
        };
        setSelectedStudent(updatedStudent);
      }).catch(err => console.error('Failed to update topic status', err));
  };

  const handleAddTopic = (enrollmentId) => {
    if (!newTopic.trim()) return;
    axios.post(`${BASE_URL}/api/tutors/syllabus`, {
      enrollment_id: enrollmentId,
      topic: newTopic
    }).then(res => {
      const createdTopic = res.data;
      const updatedStudent = {
        ...selectedStudent,
        courses: selectedStudent.courses.map(course => {
          if (course.enrollment_id === enrollmentId) {
            return {
              ...course,
              syllabus: [...course.syllabus, createdTopic]
            };
          }
          return course;
        })
      };
      setSelectedStudent(updatedStudent);
      setNewTopic('');
    }).catch(err => console.error('Failed to add topic', err));
  };

  const handleStartEdit = (topic) => {
    setEditingTopic(topic.id);
    setEditTopicText(topic.topic);
  };

  const handleSaveEdit = (enrollmentId, topicId) => {
    axios.put(`${BASE_URL}/api/tutors/syllabus/${topicId}`, {
      topic: editTopicText
    }).then(() => {
      const updatedStudent = {
        ...selectedStudent,
        courses: selectedStudent.courses.map(course => {
          if (course.enrollment_id === enrollmentId) {
            return {
              ...course,
              syllabus: course.syllabus.map(topic => {
                if (topic.id === topicId) {
                  return {
                    ...topic,
                    topic: editTopicText
                  };
                }
                return topic;
              })
            };
          }
          return course;
        })
      };
      setSelectedStudent(updatedStudent);
      setEditingTopic(null);
      setEditTopicText('');
    }).catch(err => console.error('Failed to edit topic', err));
  };

  const handleCancelEdit = () => {
    setEditingTopic(null);
    setEditTopicText('');
  };

  const handleDeleteTopic = (enrollmentId, topicId) => {
    axios.delete(`${BASE_URL}/api/tutors/syllabus/${topicId}`)
      .then(() => {
        const updatedStudent = {
          ...selectedStudent,
          courses: selectedStudent.courses.map(course => {
            if (course.enrollment_id === enrollmentId) {
              return {
                ...course,
                syllabus: course.syllabus.filter(t => t.id !== topicId)
              };
            }
            return course;
          })
        };
        setSelectedStudent(updatedStudent);
      }).catch(err => console.error('Failed to delete topic', err));
  };

  const markCourseCompleted = async (student_id, course_id) => {
    try {
      await axios.put(`${BASE_URL}/api/tutors/mark-course-complete`, {
        student_id,
        course_id
      });

      setSelectedStudent(prev => ({
        ...prev,
        courses: prev.courses.map(course =>
          course.id === course_id ? { ...course, is_completed: 1 } : course
        )
      }));

      setSnackbar({
        open: true,
        message: 'Course marked as completed!',
        severity: 'success'
      });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: 'Failed to mark as completed!',
        severity: 'error'
      });
    }
  };
  console.log(loading)

  if (selectedStudent) {
    return (
      <Box sx={{ p: 3 }}>
        <Button startIcon={<BackIcon />} onClick={handleBackToList} sx={{ mb: 2 }}>
          Back to Students
        </Button>

        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Avatar sx={{ width: 80, height: 80, mr: 3 }}>
                {selectedStudent.name.charAt(0)}
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight="bold">
                  {selectedStudent.name}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                  <Chip icon={<EmailIcon />} label={selectedStudent.email} />
                  <Chip icon={<PhoneIcon />} label={selectedStudent.phone} />
                  <Chip icon={<DateIcon />} label={`Joined: ${selectedStudent.joinDate}`} />
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />

            {selectedStudent.courses.map((course) => {
              const total = course.syllabus.length;
              const covered = course.syllabus.filter(t => t.covered).length;
              const progress = total > 0 ? Math.round((covered / total) * 100) : 0;

              return (
                <Box key={course.enrollment_id} sx={{ mb: 4 }}>
                  <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
                    {course.title} - Course Syllabus
                  </Typography>

                  <TableContainer component={Paper} sx={{ mb: 3 }}>
                    <Table>
                      <TableHead>
                        <TableRow>
                          <TableCell>Status</TableCell>
                          <TableCell>Topic</TableCell>
                          <TableCell>Date Covered</TableCell>
                          <TableCell align="right">Actions</TableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {course.syllabus.map((topic) => (
                          <TableRow key={topic.id}>
                            <TableCell>
                              <Checkbox
                                checked={topic.covered}
                                onChange={() => handleToggleTopic(course.enrollment_id, topic.id)}
                                color="primary"
                              />
                            </TableCell>
                            <TableCell>
                              {editingTopic === topic.id ? (
                                <TextField
                                  value={editTopicText}
                                  onChange={(e) => setEditTopicText(e.target.value)}
                                  size="small"
                                  fullWidth
                                />
                              ) : (
                                <Typography sx={{ textDecoration: topic.covered ? 'line-through' : 'none' }}>
                                  {topic.topic}
                                </Typography>
                              )}
                            </TableCell>
                            <TableCell>{topic.covered ? topic.dateCovered : 'Not covered'}</TableCell>
                            <TableCell align="right">
                              {editingTopic === topic.id ? (
                                <Stack direction="row" spacing={1}>
                                  <IconButton size="small" onClick={() => handleSaveEdit(course.enrollment_id, topic.id)}>
                                    <CheckIcon color="success" />
                                  </IconButton>
                                  <IconButton size="small" onClick={handleCancelEdit}>
                                    <CloseIcon color="error" />
                                  </IconButton>
                                </Stack>
                              ) : (
                                <Stack direction="row" spacing={1}>
                                  <IconButton size="small" onClick={() => handleStartEdit(topic)}>
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                  <IconButton size="small" onClick={() => handleDeleteTopic(course.enrollment_id, topic.id)}>
                                    <DeleteIcon fontSize="small" color="error" />
                                  </IconButton>
                                </Stack>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    <TextField
                      placeholder="Add new topic"
                      value={newTopic}
                      onChange={(e) => setNewTopic(e.target.value)}
                      size="small"
                      sx={{ flexGrow: 1 }}
                    />
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => handleAddTopic(course.enrollment_id)}
                      disabled={!newTopic.trim()}
                    >
                      Add Topic
                    </Button>
                  </Box>

                  <Typography variant="subtitle1" sx={{ mb: 1 }}>
                    Course Progress: {progress}%
                  </Typography>
                  <LinearProgress variant="determinate" value={progress} sx={{ height: 10, borderRadius: 5 }} />

                  <Box sx={{ mt: 2 }}>
                    <Button
                      variant={course.is_completed ? 'contained' : 'outlined'}
                      color="success"
                      disabled={course.is_completed}
                      onClick={() => markCourseCompleted(selectedStudent.id, course.id)}
                    >
                      {course.is_completed ? 'Completed' : 'Mark as Completed'}
                    </Button>

                    {course.is_completed && (
                      <Typography variant="caption" color="textSecondary" sx={{ mt: 1, display: 'block' }}>
                        ✔ This course has been marked as completed.
                      </Typography>
                    )}
                  </Box>
                </Box>
              );
            })}
          </CardContent>
        </Card>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={4000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        >
          <Alert severity={snackbar.severity} variant="filled">
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" fontWeight="bold" sx={{ mb: 3 }}>
        My Students
      </Typography>

      <Grid container spacing={3}>
        {students.map((student) => (
          <Grid item xs={12} sm={6} md={4} key={student.id}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Avatar sx={{ width: 50, height: 50, mr: 2 }}>
                    {student.name.charAt(0)}
                  </Avatar>
                  <Box>
                    <Typography fontWeight="bold">{student.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{student.email}</Typography>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                  <Chip icon={<PhoneIcon fontSize="small" />} label={student.phone} size="small" />
                  <Chip icon={<DateIcon fontSize="small" />} label={`Joined: ${student.joinDate}`} size="small" />
                </Box>
                <Button fullWidth variant="outlined" onClick={() => handleViewDetails(student)} sx={{ mt: 1 }}>
                  View Details
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
