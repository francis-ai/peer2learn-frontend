// src/pages/public/Home.jsx
import React from 'react';
import Hero from '../../components/Hero';
import Services from '../../components/Services';
import Testimonials from '../../components/Testimonials';
import CTAsection from '../../components/CTAsection';
import Announcement from '../../components/Announcement';
import VideoPlayer from '../../components/VideoPlayer';
import { Box } from '@mui/material';


export default function Home() {
  return (
    <Box sx={{ m: -1}}>
      <Hero />
      <Announcement/>
      <Services />
      <VideoPlayer />
      <Testimonials />
      <CTAsection />
    </Box>
  );
}
