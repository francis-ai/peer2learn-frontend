import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tabs,
  Tab,
  Divider,
  TextField,
  Button,
  Avatar,
  Stack,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  InputAdornment,
  IconButton
} from '@mui/material';
import {
  Person as ProfileIcon,
  Palette as BrandingIcon,
  Help as FaqIcon,
  Lock as SecurityIcon,
  ExpandMore as ExpandMoreIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Upload as UploadIcon
} from '@mui/icons-material';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Settings() {
  const [tabValue, setTabValue] = useState(0);
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    phone: '+2348012345678',
    avatar: 'AU'
  });
  const [branding, setBranding] = useState({
    companyName: 'EduPlatform',
    primaryColor: '#1976d2',
    secondaryColor: '#ff5722',
    logo: '',
    favicon: ''
  });
  const [faqs, setFaqs] = useState([
    { id: 1, question: 'How do I reset my password?', answer: 'Go to the login page and click "Forgot Password".' },
    { id: 2, question: 'How can I contact support?', answer: 'Email us at support@eduplatform.com or call +2348012345678.' }
  ]);
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleBrandingChange = (e) => {
    const { name, value } = e.target;
    setBranding(prev => ({ ...prev, [name]: value }));
  };

  const handleAddFaq = () => {
    if (newFaq.question && newFaq.answer) {
      setFaqs([...faqs, { ...newFaq, id: Date.now() }]);
      setNewFaq({ question: '', answer: '' });
    }
  };

  const handleDeleteFaq = (id) => {
    setFaqs(faqs.filter(faq => faq.id !== id));
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBranding(prev => ({ ...prev, [type]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        System Settings
      </Typography>

      <Card>
        <CardContent sx={{ p: 0 }}>
          <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
            <Tab label="Profile" icon={<ProfileIcon />} />
            <Tab label="Branding" icon={<BrandingIcon />} />
            <Tab label="FAQs" icon={<FaqIcon />} />
            <Tab label="Security" icon={<SecurityIcon />} />
          </Tabs>
          <Divider />

          <TabPanel value={tabValue} index={0}>
            <Stack spacing={3} sx={{ maxWidth: 600 }}>
              <Stack direction="row" spacing={3} alignItems="center">
                <Avatar sx={{ width: 80, height: 80, fontSize: 32 }}>{profile.avatar}</Avatar>
                <Button variant="outlined" startIcon={<UploadIcon />}>
                  Upload Photo
                </Button>
              </Stack>

              <TextField
                fullWidth
                label="Full Name"
                name="name"
                value={profile.name}
                onChange={handleProfileChange}
              />

              <TextField
                fullWidth
                label="Email"
                name="email"
                value={profile.email}
                onChange={handleProfileChange}
                type="email"
              />

              <TextField
                fullWidth
                label="Phone Number"
                name="phone"
                value={profile.phone}
                onChange={handleProfileChange}
              />

              <Button variant="contained" sx={{ alignSelf: 'flex-start' }}>
                Save Profile
              </Button>
            </Stack>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Stack spacing={3} sx={{ maxWidth: 600 }}>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={branding.companyName}
                onChange={handleBrandingChange}
              />

              <Stack direction="row" spacing={2} alignItems="center">
                <Box>
                  <Typography variant="body2" gutterBottom>Company Logo</Typography>
                  <Button variant="outlined" component="label" startIcon={<UploadIcon />}>
                    Upload Logo
                    <input type="file" hidden onChange={(e) => handleFileUpload(e, 'logo')} />
                  </Button>
                </Box>
                {branding.logo && (
                  <Avatar src={branding.logo} variant="square" sx={{ width: 60, height: 60 }} />
                )}
              </Stack>

              <Button variant="contained" sx={{ alignSelf: 'flex-start' }}>
                Save Branding
              </Button>
            </Stack>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Stack spacing={3}>
              {faqs.map((faq) => (
                <Accordion key={faq.id}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography sx={{ flexGrow: 1 }}>{faq.question}</Typography>
                    <IconButton onClick={(e) => { e.stopPropagation(); handleDeleteFaq(faq.id); }}>
                      <DeleteIcon color="error" />
                    </IconButton>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{faq.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}

              <Divider sx={{ my: 2 }} />

              <Typography variant="h6">Add New FAQ</Typography>
              <TextField
                fullWidth
                label="Question"
                value={newFaq.question}
                onChange={(e) => setNewFaq({ ...newFaq, question: e.target.value })}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                label="Answer"
                value={newFaq.answer}
                onChange={(e) => setNewFaq({ ...newFaq, answer: e.target.value })}
                multiline
                rows={3}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddFaq}
                disabled={!newFaq.question || !newFaq.answer}
              >
                Add FAQ
              </Button>
            </Stack>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Stack spacing={3} sx={{ maxWidth: 600 }}>
              <Typography variant="h6">Change Password</Typography>
              <TextField
                fullWidth
                label="Current Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                label="New Password"
                type={showPassword ? 'text' : 'password'}
              />
              <TextField
                fullWidth
                label="Confirm New Password"
                type={showPassword ? 'text' : 'password'}
              />
              <Button variant="contained">
                Update Password
              </Button>
  
            </Stack>
          </TabPanel>
        </CardContent>
      </Card>
    </Box>
  );
}