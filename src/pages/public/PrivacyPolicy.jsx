import {
  Box,
  Container,
  Typography,
  Paper,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Grid
} from '@mui/material';
import {
  PrivacyTip as PrivacyIcon,
  Lock as LockIcon,
  Security as SecurityIcon,
  People as PeopleIcon,
  DataUsage as DataIcon,
  Mail as MailIcon,
  CheckCircle as CheckIcon,
} from '@mui/icons-material';

export default function Privacy() {
  const privacyPoints = [
    {
      icon: <LockIcon color="primary" />,
      title: "Data Encryption",
      description: "All your data is encrypted both in transit and at rest using industry-standard protocols."
    },
    {
      icon: <PeopleIcon color="primary" />,
      title: "Limited Access",
      description: "Only authorized personnel have access to your personal information."
    },
    {
      icon: <DataIcon color="primary" />,
      title: "Data Control",
      description: "You have full control over your data and can request deletion at any time."
    },
    {
      icon: <SecurityIcon color="primary" />,
      title: "Security Audits",
      description: "Regular security audits ensure your data remains protected."
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
          mb: 3 
        }}>
          <PrivacyIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
          Privacy Policy
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          Last updated: October 14, 2025. We're committed to protecting your personal information.
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Our Commitment to Your Privacy
        </Typography>
        <Typography paragraph>
          At Peer2Learn, we take your privacy seriously. This Privacy Policy explains how we collect, 
          use, disclose, and safeguard your information when you use our learning platform.
        </Typography>
        <Typography paragraph>
          Please read this privacy policy carefully. By using our platform, you agree to the 
          collection and use of information in accordance with this policy.
        </Typography>
      </Paper>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {privacyPoints.map((point, index) => (
          <Grid item xs={12} sm={6} md={3} key={index} sx={{mb: 4}}>
            <Paper elevation={2} sx={{ p: 3, height: '100%', width: {md: '210px', xs: '85%'}, borderRadius: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                {point.icon}
                <Typography variant="h6" sx={{ ml: 1.5 }}>
                  {point.title}
                </Typography>
              </Box>
              <Typography color="text.secondary">
                {point.description}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Box sx={{ mb: 6, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Information We Collect
        </Typography>
        <Typography paragraph>
          We collect several types of information from and about users of our platform, including:
        </Typography>
        <Box component="ul" sx={{ pl: 3, mb: 3, '& li': { mb: 1.5 } }}>
          <li>
            <Typography>
              <strong>Personal Data:</strong> Name, email address, phone number, and payment details.
            </Typography>
          </li>
          <li>
            <Typography>
              <strong>Usage Data:</strong> How you interact with our platform, including course progress and preferences.
            </Typography>
          </li>
          <li>
            <Typography>
              <strong>Technical Data:</strong> IP address, browser type, device details, and cookies.
            </Typography>
          </li>
        </Box>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          How We Use Your Information
        </Typography>
        <Typography paragraph>
          We use the information we collect for various purposes:
        </Typography>
        <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
          {[
            "To provide and maintain our services",
            "To notify you about updates or changes to our platform",
            "To personalize your experience and recommend courses",
            "To process transactions and manage your account",
            "To improve our platform and customer experience",
            "To detect, prevent, and address technical or security issues"
          ].map((item, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <CheckIcon color="primary" sx={{ fontSize: 16 }} />
              </ListItemIcon>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Children's Privacy
        </Typography>
        <Typography paragraph>
          Peer2Learn is committed to protecting the privacy of minors. We require parental or guardian
          consent for users under the age of 18. Personal data from minors is collected only with verified
          consent and used strictly for educational purposes.
        </Typography>
        <Typography paragraph>
          Parents or guardians may review or request deletion of their child’s information by contacting 
          our support team.
        </Typography>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom>
          Data Retention
        </Typography>
        <Typography paragraph>
          We retain your personal data only as long as necessary to provide our services, comply with 
          legal obligations, resolve disputes, and enforce our agreements. Once no longer needed, data 
          is securely deleted or anonymized.
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <MailIcon color="primary" sx={{ mr: 1 }} />
          Contact Us
        </Typography>
        <Typography paragraph>
          If you have any questions about this Privacy Policy, please contact us:
        </Typography>
        <Box sx={{ '& > *': { mr: 2, mb: 2 } }}>
          <Typography color="primary">support@peer2learn.com</Typography>
        </Box>
      </Paper>
    </Container>
  );
};
