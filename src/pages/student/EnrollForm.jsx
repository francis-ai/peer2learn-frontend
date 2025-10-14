// components/EnrollForm/EnrollForm.jsx
import { useEffect, useMemo, useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Snackbar,
  Stepper,
  Step,
  StepLabel,
} from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/studentAuthContext";

import StepCourseLocation from "../../components/enrollForm/StepCourseLocation";
import StepDeliveryMethod from "../../components/enrollForm/StepDeliveryMethod";
import StepTutorSelect from "../../components/enrollForm/StepTutorSelect";
import StepPayment from "../../components/enrollForm/StepPayment";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const PAYSTACK_PUBLIC_KEY = process.env.REACT_APP_PAYSTACK_PUBLIC_KEY ||
  "pk_live_e2c76d414fdb6b5819fb2d8489e22872a1e64d9d";

export default function EnrollForm() {
  const navigate = useNavigate();
  const { student } = useAuth();

  const [activeStep, setActiveStep] = useState(0);
  const [courses, setCourses] = useState([]);
  const [tutorCourses, setTutorCourses] = useState([]);
  const [offices, setOffices] = useState([]);

  const [formData, setFormData] = useState({
    course: "",
    location: null, // will send null if online or removed
    deliveryMethod: "", // 'online' | 'onsite'
    officeId: "",
    selectedTutor: null, // tutor_course_id
    paymentPlan: "installment", // 'installment' | 'full'
    termsAccepted: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () =>
    setSnackbar((s) => ({ ...s, open: false }));

  // Fetch initial data
  useEffect(() => {
    const fetchInitial = async () => {
      try {
        const [courseRes, tutorCourseRes, officesRes] = await Promise.all([
          axios.get(`${BASE_URL}/api/view/courses`),
          axios.get(`${BASE_URL}/api/view/all-tutor-courses`),
          axios.get(`${BASE_URL}/api/view/offices`),
        ]);
        setCourses(courseRes.data || []);
        setTutorCourses(tutorCourseRes.data || []);
        setOffices(officesRes.data || []);
      } catch (err) {
        console.error("Error loading data:", err);
        setSnackbar({
          open: true,
          message: "Error loading data. Please try again.",
          severity: "error",
        });
      }
    };
    if (BASE_URL) fetchInitial();
  }, []);

  const steps = ["Course", "Delivery Method", "Select Tutor", "Payment"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "course") {
        return { ...prev, course: value, selectedTutor: null }; // reset tutor
      }
      if (name === "paymentPlan") return { ...prev, paymentPlan: value };
      return { ...prev, [name]: value };
    });
  };

  const selectedCourseObject = useMemo(
    () => courses.find((c) => c.id === formData.course),
    [courses, formData.course]
  );

  // Tutors filtered only by selected course
  const filteredTutors = useMemo(() => {
    if (!selectedCourseObject) return [];
    return tutorCourses.filter(
      (t) =>
        selectedCourseObject?.name?.toLowerCase() ===
        t.course_name?.toLowerCase()
    );
  }, [tutorCourses, selectedCourseObject]);

  const selectedTutorCourse = useMemo(
    () =>
      tutorCourses.find(
        (t) => t.tutor_course_id === formData.selectedTutor
      ),
    [tutorCourses, formData.selectedTutor]
  );

  const selectedCourse = useMemo(() => {
    if (!selectedTutorCourse) return null;
    return {
      name: selectedTutorCourse.course_name,
      price: Number(selectedTutorCourse.price) || 0,
      originalPrice: Number(selectedTutorCourse.price) || 0,
    };
  }, [selectedTutorCourse]);

  const getAdjustedPrice = (price) =>
    formData.deliveryMethod === "online"
      ? Math.floor(Number(price || 0) / 2)
      : Number(price || 0);

  const fullPaymentAmount = selectedCourse
    ? getAdjustedPrice(selectedCourse.price)
    : 0;

  const installmentAmount = selectedCourse
    ? fullPaymentAmount < 80000
      ? Math.floor(fullPaymentAmount / 2)
      : Math.max(80000, Math.floor(fullPaymentAmount * 0.3))
    : 80000;

  const handleNext = () => {
    // enforce office selection if onsite
    if (
      activeStep === 1 &&
      formData.deliveryMethod === "onsite" &&
      !formData.officeId
    ) {
      setSnackbar({
        open: true,
        message: "Please select your preferred Cohub location.",
        severity: "warning",
      });
      return;
    }
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  // after successful payment
  const handlePaymentSuccess = () => {
    setSnackbar({
      open: true,
      message: "Enrollment & payment verified successfully!",
      severity: "success",
    });
    setTimeout(() => navigate("/dashboard"), 1500);
  };

  return (
    <Box sx={{ maxWidth: "800px", mx: "auto", p: 3, mt: 12 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
        sx={{ mb: 3 }}
      >
        Back to Classes
      </Button>

      <Stepper activeStep={activeStep} alternativeLabel sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Card elevation={3}>
        <CardContent>
          {activeStep === 0 && (
            <StepCourseLocation
              courses={courses}
              formData={formData}
              handleChange={handleChange}
            />
          )}

          {activeStep === 1 && (
            <StepDeliveryMethod
              formData={formData}
              setFormData={setFormData}
              offices={offices}
            />
          )}

          {activeStep === 2 && (
            <StepTutorSelect
              tutors={filteredTutors}
              allTutors={tutorCourses}
              formData={formData}
              onSelectTutor={(id) =>
                setFormData((p) => ({ ...p, selectedTutor: id }))
              }
            />
          )}

          {activeStep === 3 && selectedCourse && (
            <StepPayment
              BASE_URL={BASE_URL}
              PAYSTACK_PUBLIC_KEY={PAYSTACK_PUBLIC_KEY}
              student={student}
              formData={formData}
              setFormData={setFormData}
              selectedCourse={selectedCourse}
              selectedTutorCourse={selectedTutorCourse}
              installmentAmount={installmentAmount}
              fullPaymentAmount={fullPaymentAmount}
              setSnackbar={setSnackbar}
              onSuccess={handlePaymentSuccess}
            />
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
        <Button onClick={handleBack} disabled={activeStep === 0}>
          Back
        </Button>

        {activeStep < steps.length - 1 && (
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              (activeStep === 0 && !formData.course) ||
              (activeStep === 1 && !formData.deliveryMethod) ||
              (activeStep === 2 && !formData.selectedTutor)
            }
          >
            Continue
          </Button>
        )}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
}
