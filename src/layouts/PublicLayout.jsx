// src/layouts/PublicLayout.jsx
import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import WhatsAppWidget from "../components/FloatingButton";
import { Box } from '@mui/material';

const PublicLayout = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <Box>{children}</Box>
      <WhatsAppWidget />
      <Footer />
    </Box>
  );
};

export default PublicLayout;
