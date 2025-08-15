import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Avatar,
} from '@mui/material';
import {
  HelpOutline as HelpOutlineIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Forum as ForumIcon,
} from '@mui/icons-material';

export default function Help() {
  const supportChannels = [
    {
      icon: <EmailIcon color="primary" sx={{ fontSize: 40 }} />,
      title: "Email Support",
      description: "Get detailed help from our support team within 24 hours",
      action: "Send us an email",
      color: "#4caf50"
    },
    {
      icon: <PhoneIcon color="primary" sx={{ fontSize: 40 }} />,
      title: "Phone Support",
      description: "Call us during business hours (9AM-5PM WAT)",
      action: "See phone numbers",
      color: "#ff9800"
    },
    {
      icon: <ForumIcon color="primary" sx={{ fontSize: 40 }} />,
      title: "Community Forum",
      description: "Get help from other students and tutors",
      action: "Visit forum",
      color: "#9c27b0"
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4, mt: 12 }}>
      <Box textAlign="center" mb={6}>
        <Avatar sx={{ 
          bgcolor: 'primary.main', 
          width: 60, 
          height: 60, 
          mx: 'auto', 
          mb: 3,
          '& .MuiSvgIcon-root': { fontSize: '2.5rem' }
        }}>
          <HelpOutlineIcon />
        </Avatar>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
          How can we help you today?
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 700, mx: 'auto' }}>
          Get instant answers from our knowledge base or contact our support team directly
        </Typography>
      </Box>


      <Grid container spacing={1} sx={{ mb: 6 }}>
        {supportChannels.map((channel, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              height: '100%', 
              display: 'flex', 
              flexDirection: 'column',
              borderTop: `4px solid ${channel.color}`,
              boxShadow: 3,
              '&:hover': { transform: 'translateY(-5px)', transition: 'transform 0.3s' }
            }}>
              <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                <Box sx={{ mb: 2 }}>{channel.icon}</Box>
                <Typography variant="h5" gutterBottom>
                  {channel.title}
                </Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>
                  {channel.description}
                </Typography>
                <Button 
                  variant="outlined" 
                  fullWidth 
                  sx={{ 
                    borderColor: channel.color, 
                    color: channel.color,
                    '&:hover': { borderColor: channel.color }
                  }}
                >
                  {channel.action}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};