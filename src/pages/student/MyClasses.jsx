import { useState } from 'react';
import {
  Box,
  Grid,
  Tab,
  Tabs,
  Typography,
  Button
} from '@mui/material';
import {
  Add as AddIcon  
} from '@mui/icons-material';
import CurrentCourse from '../../components/dashboard/CurrentCourse';
import CompletedCourses from '../../components/dashboard/CompletedCourse'; // Updated filename to match
import CertificateModal from '../../components/dashboard/CertificateModal';
import { useNavigate } from 'react-router-dom';

const MyClasses = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [openCertificateModal, setOpenCertificateModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleDownloadCertificate = (course) => {
    setSelectedCourse(course);
    setOpenCertificateModal(true);
  };

  const generateCertificate = () => {
    if (!selectedCourse) return;

    const link = document.createElement('a');
    link.href = '/sample-certificate.pdf'; // Replace this with dynamic backend URL later
    link.download = `Certificate_${selectedCourse.title.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setOpenCertificateModal(false);
  };

  return (
    <Box
      sx={{
        p: { xs: 2, md: 3 },
        mt: { xs: 8, md: 12 },
        mx: 'auto',
        maxWidth: '1000px'
      }}
    >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          mb: 2
        }}
      >
        <Typography
          variant="h4"
          sx={{ fontSize: { xs: '1.5rem', md: '2rem' } }}
        >
          My Classes
        </Typography>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate('/enroll')}
          sx={{ ml: 2 }}
        >
          Enroll in Course
        </Button>
      </Box>

      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        textColor="primary"
        indicatorColor="primary"
        variant="fullWidth"
        sx={{ mb: 3 }}
      >
        <Tab
          label="Current Courses"
          sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, px: 2 }}
        />
        <Tab
          label="Completed Courses"
          sx={{ fontSize: { xs: '0.8rem', sm: '0.9rem' }, px: 2 }}
        />
      </Tabs>

      {activeTab === 0 ? (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CurrentCourse />
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <CompletedCourses onDownloadCertificate={handleDownloadCertificate} />
          </Grid>
        </Grid>
      )}

      <CertificateModal
        open={openCertificateModal}
        onClose={() => setOpenCertificateModal(false)}
        course={selectedCourse}
        onDownload={generateCertificate}
      />
    </Box>
  );
};

export default MyClasses;
