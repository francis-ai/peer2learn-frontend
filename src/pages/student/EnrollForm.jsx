import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Avatar,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import {
  ArrowBack,
  LocationOn,
  Computer,
  AttachMoney,
  CheckCircle
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/studentAuthContext';
// import { GoogleMap, Marker, LoadScript } from '@react-google-maps/api';

const BASE_URL = process.env.REACT_APP_BASE_URL;
// const PAYSTACK_PUBLIC_KEY = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY;

// Add map styles (you can customize these)
// const mapContainerStyle = {
//   width: '100%',
//   height: '400px',
//   borderRadius: '8px',
//   marginBottom: '20px'
// };

// Default map center (you might want to set this dynamically)
// const defaultCenter = {
//   lat: 9.0820,  // Default to Nigeria coordinates
//   lng: 8.6753
// };

export default function Enroll() {
  const navigate = useNavigate();
  const { student } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [courses, setCourses] = useState([]);
  const [locations, setLocations] = useState([]);
  const [tutorCourses, setTutorCourses] = useState([]);
  const [offices, setOffices] = useState([]);
  const [formData, setFormData] = useState({
    course: '',
    location: '',
    deliveryMethod: '',
    officeId: '',
    selectedTutor: null,
    paymentPlan: 'installment',
    termsAccepted: false
  });
  const [selectedTutorReviews, setSelectedTutorReviews] = useState([]);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [reviewTutorName, setReviewTutorName] = useState('');

  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [courseRes, locationRes, tutorCourseRes, officesRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/view/courses`),
          axios.get(`${BASE_URL}/api/view/locations`),
          axios.get(`${BASE_URL}/api/view/all-tutor-courses`),
          axios.get(`${BASE_URL}/api/view/offices`)
        ]);
        setCourses(courseRes.data);
        setLocations(locationRes.data);
        setTutorCourses(tutorCourseRes.data);
        setOffices(officesRes.data);
      } catch (err) {
        console.error('Error loading data:', err);
      }
    };
    fetchInitialData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleNext = () => {
    if (formData.deliveryMethod === 'onsite' && !formData.officeId) {
      alert('Please select your preferred Cohub location.');
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep(prev => prev - 1);
  const handleTutorSelect = (tutor) => {
    setFormData(prev => ({ ...prev, selectedTutor: tutor.id }));
  };

   const getAdjustedPrice = (price) => {
    return formData.deliveryMethod === 'online' ? Math.floor(price / 2) : price;
  };

  const selectedCourseObject = courses.find(c => c.id === formData.course);
  const filteredTutors = tutorCourses.filter(t =>
    selectedCourseObject?.name?.toLowerCase() === t.course_name?.toLowerCase() &&
    (formData.location === 'Online' || t.location?.toLowerCase() === formData.location?.toLowerCase())
  );

  const selectedTutorCourse = tutorCourses.find(t => t.tutor_course_id === formData.selectedTutor);
  const selectedCourse = selectedTutorCourse ? {
    name: selectedTutorCourse.course_name,
    price: selectedTutorCourse.price,
    originalPrice: selectedTutorCourse.price // Store original price
  } : null;

  const adjustedPrice = selectedCourse ? getAdjustedPrice(selectedCourse.price) : 0;
  
  // Apply discount for online sessions
  const installmentAmount = selectedCourse ? 
    (adjustedPrice < 80000 ? 
      Math.floor(adjustedPrice / 2) :  // If price < 80k, take half
      Math.max(80000, adjustedPrice * 0.3)  // Otherwise 30% with 80k minimum
    ) : 80000;
  
  const fullPaymentAmount = selectedCourse ? 
    getAdjustedPrice(selectedCourse.price) : 0;

  const steps = ['Course & Location', 'Delivery Method', 'Select Tutor', 'Payment'];

  const handleSubmit = async () => {
    try {
      // Step 1: Validate
      if (!formData.course || !formData.selectedTutor || !formData.paymentPlan || !formData.location || !formData.deliveryMethod) {
        setSnackbar({ open: true, message: 'Please complete all steps before payment.', severity: 'warning' });
        return;
      }

      const amount = formData.paymentPlan === 'installment' ? installmentAmount : fullPaymentAmount;

      if (!student || !student.email) {
        setSnackbar({ open: true, message: 'Student not authenticated.', severity: 'error' });
        return;
      }

      // Step 2: Generate unique reference (more descriptive)
      const ref = `ENROLL-${student.id}-${Date.now()}`;

      // Step 3: Trigger Paystack payment
      const handler = window.PaystackPop.setup({
        key: `pk_test_5624a1b37a80ce2f38d7d2da8e5d02a2a405d8de`,
        email: student.email,
        amount: Number(amount) * 100, // kobo
        currency: 'NGN',
        ref,
        callback: function (response) {
          // Step 4: Verify backend after successful payment
          axios.post(`${BASE_URL}/api/students/verify-course-enrollment`, {
            reference: response.reference,
            student_id: student.id,
            tutor_course_id: formData.selectedTutor,
            course_id: formData.course,
            location: formData.location,
            delivery_method: formData.deliveryMethod,
            payment_plan: formData.paymentPlan,
            office_id: formData.officeId || null,  // ✅ Add this line
            email: student.email,
            name: student.name
          })

          .then(() => {
            setSnackbar({ open: true, message: 'Enrollment & payment verified successfully!', severity: 'success' });
            setTimeout(() => navigate('/dashboard'), 2000);
          })
          .catch(error => {
            console.error('Payment verification error:', error);
            setSnackbar({ open: true, message: 'Payment verification failed. Contact support.', severity: 'error' });
          });
        },
        onClose: function () {
          setSnackbar({ open: true, message: 'Payment was cancelled.', severity: 'info' });
        }
      });

      handler.openIframe();
    } catch (err) {
      console.error('Unexpected error:', err);
      setSnackbar({ open: true, message: 'An unexpected error occurred.', severity: 'error' });
    }
  };

    // Filter offices by selected location
  const filteredOffices = offices.filter(office => 
    formData.location === 'Online' || 
    office.location?.toLowerCase() === formData.location?.toLowerCase()
  );

  // Function to handle marker click
  // const handleMarkerClick = (officeId) => {
  //   setFormData(prev => ({ ...prev, officeId }));
  // };

  // Function to get office coordinates (you'll need to store these in your office data)
  // const getOfficeCoordinates = (office) => {
  //   // You should store lat/lng in your office data
  //   // For now, returning default if not available
  //   return office.lat && office.lng 
  //     ? { lat: office.lat, lng: office.lng }
  //     : defaultCenter;
  // };


  const handleOpenReviews = (tutor) => {
    setSelectedTutorReviews(tutor.reviews);
    setReviewTutorName(tutor.tutor_name);
    setReviewModalOpen(true);
  };

  const handleCloseReviews = () => {
    setReviewModalOpen(false);
    setSelectedTutorReviews([]);
    setReviewTutorName('');
  };


  return (
    <Box sx={{ maxWidth: '800px', mx: 'auto', p: 3, mt: 12 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
        Back to Classes
      </Button>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map(label => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card elevation={3}>
        <CardContent>
         {activeStep === 0 && (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6} sx={{ width: { xs: '250px', md: '360px' }, mx: 'auto' }}>
                <FormControl fullWidth>
                  <InputLabel>Select Course</InputLabel>
                  <Select
                    name="course"
                    value={formData.course}
                    onChange={handleChange}
                    label="Select Course"
                    required
                  >
                    {courses.map(course => (
                      <MenuItem key={course.id} value={course.id}>
                        {course.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12} md={6} sx={{ width: { xs: '250px', md: '360px' }, mx: 'auto' }}>
                <FormControl fullWidth>
                  <InputLabel>Select Location</InputLabel>
                  <Select
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    label="Select Location"
                    required
                  >
                    {locations.map(loc => (
                      <MenuItem key={loc.id} value={loc.location_name}>
                        {loc.location_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          )}

          {activeStep === 1 && (
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" gutterBottom>
                How would you like to take this course?
              </Typography>
              <Grid container spacing={2} sx={{ mt: 3, display: 'flex', justifyContent: 'space-around' }}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant={formData.deliveryMethod === 'online' ? 'contained' : 'outlined'}
                    startIcon={<Computer />}
                    onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: 'online' }))}
                    sx={{ py: 3 }}
                  >
                    Online
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant={formData.deliveryMethod === 'onsite' ? 'contained' : 'outlined'}
                    startIcon={<LocationOn />}
                    onClick={() => setFormData(prev => ({ ...prev, deliveryMethod: 'onsite' }))}
                    sx={{ py: 3 }}
                    disabled={formData.location === 'Online'}
                  >
                    On-Site
                  </Button>
                </Grid>
                
              </Grid>
              {formData.deliveryMethod === 'onsite' && (
                <Box sx={{ mt: 4 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Select Your Nearest Cohub Location
                  </Typography>

                  {/* Add Google Map */}
                  {/* <LoadScript 
                    googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}
                    loadingElement={<div>Loading...</div>}
                    onError={(error) => console.error("Google Maps API loading error:", error)}
                  >
                    <GoogleMap
                      mapContainerStyle={mapContainerStyle}
                      center={filteredOffices.length > 0 ? 
                        getOfficeCoordinates(filteredOffices[0]) : 
                        defaultCenter}
                      zoom={12}
                    >
                      {filteredOffices.map(office => (
                        <Marker
                          key={office.id}
                          position={getOfficeCoordinates(office)}
                          onClick={() => handleMarkerClick(office.id)}
                          icon={{
                            url: formData.officeId === office.id ? 
                              'http://maps.google.com/mapfiles/ms/icons/red-dot.png' :
                              'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                            scaledSize: new window.google.maps.Size(32, 32)
                          }}
                        />
                      ))}
                    </GoogleMap>
                  </LoadScript> */}

                  <Grid container spacing={2}>
                    {filteredOffices.map((office) => {
                      const isSelected = formData.officeId === office.id;
                      return (
                        <Grid item xs={12} sm={6} md={4} key={office.id}>
                          <Card
                            onClick={() => setFormData(prev => ({
                              ...prev,
                              officeId: office.id
                            }))}
                            sx={{
                              p: 2,
                              cursor: 'pointer',
                              border: isSelected ? '2px solid #1976d2' : '1px solid #ddd',
                              boxShadow: isSelected ? 6 : 2,
                              transition: 'all 0.3s ease',
                              backgroundColor: isSelected ? '#e3f2fd' : '#fff',
                            }}
                          >
                            <CardContent>
                              <Typography variant="h6" gutterBottom>
                                {office.office_name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {office.address}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {office.location}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                📞 {office.phone_number}
                              </Typography>
                              {/* Add button to view on map */}
                              <Button 
                                size="small" 
                                sx={{ mt: 1 }}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // This would ideally center the map on this office
                                  // You'd need to implement mapRef and panTo functionality
                                }}
                              >
                                View on Map
                              </Button>
                            </CardContent>
                          </Card>
                        </Grid>
                      );
                    })}
                  </Grid>
                </Box>
              )}
            </Box>
          )}

          {activeStep === 2 && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Available Tutors
              </Typography>
              <Typography color="text.secondary" gutterBottom>
                {formData.location === 'Online'
                  ? 'Tutors available for online sessions (50% discount applied)'
                  : `Tutors in ${formData.location}`}
              </Typography>

              <Grid container spacing={2} sx={{ mt: 2 }}>
                {filteredTutors.length === 0 ? (
                  <Grid item xs={12}>
                    <Typography>No tutors available for this selection.</Typography>
                  </Grid>
                ) : (
                  filteredTutors.map((item) => {
                    const isSelected = formData.selectedTutor === item.tutor_course_id;
                    const displayPrice = formData.deliveryMethod === 'online' 
                      ? `${parseInt(item.price / 2).toLocaleString()} (50% off)`
                      : parseInt(item.price).toLocaleString();

                    return (
                      <Grid item xs={12} key={item.tutor_course_id}>
                        <Card
                          variant={isSelected ? 'elevation' : 'outlined'}
                          elevation={isSelected ? 3 : 0}
                          onClick={() =>
                            !item.is_occupied && handleTutorSelect({ id: item.tutor_course_id })
                          }
                          sx={{
                            p: 2,
                            cursor: item.is_occupied ? 'not-allowed' : 'pointer',
                            opacity: item.is_occupied ? 0.6 : 1,
                            borderColor: isSelected ? 'primary.main' : '',
                            '&:hover': {
                              borderColor: item.is_occupied ? '' : 'primary.main'
                            }
                          }}
                        >
                          <Box display="flex" alignItems="center" justifyContent="space-between">
                            <Box display="flex" alignItems="center">
                              <Avatar sx={{ mr: 2 }}>{item.tutor_name.charAt(0)}</Avatar>
                              <Box>
                                <Typography fontWeight="bold">{item.tutor_name}</Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Course: {item.course_name} • Price: ₦{displayPrice}
                                  {formData.deliveryMethod === 'online' && (
                                    <span style={{ textDecoration: 'line-through', marginLeft: '4px', color: '#999' }}>
                                      ₦{parseInt(item.price).toLocaleString()}
                                    </span>
                                  )}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Duration: {item.duration} • Location: {formData.location}
                                </Typography>
                              </Box>
                            </Box>

                            <Box display="flex" flexDirection="column" alignItems="flex-end">
                              {item.is_occupied && (
                                <Chip 
                                  label="Tutor is Occupied" 
                                  color="error" 
                                  size="small" 
                                  sx={{ mb: 1 }} 
                                />
                              )}

                              <Button
                                size="small"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleOpenReviews(item);
                                }}
                                variant="outlined"
                                sx={{ mb: 1 }}
                              >
                                View Reviews
                              </Button>

                              {isSelected && (
                                <CheckCircle 
                                  color="primary" 
                                  sx={{ mt: 1 }} 
                                />
                              )}
                            </Box>
                          </Box>
                        </Card>
                      </Grid>
                    );
                  })
                )}
              </Grid>
            </Box>
          )}


          {/* Reviews Modal */}
          <Dialog open={reviewModalOpen} onClose={handleCloseReviews} maxWidth="sm" fullWidth>
            <DialogTitle>Reviews for {reviewTutorName}</DialogTitle>
            <DialogContent dividers>
              {selectedTutorReviews.length === 0 ? (
                <Typography>No reviews available.</Typography>
              ) : (
                <List>
                  {selectedTutorReviews.map((review, idx) => (
                    <ListItem key={idx} alignItems="flex-start" divider>
                      <ListItemText
                        primary={`⭐ ${review.rating} - ${review.student_name}`}
                        secondary={review.review}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={handleCloseReviews}>Close</Button>
            </DialogActions>
          </Dialog>

          {activeStep === 3 && selectedCourse && (
            <Box>
              <Typography variant="h6" gutterBottom>
                Payment Summary
              </Typography>

              <Box sx={{ mb: 3 }}>
                <Typography>
                  <strong>Course:</strong> {selectedCourse.name}
                </Typography>
                <Typography>
                  <strong>Tutor:</strong> {selectedTutorCourse?.tutor_name || 'Not selected'}
                </Typography>
                <Typography>
                  <strong>Delivery:</strong> {formData.deliveryMethod === 'online' ? 'Online (50% discount)' : 'On-Site'}
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Typography variant="h6">
                  Total: ₦{getAdjustedPrice(selectedCourse.price).toLocaleString()}
                  {formData.deliveryMethod === 'online' && (
                    <span style={{ textDecoration: 'line-through', marginLeft: '8px', color: '#999', fontSize: '0.9rem' }}>
                      ₦{selectedCourse.price.toLocaleString()}
                    </span>
                  )}
                </Typography>
              </Box>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Payment Plan</InputLabel>
                <Select
                  name="paymentPlan"
                  value={formData.paymentPlan}
                  onChange={handleChange}
                  label="Payment Plan"
                >
                  <MenuItem value="installment">Installment (₦{installmentAmount.toLocaleString()})</MenuItem>
                  <MenuItem value="full">Full (₦{fullPaymentAmount.toLocaleString()})</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData(prev => ({ ...prev, termsAccepted: e.target.checked }))}
                    required
                  />
                }
                label="I agree to the terms and conditions"
                sx={{ mb: 2 }}
              />

              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<AttachMoney />}
                disabled={!formData.termsAccepted}
                onClick={handleSubmit}
              >
                Pay ₦{(formData.paymentPlan === 'installment' ? installmentAmount : fullPaymentAmount).toLocaleString()}
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* === NAVIGATION BUTTONS === */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
        <Button onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>

        {activeStep < steps.length - 1 && (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              (activeStep === 0 && (!formData.course || !formData.location)) ||
              (activeStep === 1 && !formData.deliveryMethod) ||
              (activeStep === 2 && !formData.selectedTutor)
            }
          >
            Continue
          </Button>
        )}
      </Box>

      {/* === SNACKBAR === */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <MuiAlert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}