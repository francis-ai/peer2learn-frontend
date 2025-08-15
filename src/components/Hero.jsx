import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Container,
  MenuItem,
  Snackbar,
  Button,
  TextField
} from '@mui/material';
import { styled } from '@mui/material/styles'; 
import SearchIcon from '@mui/icons-material/Search';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/studentAuthContext';


const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Hero() {
  const { student } = useAuth();
  const navigate = useNavigate();

  const [courses, setCourses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);

  useEffect(() => {
    const fetchCoursesAndLocations = async () => {
      try {
        const [courseRes, locationRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/view/courses`),
          axios.get(`${BASE_URL}/api/view/locations`)
        ]);
        setCourses(courseRes.data);
        setLocations(locationRes.data);
      } catch (error) {
        console.error('Error fetching courses or locations:', error);
      }
    };

    fetchCoursesAndLocations();
  }, []);

  const handleSearch = () => {
    if (!student) {
      setOpenSnackbar(true);
        setTimeout(() => {
        navigate('/login');
      }, 2000); 
    } else {
      navigate('/enroll', {
        state: {
          course: selectedCourse,
          location: selectedLocation,
          step: 2,
        },
      });
    }
  };

  return (
    <HeroContainer sx={{ m: -1 }}>
      <Container>
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8} sx={{ textAlign: 'center' }}>
            <BadgeContainer>
              <PillBadge sx={{ fontSize: { xs: '10px' } }}>ONLINE CLASSES</PillBadge>
              <PillBadge sx={{ ml: 2, fontSize: { xs: '10px' } }}>ON-SITE CLASSES</PillBadge>
            </BadgeContainer>

            <MainHeading variant="h1" sx={{ fontSize: { xs: '2rem', sm: '4rem' } }}>
              Peer With a Tutor, <br />
              Progress With a Plan.
            </MainHeading>

            <SearchContainer>
              <Box
                sx={{
                  display: 'flex',
                  width: '100%',
                  maxWidth: '700px',
                  margin: '0 auto',
                  position: 'relative',
                }}
              >
                {/* Course Select */}
                <StyledSelect
                  select
                  fullWidth
                  label="Course" // ✅ label prop here
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '20px 0 0 20px',
                      borderRight: 'none',
                      width: { sm: '280px', xs: 'auto' },
                    },
                  }}
                >
                  {courses.map((course) => (
                    <MenuItem key={course.id} value={course.id}>
                      {course.name}
                    </MenuItem>
                  ))}
                </StyledSelect>

                {/* Location Select */}
                <StyledSelect
                  select
                  fullWidth
                  label="Location"
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  variant="outlined"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 0,
                      borderLeft: 'none',
                      borderRight: 'none',
                      width: { sm: '280px', xs: 'auto' },
                    },
                  }}
                >
                  {locations.map((loc) => (
                    <MenuItem key={loc.id} value={loc.location_name}>
                      {loc.location_name}
                    </MenuItem>
                  ))}
                </StyledSelect>

                {/* Search Button */}
                <SearchButton variant="contained" onClick={handleSearch}>
                  <SearchIcon sx={{ fontSize: '1.5rem' }} />
                  <Typography variant="button" sx={{ ml: 1, display: { xs: 'none', sm: 'block' } }}>
                    Enroll
                  </Typography>
                </SearchButton>
              </Box>
            </SearchContainer>
          </Grid>
        </Grid>
      </Container>

      {/* Snackbar */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={3000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert
          onClose={() => setOpenSnackbar(false)}
          severity="warning"
          sx={{ width: '100%' }}
        >
          Please login or register to enroll for a course.
        </MuiAlert>
      </Snackbar>
    </HeroContainer>
  );
}


// Styled Components
const HeroContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0),
  backgroundImage: `url(${require('../assets/images/bg.jpg')})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  textAlign: 'center',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(30, 5),
  },
  margin: 0,
}));

const BadgeContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  justifyContent: 'center',
}));

const PillBadge = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  background: 'linear-gradient(90deg, #3a86ff, #4361ee)',
  color: 'white',
  padding: theme.spacing(0.75, 2.5),
  borderRadius: '20px',
  fontSize: '1.2rem',
  fontWeight: 800,
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  boxShadow: '0 2px 8px rgba(58, 134, 255, 0.2)',
}));

const MainHeading = styled(Typography)(({ theme }) => ({
  fontSize: '4rem',
  fontWeight: 800,
  lineHeight: 1.1,
  marginBottom: theme.spacing(5),
  color: '#1a237e',
  letterSpacing: '-0.5px',
  [theme.breakpoints.up('md')]: {
    fontSize: '3.5rem',
  },
}));

const SearchContainer = styled(Box)(({ theme }) => ({
  margin: '0 auto',
  maxWidth: '800px',
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  border: '1px solid rgba(0,0,0,0.05)',
}));

const StyledSelect = styled(TextField)(({ theme }) => ({
  '& .MuiInputLabel-root': {
    fontSize: '0.9rem',
    color: theme.palette.text.secondary,
  },
  '& .MuiOutlinedInput-root': {
    height: '56px',
    backgroundColor: '#f8f9fa',
    '& fieldset': {
      borderColor: 'rgba(0,0,0,0.1)',
      transition: 'all 0.3s ease',
    },
    '&:hover fieldset': {
      borderColor: theme.palette.primary.light,
    },
    '&.Mui-focused fieldset': {
      borderColor: theme.palette.primary.main,
      boxShadow: '0 0 0 2px rgba(58, 134, 255, 0.2)',
    },
  },
  '& .MuiSelect-select': {
    padding: theme.spacing(1.5, 2),
  },
}));


const SearchButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  background: 'linear-gradient(90deg, #3a86ff, #4361ee)',
  color: 'white',
  padding: theme.spacing(0, 3),
  borderRadius: '0 20px 20px 0',
  height: '56px',
  minWidth: 'auto',
  '&:hover': {
    background: 'linear-gradient(90deg, #4361ee, #3a0ca3)',
    transform: 'none',
  },
  transition: 'all 0.3s ease',
}));