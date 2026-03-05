import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  Snackbar,
  Alert,
  Chip,
  Paper,
  Divider,
  useTheme,
  useMediaQuery,
  Stack,
} from "@mui/material";

import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import LocationOnIcon from "@mui/icons-material/LocationOn";

const faqs = [
  {
    id: 1,
    question: "What is Peer2Learn?",
    answer:
      "Peer2Learn is an innovative online learning platform that connects students (ages 8 and up) with qualified peer tutors for personalized academic support. We offer a wide range of subjects and allow learners to choose tutors who match their learning style, schedule, and budget.",
    category: "General",
  },
  {
    id: 2,
    question: "Who can use Peer2Learn?",
    answer:
      "Anyone aged 8 and above can use Peer2Learn. Students under 18 must have parental or guardian consent to register and participate in tutoring sessions. We have specific safety measures and monitoring systems in place for younger learners.",
    category: "General",
  },
  {
    id: 3,
    question: "Is Peer2Learn only for school students?",
    answer:
      "Not at all! While many of our learners are school or college students, we welcome anyone seeking academic support or peer tutoring. This includes adult learners, professionals looking to upskill, and anyone passionate about continuous learning.",
    category: "General",
  },
  {
    id: 4,
    question: "How do I book a tutoring session?",
    answer:
      "Booking a session is simple: Sign up for a free account, browse available tutors by subject or skill, view their profiles, ratings, and availability, then book and pay for a session that fits your schedule. You'll receive instant confirmation and meeting details.",
    category: "Students & Parents",
  },
  {
    id: 5,
    question: "Do parents need to supervise sessions for younger children?",
    answer:
      "Yes. Parents or guardians are responsible for supervising students under 18, especially those under 13. We recommend parents be present in the same room during sessions to ensure safety, engagement, and the best learning experience.",
    category: "Students & Parents",
  },
  {
    id: 6,
    question: "What subjects do you offer?",
    answer:
      "We offer a comprehensive range of subjects including Mathematics, Sciences (Physics, Chemistry, Biology), English, Languages, Coding, Test Preparation, and many more. New subjects are added regularly based on student demand and tutor expertise.",
    category: "Subjects & Tutoring",
  },
  {
    id: 7,
    question: "How are tutors vetted?",
    answer:
      "All tutors undergo a rigorous screening process including background checks, academic credential verification, interview assessments, and a probationary teaching period. Only the top 15% of applicants are accepted to ensure quality education.",
    category: "Safety & Quality",
  },
];

const locations = [
  {
    city: "Lagos (Headquarters)",
    address: "No 38 Opebi Road, Ikeja, Lagos, Nigeria",
    phone: "+234 816 455 7305",
    email: "lagos@peer2learn.com",
    hours: "Mon-Fri: 8am - 8pm, Sat: 9am - 5pm",
    coordinates: "6.6018,3.3515", // Ikeja coordinates
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.508570513449!2d3.3493!3d6.6018!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b93b5e7b1e8b1%3A0x6b8f7e9c8e4b9a!2sOpebi%20Rd%2C%20Ikeja%2C%20Lagos!5e0!3m2!1sen!2sng!4v1635447890123!5m2!1sen!2sng"
  },
  {
    city: "Abuja",
    address: "Plot 104 Emmanuel Adiele Street, off Mike Akhigbe Way, Jabi, Abuja, Nigeria",
    phone: "+234 816 455 7306",
    email: "abuja@peer2learn.com",
    hours: "Mon-Fri: 8am - 6pm, Sat: 10am - 4pm",
    coordinates: "9.0579,7.4895", // Jabi coordinates
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.287654321!2d7.4895!3d9.0579!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0b5b7e8b1e8b%3A0x6b8f7e9c8e4b9a!2sJabi%2C%20Abuja!5e0!3m2!1sen!2sng!4v1635447891234!5m2!1sen!2sng"
  }
];

export default function Contact() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [selectedLocation, setSelectedLocation] = useState(locations[0]);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [copySuccess, setCopySuccess] = useState('');


  return (
    <Box sx={{ 
      pt: { xs: 10, md: 14 }, 
      pb: { xs: 6, md: 10 },
      background: 'linear-gradient(180deg, #f5f5f5 0%, #ffffff 100%)'
    }}>
      <Container maxWidth="lg">
        
        {/* Enhanced Header */}
        <Box textAlign="center" mb={8}>
          <Chip 
            label="Get in Touch" 
            color="primary" 
            sx={{ mb: 2, fontWeight: 600 }}
          />
          <Typography 
            variant="h2" 
            fontWeight={800} 
            gutterBottom
            sx={{
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(45deg, #1976d2, #9c27b0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Contact Us
          </Typography>
          <Typography variant="h6" color="text.secondary" maxWidth="600px" mx="auto">
            We're here to help! Whether you have questions about tutoring, 
            need technical support, or want to partner with us, reach out anytime.
          </Typography>
        </Box>

        {/* Quick Contact Cards */}
        <Grid container spacing={4} mb={8} alignItems="stretch">
            {/* Contact Info Card */}
            <Grid item xs={12} md={5}>
                <Card
                elevation={4}
                sx={{
                    height: "100%",
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                }}
                >
                <CardContent sx={{ flex: 1 }}>
                    <Typography variant="h6" fontWeight={600} mb={2}>
                    Contact Information
                    </Typography>

                    <Typography sx={{ mb: 1 }}>
                    <strong>Email:</strong> support@peer2learn.com
                    </Typography>

                    <Typography sx={{ mb: 1 }}>
                    <strong>Phone:</strong> +234 816 455 7305
                    </Typography>

                    <Typography sx={{ mb: 1 }}>
                    <strong>Address (Lagos):</strong> <br />
                    No 38 Opebi Road, Ikeja, Lagos.
                    </Typography>

                    <Typography>
                    <strong>Address (Abuja):</strong> <br />
                    Plot 104 Emmanuel Adiele Street, off Mike Akhigbe Way,
                    <br />
                    Jabi, Abuja.
                    </Typography>
                </CardContent>
                </Card>
            </Grid>

            {/* Map Card */}
            <Grid item xs={12} md={7}>
                <Card
                elevation={4}
                sx={{
                    height: "500px",
                    width: {md: "650px"},
                    borderRadius: 3,
                    display: "flex",
                    flexDirection: "column",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    overflow: "hidden",
                }}
                >
                {/* Location Switcher */}
                <Box
                    sx={{
                    display: "flex",
                    p: 2,
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    gap: 1,
                    }}
                >
                    {locations.map((loc) => (
                    <Button
                        key={loc.city}
                        variant={selectedLocation.city === loc.city ? "contained" : "outlined"}
                        onClick={() => setSelectedLocation(loc)}
                        sx={{ flex: isMobile ? 1 : "auto" }}
                    >
                        {loc.city}
                    </Button>
                    ))}
                </Box>

                {/* Map */}
                <Box sx={{ position: "relative", flex: 1 }}>
                    <iframe
                    title={`Peer2Learn ${selectedLocation.city}`}
                    src={selectedLocation.mapEmbed}
                    width="100%"
                    height="100%"
                    style={{ border: 0, display: "block" }}
                    loading="lazy"
                    allowFullScreen
                    />

                    {/* Location Details Overlay */}
                    <Paper
                    elevation={3}
                    sx={{
                        position: "absolute",
                        bottom: 16,
                        left: 16,
                        right: 16,
                        p: 2,
                        backgroundColor: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(5px)",
                        borderRadius: 2,
                    }}
                    >
                    <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                        <LocationOnIcon color="primary" />
                        <Typography variant="subtitle1" fontWeight={600}>
                        {selectedLocation.city}
                        </Typography>
                    </Stack>
                    <Typography variant="body2" paragraph>
                        {selectedLocation.address}
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" display="block">
                            Phone
                        </Typography>
                        <Typography variant="body2">{selectedLocation.phone}</Typography>
                        </Grid>
                        <Grid item xs={6}>
                        <Typography variant="caption" color="text.secondary" display="block">
                            Hours
                        </Typography>
                        <Typography variant="body2">{selectedLocation.hours}</Typography>
                        </Grid>
                    </Grid>
                    </Paper>
                </Box>
                </Card>
            </Grid>
            </Grid>

        {/* FAQ Section with Categories */}
        <Box mb={4}>
          <Typography variant="h4" fontWeight={700} mb={2} textAlign="center">
            Frequently Asked Questions
          </Typography>
          <Typography color="text.secondary" textAlign="center" mb={4}>
            Find quick answers to common questions about Peer2Learn
          </Typography>
          {/* FAQs */}
          {faqs.map((faq, index) => (
            <Accordion 
              key={faq.id} 
              sx={{ 
                mb: 1,
                '&:before': { display: 'none' },
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                  <Chip 
                    label={faq.category} 
                    size="small" 
                    variant="outlined"
                    sx={{ mr: 2 }}
                  />
                  <Typography fontWeight={600}>{faq.question}</Typography>
                </Box>
              </AccordionSummary>
              <AccordionDetails>
                <Divider sx={{ mb: 2 }} />
                <Typography color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>

        {/* Social Proof / Trust Indicators */}
        <Paper 
          elevation={0} 
          sx={{ 
            mt: 8, 
            p: 4, 
            textAlign: 'center',
            backgroundColor: 'primary.main',
            color: 'white',
            borderRadius: 4
          }}
        >
          <Typography variant="h5" gutterBottom fontWeight={600}>
            Still have questions?
          </Typography>
          <Typography paragraph>
            Our support team is ready to help you with any questions you might have.
          </Typography>
          <Button 
            variant="contained" 
            color="primary" 
            size="large"
            href="mailto:support@peer2learn.com"
          >
            Email Support Directly
          </Button>
        </Paper>

        {/* Snackbar for notifications */}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>

        {/* Copy success notification */}
        {copySuccess && (
          <Snackbar
            open={!!copySuccess}
            autoHideDuration={2000}
            onClose={() => setCopySuccess('')}
          >
            <Alert severity="success" sx={{ width: '100%' }}>
              {copySuccess}
            </Alert>
          </Snackbar>
        )}
      </Container>
    </Box>
  );
}