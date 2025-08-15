import { Card, CardContent, List, ListItem, ListItemAvatar, ListItemText, Divider, Typography, Avatar, Box } from '@mui/material';
import { Notifications, Payment, School, Class } from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

const notifications = [
  {
    id: 1,
    title: "Payment Reminder",
    message: "Your next installment of ₦80,000 is due in 3 days",
    time: "2 hours ago",
    icon: <Payment />
  },
  {
    id: 2,
    title: "Tutor Feedback",
    message: "David submitted feedback on your last Java class",
    time: "1 day ago",
    icon: <School />
  },
  {
    id: 3,
    title: "Schedule Change",
    message: "Friday's class moved to 11am–2pm",
    time: "2 days ago",
    icon: <Class />
  }
];

const NotificationsList = () => {
  const theme = useTheme();
  
  return (
    <Card sx={{ mb: 4 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Notifications sx={{ mr: 1, color: theme.palette.primary.main }} />
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Recent Notifications
          </Typography>
        </Box>
        <List sx={{ p: 0 }}>
          {notifications.map((item) => (
            <Box key={item.id}>
              <ListItem alignItems="flex-start" sx={{ px: 0 }}>
                <ListItemAvatar sx={{ minWidth: 40 }}>
                  <Avatar sx={{ 
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    width: 32, 
                    height: 32 
                  }}>
                    {item.icon}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={item.title}
                  secondary={
                    <>
                      <Typography component="span" variant="body2" color="text.primary">
                        {item.message}
                      </Typography>
                      <Typography variant="caption" display="block">
                        {item.time}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
              <Divider component="li" />
            </Box>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default NotificationsList;