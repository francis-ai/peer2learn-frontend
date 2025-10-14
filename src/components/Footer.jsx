import { Box, Typography, Grid, Link, Divider, IconButton, styled, Container, alpha } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';
import Logo from '../assets/images/peer2learn.png';

export default function Footer() {
  return (
    <FooterContainer>
      <FooterContent>
        {/* Main Footer Content */}
        <Grid container spacing={4}>
          {/* Column 1 - About */}
          <Grid item xs={12} md={3} sx={{ textAlign: "left" }}>
            <img 
              src={Logo} 
              alt="Logo" 
              style={{ height: "70px", objectFit: "contain" }} 
            />
            <FooterText>
              Connecting students with top tutors for <br></br>effective peer-to-peer learning in managed locations.
            </FooterText>
          </Grid>


          {/* Column 4 - Contact */}
          <Grid item xs={12} md={3}>
            <FooterHeading>Contact Us</FooterHeading>
            <FooterText>
              <strong>Email:</strong> support@peer2learn.com
            </FooterText>
            <FooterText>
              <strong>Phone:</strong> +234 816 455 7305
            </FooterText>
            <FooterText>
              <strong>Address(Lagos):</strong> No 38 Opebi road, Ikeja, Lagos.
            </FooterText>
            <FooterText>
              <strong>Address(Abuja):</strong> Plot 104 Emmanuel Adiele Street, off Mike Akhigbe Way, Jabi, Abuja.
            </FooterText>
          </Grid>

          {/* Column 5 - Social */}
          <Grid item xs={12} md={2}>
            <FooterHeading>Follow Us</FooterHeading>
            <SocialContainer>
              <SocialIcon aria-label="Facebook">
                <Facebook fontSize="small" />
              </SocialIcon>
              <SocialIcon aria-label="Twitter">
                <Twitter fontSize="small" />
              </SocialIcon>
              <SocialIcon aria-label="Instagram">
                <Instagram fontSize="small" />
              </SocialIcon>
              <SocialIcon aria-label="LinkedIn">
                <LinkedIn fontSize="small" />
              </SocialIcon>
            </SocialContainer>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: 'divider' }} />

        {/* Copyright Section */}
        <CopyrightContainer>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Edmoss. All rights reserved.
          </Typography>
          <LegalLinks>
            <FooterLink href="faqs">Faqs</FooterLink>
            <FooterLink href="privacy">Privacy Policy</FooterLink>
            <FooterLink href="terms">Terms of Service</FooterLink>
            <FooterLink href="help">Help Center</FooterLink>
          </LegalLinks>
        </CopyrightContainer>
      </FooterContent>
    </FooterContainer>
  );
};

// Styled Components
const FooterContainer = styled('footer')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  padding: theme.spacing(6, 0),
  borderTop: `1px solid ${theme.palette.divider}`,
}));

const FooterContent = styled(Container)(({ theme }) => ({
  maxWidth: '1200px',
  margin: '0 auto',
}));

const FooterHeading = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  marginBottom: theme.spacing(2),
  fontSize: '1rem',
  color: theme.palette.text.primary,
}));

const FooterText = styled(Typography)(({ theme }) => ({
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  lineHeight: 1.6,
}));

const FooterLink = styled(Link)(({ theme }) => ({
  display: 'block',
  fontSize: '0.875rem',
  color: theme.palette.text.secondary,
  marginBottom: theme.spacing(1),
  textDecoration: 'none',
  transition: 'color 0.2s ease',
  '&:hover': {
    color: theme.palette.primary.main,
  },
}));

const SocialContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(1),
  marginBottom: theme.spacing(2),
}));

const SocialIcon = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  backgroundColor: alpha(theme.palette.text.secondary, 0.1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.1),
    color: theme.palette.primary.main,
  },
  width: 32,
  height: 32,
}));

const CopyrightContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  [theme.breakpoints.up('sm')]: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
}));

const LegalLinks = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  marginTop: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    marginTop: 0,
  },
}));