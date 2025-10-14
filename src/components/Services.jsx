import { Box, Typography, Grid, Container, useTheme } from '@mui/material';
import { 
  PeopleAlt, 
  Payments, 
  LocationOn, 
  VerifiedUser, 
  TrendingUp, 
  Devices 
} from '@mui/icons-material';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

const Services = () => {
  const theme = useTheme();

  useEffect(() => {
    AOS.init({
      duration: 800,
      easing: 'ease-in-out',
      once: true
    });
  }, []);

  const services = [
    {
      title: "Peer-to-Peer Learning",
      description: "Connect students with tutors based on experience and expertise.",
      icon: <PeopleAlt sx={{ fontSize: 50 }} />,
      color: "#3a86ff",
      animation: "fade-up"
    },
    {
      title: "Flexible Installment Payments",
      description: "Pay for classes in parts — starting from as low as ₦80,000.",
      icon: <Payments sx={{ fontSize: 50 }} />,
      color: "#4361ee",
      animation: "fade-up",
      delay: 100
    },
    {
      title: "Onsite & Physical Training",
      description: "Learn in co-working spaces across multiple locations.",
      icon: <LocationOn sx={{ fontSize: 50 }} />,
      color: "#4895ef",
      animation: "fade-up",
      delay: 200
    },
    {
      title: "Verified Tutors",
      description: "Tutors are vetted and rated by students for quality.",
      icon: <VerifiedUser sx={{ fontSize: 50 }} />,
      color: "#4cc9f0",
      animation: "fade-up",
      delay: 300
    },
    {
      title: "Trackable Progress",
      description: "Students can track their classes, payments, and tutors.",
      icon: <TrendingUp sx={{ fontSize: 50 }} />,
      color: "#560bad",
      animation: "fade-up",
      delay: 400
    },
    {
      title: "Multi-Device Access",
      description: "Browse and enroll easily on mobile or desktop.",
      icon: <Devices sx={{ fontSize: 50 }} />,
      color: "#7209b7",
      animation: "fade-up",
      delay: 500
    }
  ];

  return (
    <Box 
      component="section" 
      sx={{ 
        py: 10,
        backgroundColor: '#f8f9fa'
      }}
      id="services"
    >
      <Container maxWidth="lg">
        <Typography 
          variant="h2" 
          sx={{
            fontSize: '2.5rem',
            fontWeight: 700,
            textAlign: 'center',
            mb: 2,
            color: theme.palette.text.primary,
          }}
          data-aos="fade-down"
        >
          Our Services
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{
            fontSize: '1.1rem',
            textAlign: 'center',
            mb: 6,
            color: '#64748b'
          }}
          data-aos="fade-down"
          data-aos-delay="100"
        >
          Everything you need to learn effectively
        </Typography>
        
        <Grid container spacing={3}>
          {services.map((service, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              key={index}
              data-aos={service.animation}
              data-aos-delay={service.delay}
            >
              <Box
                sx={{
                  backgroundColor: 'white',
                  borderRadius: '12px',
                  p: 3,
                  height: '85%',
                  mx: 'auto',
                  width: {
                    xs: '80%',
                    sm: '320px'
                  },
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  '&:hover': {
                    transform: 'translateY(-10px)',
                    boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
                  },
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center'
                }}
              >
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: '50%',
                    backgroundColor: `${service.color}20`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mb: 3,
                    color: service.color
                  }}
                >
                  {service.icon}
                </Box>
                <Typography 
                  variant="h5" 
                  sx={{
                    fontWeight: 600,
                    mb: 2,
                    color: '#1e293b'
                  }}
                >
                  {service.title}
                </Typography>
                <Typography 
                  variant="body1" 
                  sx={{
                    color: '#64748b',
                    lineHeight: 1.6
                  }}
                >
                  {service.description}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Services;