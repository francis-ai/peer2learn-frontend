import { Card, CardContent, Box, Typography } from '@mui/material';
import { TrendingUp } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';

const performanceStats = {
  attendance: "92%",
  lastRating: "4.5/5",
  assignments: "3/4 submitted"
};

const PerformanceStats = () => {
  const theme = useTheme();
  
  return (
    <Card>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <TrendingUp sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Performance
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography>Attendance:</Typography>
          <Typography sx={{ fontWeight: 600 }}>{performanceStats.attendance}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography>Last Rating:</Typography>
          <Typography sx={{ fontWeight: 600 }}>{performanceStats.lastRating}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography>Assignments:</Typography>
          <Typography sx={{ fontWeight: 600 }}>{performanceStats.assignments}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PerformanceStats;