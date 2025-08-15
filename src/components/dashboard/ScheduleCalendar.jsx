import { Card, CardContent, Box, Typography } from '@mui/material';
import { CalendarToday } from '@mui/icons-material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useTheme } from '@mui/material/styles';

const ScheduleCalendar = () => {
  const theme = useTheme();
  
  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CalendarToday sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Upcoming Schedule
          </Typography>
        </Box>
        <Calendar
          locale="en-US"
          className="dashboard-calendar"
          tileClassName={({ date }) => {
            const classDays = [14, 16];
            return classDays.includes(date.getDate()) ? 'has-class' : null;
          }}
        />
      </CardContent>
    </Card>
  );
};

export default ScheduleCalendar;