import { Box, Grid } from '@mui/material';
import { Link } from 'react-router-dom';
import DashboardHeader from '../../components/dashboard/DashboardHeader';
import NextClassCard from '../../components/dashboard/NextClassCard';
import CourseCards from '../../components/dashboard/CourseCards';
import TutorSummary from '../../components/dashboard/TutorSummary';
import { useAuth } from '../../context/studentAuthContext'; 

export default function StudentDashboard() {
  const { student } = useAuth(); 
  return (
    <Box sx={{p: 3, mt: 12, maxWidth: { md: '80%', xs: '100%' }, mx: 'auto' }}>
      <DashboardHeader />
      {student && (
      <Grid container spacing={4}>
        {/* Left Column */}
        <Grid item xs={12} md={8}>
          <NextClassCard />
          <CourseCards />
        </Grid>

        {/* Right Column */}
        <Grid item xs={12} md={4}>
          <TutorSummary student={student} />
          <Box
            component={Link}
            to="/schedule"
            sx={{
              display: 'inline-block',
              borderRadius: 0,
              border: '1px solid #ddd',
              padding: '12px 30px',
              margin: 3,
              textAlign: 'center',
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 'bold',
              boxShadow: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: '#fff',
                boxShadow: 3,
              },
            }}
          >
            View All Schedules
          </Box>
          <Box
            component={Link}
            to="/assignments"
            sx={{
              display: 'inline-block',
              borderRadius: 0,
              border: '1px solid #ddd',
              padding: '12px 30px',
              margin: 3,
              textAlign: 'center',
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 'bold',
              boxShadow: 1,
              transition: 'all 0.3s ease',
              '&:hover': {
                backgroundColor: 'primary.main',
                color: '#fff',
                boxShadow: 3,
              },
            }}
          >
            View All Assignment
          </Box>

        </Grid>
      </Grid>
     )}
    </Box>
  );
}
