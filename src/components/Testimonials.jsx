import { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Avatar, 
  Container, 
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Star, FormatQuote, ArrowBack, ArrowForward } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import AOS from 'aos';
import 'aos/dist/aos.css';

const testimonials = [
  {
    id: 1,
    name: "Tolu Adebayo",
    role: "Student, Computer Science",
    content: "Edmoss helped me find the perfect tutor for my programming needs. The flexible payment options made it affordable!",
    rating: 5,
    avatar: "/images/tolu.jpg"
  },
  {
    id: 2,
    name: "Chinedu Okafor",
    role: "UI/UX Designer",
    content: "The peer-to-peer learning model is revolutionary. I've improved my design skills faster than I thought possible.",
    rating: 4,
    avatar: "/images/chinedu.jpg"
  },
  {
    id: 3,
    name: "Amina Mohammed",
    role: "Data Analyst",
    content: "Being able to learn in physical locations made all the difference. The community aspect is incredible.",
    rating: 5,
    avatar: "/images/amina.jpg"
  }
];

const Testimonials = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true
    });
  }, []);

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === testimonials.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? testimonials.length - 1 : prevIndex - 1
    );
  };

  return (
    <Box 
      component="section" 
      sx={{ 
        py: 10,
        backgroundColor: '#f8f9fa',
        position: 'relative',
        overflow: 'hidden'
      }}
      id="testimonials"
    >
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 800,
              mb: 2,
              color: theme.palette.text.primary,
              [theme.breakpoints.down('sm')]: {
                fontSize: '1.5rem'
              }
            }}
            data-aos="fade-down"
          >
            What Our Students Say
          </Typography>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              color: theme.palette.text.secondary,
              maxWidth: '600px',
              mx: 'auto'
            }}
            data-aos="fade-down"
            data-aos-delay="100"
          >
            Hear from learners who transformed their skills with Edmoss peer tutoring
          </Typography>
        </Box>

        {isMobile ? (
          <Box sx={{ position: 'relative', minHeight: '350px' }}>
            <AnimatePresence mode='wait'>
              <motion.div
                key={testimonials[currentIndex].id}
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center'
                }}
              >
                <TestimonialCard 
                  testimonial={testimonials[currentIndex]} 
                  theme={theme} 
                  sx={{ mx: 'auto' }}
                />
              </motion.div>
            </AnimatePresence>

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 4,
              gap: 2
            }}>
              <IconButton 
                onClick={prevTestimonial}
                sx={{ 
                  backgroundColor: 'white',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: 'white'
                  }
                }}
              >
                <ArrowBack />
              </IconButton>
              <IconButton 
                onClick={nextTestimonial}
                sx={{ 
                  backgroundColor: 'white',
                  boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                  '&:hover': {
                    backgroundColor: 'white'
                  }
                }}
              >
                <ArrowForward />
              </IconButton>
            </Box>
          </Box>
        ) : (
          <Box 
            sx={{ 
              display: 'flex',
              justifyContent: 'center',
              gap: 4,
              flexWrap: 'wrap'
            }}
          >
            {testimonials.map((testimonial) => (
              <motion.div
                key={testimonial.id}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.3 }}
                data-aos="fade-up"
                style={{ width: 'calc(33% - 32px)', minWidth: '300px' }}
              >
                <TestimonialCard testimonial={testimonial} theme={theme} />
              </motion.div>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};

const TestimonialCard = ({ testimonial, theme, ...props }) => (
  <Box
    sx={{
      backgroundColor: 'white',
      borderRadius: '16px',
      p: 4,
      pb: 1,
      height: '100%',
      boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
      position: 'relative',
      border: '1px solid rgba(0,0,0,0.03)',
      maxWidth: '380px',
      ...props.sx
    }}
  >
    <FormatQuote 
      sx={{ 
        fontSize: 60,
        color: theme.palette.primary.light,
        position: 'absolute',
        top: 20,
        right: 20,
        opacity: 0.2
      }} 
    />
    <Box sx={{ mb: 3 }}>
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i}
          sx={{ 
            color: i < testimonial.rating ? 
              theme.palette.primary.main : 
              theme.palette.divider,
            fontSize: 20
          }}
        />
      ))}
    </Box>
    <Typography 
      variant="body1" 
      sx={{ 
        mb: 3,
        fontStyle: 'italic',
        color: theme.palette.text.secondary,
        lineHeight: 1.7,
        fontSize: '1rem'
      }}
    >
      "{testimonial.content}"
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Avatar 
        src={testimonial.avatar} 
        sx={{ 
          width: 56, 
          height: 56,
          mr: 2,
          border: `2px solid ${theme.palette.primary.main}`
        }} 
      />
      <Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          {testimonial.name}
        </Typography>
        <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
          {testimonial.role}
        </Typography>
      </Box>
    </Box>
  </Box>
);

export default Testimonials;