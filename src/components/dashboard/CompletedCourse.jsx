import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardHeader,
  CardContent,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText
} from '@mui/material';
import { CheckCircle, Download } from '@mui/icons-material';
import axios from 'axios';
import { useAuth } from '../../context/studentAuthContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const CompletedCourses = () => {
  const { student } = useAuth();
  const studentId = student?.id;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const [openModal, setOpenModal] = useState(false);
  const [selectedSyllabus, setSelectedSyllabus] = useState([]);
  const [selectedTitle, setSelectedTitle] = useState('');

  useEffect(() => {
    if (!studentId) return;

    axios.get(`${BASE_URL}/api/students/completed-courses/${studentId}`)
      .then(res => {
        setCourses(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error loading completed courses:', err);
        setLoading(false);
      });
  }, [studentId]);

  const handleDownloadCertificate = (courseId) => {
    const url = `${BASE_URL}/api/students/certificate/${studentId}/${courseId}`;
    window.open(url, '_blank');
  };

  const handleViewSyllabus = (syllabus, title) => {
    setSelectedSyllabus(syllabus);
    setSelectedTitle(title);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSyllabus([]);
    setSelectedTitle('');
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>
        Completed Courses
      </Typography>

      {loading ? (
        <Typography>Loading...</Typography>
      ) : courses.length === 0 ? (
        <Typography>No completed courses found.</Typography>
      ) : (
        courses.map((course, idx) => (
          <Card key={idx} variant="outlined" sx={{ mb: 3 }}>
            <CardHeader
              title={course.title}
              subheader={`Instructor: ${course.tutorName}`}
              action={
                <Chip
                  label="Completed"
                  color="success"
                  icon={<CheckCircle />}
                />
              }
            />
            <CardContent>
              <Box display="flex" gap={2} flexWrap="wrap">
                <Button
                  variant="outlined"
                  onClick={() => handleViewSyllabus(course.syllabus, course.title)}
                >
                  View Syllabus
                </Button>

                <Button
                  variant="contained"
                  startIcon={<Download />}
                  onClick={() => handleDownloadCertificate(course.id)}
                >
                  Download Certificate
                </Button>
              </Box>
            </CardContent>
          </Card>
        ))
      )}

      {/* Syllabus Modal */}
      <Dialog
        open={openModal}
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
                  <CheckCircle color="success" />
                </ListItemIcon>
                <ListItemText
                  primary={`Week ${i + 1}: ${topic.topic}`}
                  secondary={`Completed on ${new Date(topic.dateCovered).toLocaleDateString()}`}
                />
              </ListItem>
            ))}
          </List>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default CompletedCourses;
