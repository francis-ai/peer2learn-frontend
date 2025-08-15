import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Avatar,
  List,
  ListItem,
  ListItemIcon,
  Accordion,
  AccordionSummary,
  AccordionDetails, 
  ListItemText
} from '@mui/material';
import {
  Gavel as GavelIcon,
  ExpandMore as ExpandMoreIcon,
  Warning as WarningIcon,
  AccountBalance as BalanceIcon,
  Copyright as CopyrightIcon
} from '@mui/icons-material';


export default function Terms() {
  const termsSections = [
    {
      title: "Account Registration",
      content: "You must provide accurate and complete information when creating an account. You are responsible for maintaining the confidentiality of your account credentials."
    },
    {
      title: "Course Access",
      content: "Payment grants you a limited, non-exclusive, non-transferable license to access the purchased courses for personal, non-commercial use."
    },
    {
      title: "User Conduct",
      content: "You agree not to share your account, redistribute course materials, or use the platform for any illegal or unauthorized purpose."
    },
    {
      title: "Payments and Refunds",
      content: "All payments are final unless otherwise stated. Refund requests must be made within 14 days of purchase and are granted at our discretion."
    },
    {
      title: "Intellectual Property",
      content: "All course materials are protected by copyright laws. Unauthorized distribution or reproduction is strictly prohibited."
    },
    {
      title: "Termination",
      content: "We reserve the right to terminate or suspend your account immediately for violations of these terms without prior notice."
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
          <GavelIcon sx={{ fontSize: 40 }} />
        </Avatar>
        <Typography variant="h3" gutterBottom sx={{ fontWeight: 600 }}>
          Terms of Service
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 800, mx: 'auto' }}>
          Effective Date: November 15, 2023. Please read these terms carefully before using our platform.
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, mb: 6, borderRadius: 2 }}>
        <Typography variant="h4" gutterBottom>
          Introduction
        </Typography>
        <Typography paragraph>
          Welcome to Edmoss! These Terms of Service govern your use of our e-learning platform 
          and services. By accessing or using our platform, you agree to be bound by these terms.
        </Typography>
        <Typography paragraph>
          These terms represent a legal agreement between you and Edmoss. If you do not agree 
          with any part of these terms, you must not use our services.
        </Typography>
      </Paper>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <BalanceIcon color="primary" sx={{ mr: 1 }} />
          Key Terms
        </Typography>
        
        {termsSections.map((section, index) => (
          <Accordion key={index} elevation={2} sx={{ mb: 2, borderRadius: '8px!important' }}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              sx={{ backgroundColor: 'action.hover' }}
            >
              <Typography variant="h6" component="div">
                {section.title}
              </Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ borderTop: '1px solid', borderColor: 'divider' }}>
              <Typography>{section.content}</Typography>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <WarningIcon color="warning" sx={{ mr: 1 }} />
          Prohibited Activities
        </Typography>
        <Typography paragraph>
          When using our platform, you must not:
        </Typography>
        <List sx={{ width: '100%', bgcolor: 'background.paper', mb: 3 }}>
          {[
            "Reverse engineer or attempt to extract source code from our platform",
            "Use automated systems (bots) to access the service",
            "Share your account credentials with others",
            "Upload or transmit viruses or malicious code",
            "Harass, threaten or intimidate other users or instructors",
            "Violate any applicable laws or regulations"
          ].map((item, index) => (
            <ListItem key={index} sx={{ py: 0.5 }}>
              <ListItemIcon sx={{ minWidth: 32 }}>
                <WarningIcon color="error" sx={{ fontSize: 16 }} />
              </ListItemIcon>
              <ListItemText primary={item} />
            </ListItem>
          ))}
        </List>
      </Box>

      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <CopyrightIcon color="primary" sx={{ mr: 1 }} />
          Intellectual Property
        </Typography>
        <Typography paragraph>
          The Edmoss platform and its original content, features, and functionality are owned by 
          Edmoss and are protected by international copyright, trademark, and other intellectual 
          property laws.
        </Typography>
        <Typography paragraph>
          Course materials provided by instructors are the intellectual property of the respective 
          instructors or Edmoss, depending on the agreement. You may not reproduce, distribute, 
          or create derivative works from any content without explicit permission.
        </Typography>
      </Box>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom>
          Changes to These Terms
        </Typography>
        <Typography paragraph sx={{ mb: 3 }}>
          We may update our Terms of Service from time to time. We will notify you of any changes 
          by posting the new Terms on this page and updating the "effective date" at the top.
        </Typography>
        <Button variant="contained" size="large">
          I Accept These Terms
        </Button>
      </Paper>
    </Container>
  );
};