import React, { useEffect, useState } from 'react';
import { Card, CardContent, Grid, Box, Typography, Avatar, LinearProgress } from '@mui/material';
import { Class } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
import { useAuth } from '../../context/studentAuthContext';

const BASE_URL =process.env.REACT_APP_BASE_URL; 

const CourseCards = () => {
  const { student } = useAuth();
  const studentId = student?.id;
  const theme = useTheme();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, nextClassRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/students/ongoing-courses/${studentId}`),
          axios.get(`${BASE_URL}/api/students/next-class/${studentId}`)
        ]);

        const courses = coursesRes.data;
        const nextClass = nextClassRes.data;

        // Merge next class into the correct course (if matched)
        const updatedCourses = courses.map(course => {
          if (
            nextClass &&
            nextClass.course === course.course_title // match by course title
          ) {
            return {
              ...course,
              schedule_datetime: nextClass.time,
              location: nextClass.location
            };
          }
          return course;
        });

        setCourses(updatedCourses);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      }
    };

    if (studentId) fetchData();
  }, [studentId]);


  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Class sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            My Courses
          </Typography>
        </Box>
        <Grid container spacing={3}>
          {courses.map((course, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card variant="outlined">
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ bgcolor: theme.palette.primary.main, width: 40, height: 40, mr: 2 }}>
                      {course.course_title?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography sx={{ fontWeight: 600 }}>{course.course_title}</Typography>
                      <Typography variant="body2" color="text.secondary">{course.tutor_name}</Typography>
                    </Box>
                  </Box>
                  <LinearProgress 
                    variant="determinate" 
                    value={course.progress || 0} 
                    sx={{ height: 8, borderRadius: 4, mb: 2 }} 
                  />
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Progress:</strong> {course.progress || 0}%
                  </Typography>
                  <Typography variant="body2" sx={{ mb: 1 }}>
                    <strong>Schedule:</strong> {course.schedule_datetime || 'Not scheduled yet'}
                  </Typography>

                  <Typography variant="body2">
                    <strong>Location:</strong> {course.location || 'Not scheduled yet'}
                  </Typography>

                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default CourseCards;
