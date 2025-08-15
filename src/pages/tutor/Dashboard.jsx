import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Button,
  CircularProgress,
} from '@mui/material';
import {
  People as StudentsIcon,
  Class as CoursesIcon,
  AttachMoney as EarningsIcon,
  Star as RatingIcon,
  Event as CalendarIcon,
  ChevronRight,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useTutorAuth } from '../../context/tutorAuthContext';
import { useEffect, useState } from 'react';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Dashboard() {
  const { tutor } = useTutorAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/tutors/dashboard-stats/${tutor.id}`);
        const data = res.data;

        setStats([
          {
            title: 'Students',
            value: data.totalStudents,
            icon: <StudentsIcon fontSize="large" />,
            color: 'primary',
          },
          {
            title: 'Courses',
            value: data.totalCourses,
            icon: <CoursesIcon fontSize="large" />,
            color: 'secondary',
          },
          {
            title: 'Earnings',
            value: `₦${parseFloat(data.totalEarnings).toLocaleString()}`,
            icon: <EarningsIcon fontSize="large" />,
            color: 'warning',
          },
          {
            title: 'Rating',
            value: `${parseFloat(data.rating).toFixed(2)}/5`,
            icon: <RatingIcon fontSize="large" />,
            color: 'info',
          },
        ]);

        setUpcomingSessions(data.upcomingSessions);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, [tutor.id]);

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h5" fontWeight="bold">
          Dashboard Overview, {tutor.name}
        </Typography>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {stats.map((stat, index) => (
              <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      sx={{
                        bgcolor: `${stat.color}.main`,
                        color: `${stat.color}.contrastText`,
                        mr: 3,
                        width: 50,
                        height: 50,
                      }}
                    >
                      {stat.icon}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" color="text.secondary">
                        {stat.title}
                      </Typography>
                      <Typography variant="h4" fontWeight="bold">
                        {stat.value}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Upcoming Sessions */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" fontWeight="bold">
                      Upcoming Sessions
                    </Typography>
                    <Button
                      size="small"
                      component={Link}
                      to="/tutor/schedule"
                      endIcon={<ChevronRight />}
                    >
                      View All
                    </Button>
                  </Box>

                  {upcomingSessions.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No upcoming sessions.
                    </Typography>
                  ) : (
                    <List>
                      {upcomingSessions.map((session) => (
                        <ListItem key={session.id} sx={{ px: 0 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'primary.main' }}>
                              <CalendarIcon />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText
                            primary={`${session.student} - ${session.course}`}
                            secondary={`Time: ${session.time}`}
                          />
                        </ListItem>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </>
      )}
    </Box>
  );
}
