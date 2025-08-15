import React, { useEffect, useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme
} from '@mui/material';
import {
  Dashboard,
  People,
  School,
  AccountBalance,
  Book,
  Payment,
  Star
} from '@mui/icons-material';
import { useAdminAuth } from '../../context/adminAuthContext';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

// Generate random pastel colors
const getRandomColor = () => {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 80%, 85%)`;
};

export default function DashboardPage() {
  const { admin } = useAdminAuth();
  const theme = useTheme();
  const [stats, setStats] = useState({
    students: 0,
    tutors: 0,
    courses: 0,
    offices: 0,
    reviews: 0,
    total_payments: 0
  });

  useEffect(() => {
    axios.get(`${BASE_URL}/api/admin/stats`)
      .then((res) => setStats(res.data))
      .catch((err) => {
        console.error('Failed to fetch dashboard stats:', err);
      });
  }, []);

  const menuItems = [
    { text: 'Students', icon: <People fontSize="large" />, count: stats.students, path: '/admin/students' },
    { text: 'Tutors', icon: <School fontSize="large" />, count: stats.tutors, path: '/admin/tutors' },
    { text: 'Offices', icon: <AccountBalance fontSize="large" />, count: stats.offices, path: '/admin/offices' },
    { text: 'Courses', icon: <Book fontSize="large" />, count: stats.courses, path: '/admin/courses' },
    { text: 'Payments (₦)', icon: <Payment fontSize="large" />, count: parseFloat(stats.total_payments || 0), path: '/admin/payments' },
    { text: 'Reviews', icon: <Star fontSize="large" />, count: stats.reviews, path: '/admin/reviews' },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
        <Dashboard sx={{ verticalAlign: 'middle', mr: 1 }} />
        Dashboard Overview | {admin?.name}
      </Typography>

      <Grid container spacing={3}>
        {menuItems.map((item, index) => {
          const bgColor = getRandomColor();
          return (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card 
                sx={{ 
                  height: '100%',
                  width: '280px',
                  backgroundColor: bgColor,
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: theme.shadows[6]
                  }
                }}
              >
                <CardContent sx={{ textAlign: 'center' }}>
                  <Box sx={{ 
                    display: 'inline-flex',
                    p: 2,
                    mb: 2,
                    borderRadius: '50%',
                    bgcolor: 'rgba(255,255,255,0.7)'
                  }}>
                    {React.cloneElement(item.icon, { 
                      sx: { 
                        color: theme.palette.getContrastText(bgColor),
                        fontSize: '2rem' 
                      } 
                    })}
                  </Box>
                  <Typography variant="h5" component="div" gutterBottom>
                    {item.text}
                  </Typography>
                  <Typography variant="h3" component="div" sx={{ fontWeight: 'bold' }}>
                    {(item.count || 0).toLocaleString()}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
