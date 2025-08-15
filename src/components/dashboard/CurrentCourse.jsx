import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  LinearProgress,
  Card,
  CardContent,
  CardHeader,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent
} from '@mui/material';
import { CheckCircle, Cancel, Book } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/studentAuthContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const CurrentCourses = () => {
  const { student } = useAuth();
  const studentId = student?.id;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSyllabusModal, setOpenSyllabusModal] = useState(false);
  const [selectedSyllabus, setSelectedSyllabus] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');
  const [heldCourses, setHeldCourses] = useState([]);
  const [reactivating, setReactivating] = useState(null);

  // Fetch current courses
  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/students/current-courses/${studentId}`);
      setCourses(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Failed to fetch courses:', err);
      setLoading(false);
    }
  };

  // Fetch held courses
  const fetchHeldCourses = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/students/held-courses/${studentId}`);
      setHeldCourses(res.data.map(c => c.id)); // store only IDs
    } catch (err) {
      console.error('Failed to fetch held courses:', err);
    }
  };

  useEffect(() => {
    if (!studentId) return;
    fetchCourses();
    fetchHeldCourses();
  }, [studentId]);

  const handleOpenModal = (syllabus, title) => {
    setSelectedSyllabus(syllabus);
    setSelectedTitle(title);
    setOpenSyllabusModal(true);
  };

  const handleCloseModal = () => {
    setOpenSyllabusModal(false);
    setSelectedSyllabus([]);
    setSelectedTitle('');
  };

  const handleReactivate = async (courseId) => {
    try {
      setReactivating(courseId);
      await axios.put(`${BASE_URL}/api/students/reactivate-course/${courseId}`);
      await fetchCourses();
      await fetchHeldCourses();
    } catch (err) {
      console.error('Failed to reactivate course:', err);
    } finally {
      setReactivating(null);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        My Current Courses
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : courses.length === 0 ? (
        <Typography>No current courses found.</Typography>
      ) : (
        courses.map((course, idx) => {
          const visibleSyllabus = course.syllabus.slice(0, 2);
          const isOnHold = heldCourses.includes(course.id);

          return (
            <Card
              key={idx}
              variant="outlined"
              sx={{
                mb: 3,
                opacity: course.on_hold === 1 ? 0.6 : 1, // Dim the card if on hold
                pointerEvents: course.on_hold === 1 ? 'none' : 'auto' // Disable card clicks except button
              }}
            >
              <CardHeader
                title={course.title}
                subheader={`Instructor: ${course.tutorName}`}
                action={
                  <Chip
                    label={isOnHold ? 'On Hold' : `${course.progress}% Complete`}
                    color={isOnHold ? 'error' : course.progress === 100 ? 'success' : 'primary'}
                  />
                }
              />

              <CardContent>
                {isOnHold ? (
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => handleReactivate(course.id)}
                    disabled={reactivating === course.id}
                  >
                    {reactivating === course.id ? 'Reactivating...' : 'Reactivate'}
                  </Button>
                ) : (
                  <>
                    <LinearProgress
                      variant="determinate"
                      value={course.progress}
                      sx={{ height: 10, borderRadius: 5, mb: 2 }}
                    />

                    <Typography variant="h6" gutterBottom>
                      <Book sx={{ verticalAlign: 'middle', mr: 1 }} />
                      Syllabus
                    </Typography>

                    <List dense>
                      {visibleSyllabus.map((topic, i) => (
                        <ListItem key={i}>
                          <ListItemIcon>
                            {topic.covered ? (
                              <CheckCircle color="success" />
                            ) : (
                              <Cancel color="disabled" />
                            )}
                          </ListItemIcon>
                          <ListItemText
                            primary={`Week ${i + 1}: ${topic.topic}`}
                            secondary={
                              topic.covered && topic.dateCovered
                                ? `Completed on ${new Date(topic.dateCovered).toLocaleDateString()}`
                                : 'Pending'
                            }
                          />
                        </ListItem>
                      ))}
                    </List>

                    {course.syllabus.length > visibleSyllabus.length && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => handleOpenModal(course.syllabus, course.title)}
                        >
                          View Full Syllabus
                        </Button>
                      </>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          );
        })
      )}

      {/* Full Syllabus Modal */}
      <Dialog
        open={openSyllabusModal}
        onClose={handleCloseModal}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>{selectedTitle} – Full Syllabus</DialogTitle>
        <DialogContent dividers>
          <List dense>
            {selectedSyllabus.map((topic, i) => (
              <ListItem key={i}>
                <ListItemIcon>
                  {topic.covered ? (
                    <CheckCircle color="success" />
                  ) : (
                    <Cancel color="disabled" />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={`Week ${i + 1}: ${topic.topic}`}
                  secondary={
                    topic.covered && topic.dateCovered
                      ? `Completed on ${new Date(topic.dateCovered).toLocaleDateString()}`
                      : 'Pending'
                  }
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CurrentCourses;
