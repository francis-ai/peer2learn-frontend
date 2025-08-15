import { Box, Typography, Button, Container, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function CTASection() {
  const theme = useTheme();

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true
    });
  }, []);

  return (
    <Box 
      component="section" 
      sx={{ 
        py: 12,
        background: 'linear-gradient(135deg, #3a86ff 0%, #4361ee 100%)',
        color: 'white',
        position: 'relative',
        overflow: 'hidden'
      }}
      id="cta"
    >
      <Container maxWidth="lg">
        <Box 
          sx={{ 
            textAlign: 'center',
            position: 'relative',
            zIndex: 1
          }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800,
              mb: 3,
              [theme.breakpoints.down('sm')]: {
                fontSize: '2rem'
              }
            }}
            data-aos="fade-down"
          >
            Ready to Transform Your Learning?
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 400,
              mb: 4,
              maxWidth: '700px',
              mx: 'auto',
              opacity: 0.9
            }}
            data-aos="fade-down"
            data-aos-delay="100"
          >
            Join thousands of students accelerating their skills with personalized peer tutoring
          </Typography>
          <Box 
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: 2,
              [theme.breakpoints.down('sm')]: {
                flexDirection: 'column',
                alignItems: 'center'
              }
            }}
          >
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-aos="zoom-in"
              data-aos-delay="200"
            >
              <Button
                variant="contained"
                component={Link}
                to='/register'
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  backgroundColor: 'white',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: 'white',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
                  }
                }}
              >
                Find Your Tutor
              </Button>
            </motion.div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              data-aos="zoom-in"
              data-aos-delay="300"
            >
              <Button
                component={Link}
                to='/tutor/register'
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: '12px',
                  fontSize: '1rem',
                  fontWeight: 600,
                  border: '2px solid white',
                  color: 'white',
                  '&:hover': {
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '2px solid white'
                  }
                }}
              >
                Become a Tutor
              </Button>
            </motion.div>
          </Box>
        </Box>
      </Container>
      
      {/* Decorative elements */}
      <Box 
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.1)'
        }}
      />
      <Box 
        sx={{
          position: 'absolute',
          bottom: -150,
          left: -150,
          width: 400,
          height: 400,
          borderRadius: '50%',
          backgroundColor: 'rgba(255,255,255,0.08)'
        }}
      />
    </Box>
  );
};