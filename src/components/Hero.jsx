import {
  Box,
  Typography,
  Grid,
  Container,
  Button,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/studentAuthContext';

export default function Hero() {
  const { student } = useAuth();
  const navigate = useNavigate();

  const handleEnrollClick = () => {
    navigate(student ? '/enroll' : '/login');
  };

  return (
    <HeroContainer>
      <Container maxWidth="lg">
        <Grid container justifyContent="center">
          <Grid item xs={12} md={8} sx={{ textAlign: 'center', px: { xs: 2, sm: 0 } }}>
            {/* ✅ Badges */}
            <BadgeContainer sx={{ mt: { xs: 10, md: 4 } }}>
              <PillBadge>ONLINE CLASSES</PillBadge>
              <PillBadge sx={{ ml: 1.5 }}>ON-SITE CLASSES</PillBadge>
            </BadgeContainer>

            {/* ✅ Heading */}
            <MainHeading variant="h1" sx={{ fontSize: { xs: '2rem', sm: '3.5rem' } }}>
              Peer With a Tutor, <br />
              Progress With a Plan.
            </MainHeading>

            {/* ✅ Button */}
            <Button
              size="large"
              onClick={handleEnrollClick}
              sx={{
                mt: 4,
                background: 'linear-gradient(90deg, #3a86ff, #4361ee)',
                color: '#fff',
                fontWeight: 700,
                fontSize: '1.1rem',
                borderRadius: '30px',
                px: 5,
                py: 1.5,
                textTransform: 'uppercase',
                boxShadow: '0 4px 15px rgba(58, 134, 255, 0.3)',
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'linear-gradient(90deg, #4361ee, #3a86ff)',
                  boxShadow: '0 6px 20px rgba(58, 134, 255, 0.4)',
                },
              }}
            >
              Enroll Now
            </Button>
          </Grid>
        </Grid>
      </Container>
    </HeroContainer>
  );
}

// ✅ Styled Components
const HeroContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(10, 0), // ✅ Balanced padding
  background: `url(${require('../assets/images/peer2learn.gif')}) no-repeat center center`,
  backgroundSize: 'cover',
  textAlign: 'center',
  overflowX: 'hidden', // ✅ prevents horizontal scrolling
  width: '100%',
  maxWidth: '100vw', // ✅ ensures it never exceeds viewport
  height: '93.5vh',
  boxSizing: 'border-box',
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(18, 2), // ✅ reduced from 30 to 18, narrower sides
  },
}));

const BadgeContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: theme.spacing(1),
}));

const PillBadge = styled(Box)(({ theme }) => ({
  display: 'inline-block',
  background: 'linear-gradient(90deg, #3a86ff, #4361ee)',
  color: 'white',
  padding: theme.spacing(0.75, 2.5),
  borderRadius: '20px',
  fontSize: '0.75rem',
  fontWeight: 700,
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
  boxShadow: '0 2px 8px rgba(58, 134, 255, 0.2)',
}));

const MainHeading = styled(Typography)(({ theme }) => ({
  fontSize: '3.2rem',
  fontWeight: 800,
  lineHeight: 1.2,
  marginBottom: theme.spacing(5),
  color: '#1a237e',
  letterSpacing: '-0.5px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '2rem',
  },
}));
