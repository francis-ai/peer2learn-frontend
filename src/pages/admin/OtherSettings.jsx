import React, { useState } from 'react';
import {
  Box, Typography, Tabs, Tab
} from '@mui/material';
import LocationManagement from '../../components/admin/Location';

import Announcement from '../../components/admin/Announcement';
import Video from '../../components/admin/Video';
import Percentage from '../../components/admin/Percentage';

function TabPanel({ children, value, index }) {
  return (
    value === index && (
      <Box sx={{ mt: 3 }}>
        {children}
      </Box>
    )
  );
}

export default function OtherSettings() {
  const [tabIndex, setTabIndex] = useState(0);

  const handleTabChange = (event, newIndex) => {
    setTabIndex(newIndex);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', mb: 2 }}>
        Other System Settings
      </Typography>

      {/* Mini Navbar Tabs */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Locations" />
        <Tab label="Announcement" />
        <Tab label="iframe Video" />
        <Tab label="Percentage" />
        {/* Add more tabs as needed */}
      </Tabs>

      {/* Tab Contents */}
      <TabPanel value={tabIndex} index={0}>
        <LocationManagement />
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <Announcement />
      </TabPanel>
      <TabPanel value={tabIndex} index={2}>
        <Video />
      </TabPanel>
      <TabPanel value={tabIndex} index={3}>
        <Percentage />
      </TabPanel>
    </Box>
  );
}
