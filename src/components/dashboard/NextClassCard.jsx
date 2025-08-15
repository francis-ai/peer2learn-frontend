import { useEffect, useState } from 'react';
import { Card, CardContent, Box, Typography, CircularProgress } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';
import axios from 'axios';
import { useAuth } from '../../context/studentAuthContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const NextClassCard = () => {
  const { student } = useAuth();
  const studentId = student?.id;

  const theme = useTheme();
  const [nextClass, setNextClass] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNextClass = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/students/next-class/${studentId}`);
        setNextClass(res.data);
      } catch (error) {
        console.error('Failed to load next class', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNextClass();
  }, [studentId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (!nextClass || !nextClass.course) {
    return (
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Typography>No upcoming class found.</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ mb: 4, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
      <CardContent sx={{ display: 'flex', alignItems: 'center' }}>
        <CheckCircle sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Next Class: {nextClass.course}
          </Typography>
          <Typography>
            {nextClass.time} • {nextClass.location}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default NextClassCard;
