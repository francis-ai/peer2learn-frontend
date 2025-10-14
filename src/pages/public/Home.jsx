// src/pages/public/Home.jsx
import React from 'react';
import Hero from '../../components/Hero';
import Services from '../../components/Services';
import Testimonials from '../../components/Testimonials';
import CTAsection from '../../components/CTAsection';
import Announcement from '../../components/Announcement';
import VideoPlayer from '../../components/VideoPlayer';
import { Box } from '@mui/material';
import CohubShowcase from '../../components/Cohub';
import TutorShowcase from '../../components/TutorCards';
import Category from '../../components/Category';


export default function Home() {
  return (
    <Box sx={{ m: -1}}>
      <Hero />
      <Announcement/>
      <Services />
      <Category />
      <VideoPlayer />
      <TutorShowcase />
      <CohubShowcase />
      <Testimonials />
      <CTAsection />
    </Box>
  );
}
