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
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/studentAuthContext";

import StepCourseLocation from "../../components/enrollForm/StepCourseLocation";
import StepDeliveryMethod from "../../components/enrollForm/StepDeliveryMethod";
import StepTutorSelect from "../../components/enrollForm/StepTutorSelect";
import StepPayment from "../../components/enrollForm/StepPayment";

const BASE_URL = process.env.REACT_APP_BASE_URL;
const PAYSTACK_PUBLIC_KEY =
  process.env.REACT_APP_PAYSTACK_PUBLIC_KEY ||
  "pk_live_e2c76d414fdb6b5819fb2d8489e22872a1e64d9d";

export default function EnrollForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const { student } = useAuth();

  // initialize step if coming from TutorDetails
  const initialStep = location.state?.step ?? 0;

  const [activeStep, setActiveStep] = useState(initialStep);

  const [courses, setCourses] = useState([]);
  const [tutorCourses, setTutorCourses] = useState([]);
  const [offices, setOffices] = useState([]);

  const [formData, setFormData] = useState({
    course: location.state?.courseId || "",
    location: null,
    deliveryMethod: "online",
    officeId: null,
    selectedTutor: location.state?.tutorId || null,
    paymentPlan: location.state?.paymentPlan || "installment",
    termsAccepted: false,
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleSnackbarClose = () =>
    setSnackbar((s) => ({ ...s, open: false }));

  /*
  ===========================
  Fetch initial data
  ===========================
  */

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

  /*
  ===========================
  Pre-fill tutor if coming
  from TutorDetails page
  ===========================
  */

  useEffect(() => {
    if (location.state?.tutorId && tutorCourses.length > 0) {
      const tutorCourse = tutorCourses.find(
        (t) => t.tutor_course_id === location.state.tutorId
      );

      if (tutorCourse) {
        const courseObj = courses.find(
          (c) =>
            c.name?.toLowerCase() ===
            tutorCourse.course_name?.toLowerCase()
        );

        setFormData((prev) => ({
          ...prev,
          course: courseObj?.id || "",
          selectedTutor: tutorCourse.tutor_course_id,
          deliveryMethod: "online",
          paymentPlan: "installment",
        }));

        // jump directly to payment step
        setActiveStep(3);
      }
    }
  }, [location.state, tutorCourses, courses]);

  const steps = ["Course", "Learning Mode", "Select Tutor", "Payment"];

  /*
  ===========================
  Handle form changes
  ===========================
  */

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => {
      if (name === "course") {
        return { ...prev, course: value, selectedTutor: null };
      }

      return { ...prev, [name]: value };
    });
  };

  /*
  ===========================
  Selected course
  ===========================
  */

  const selectedCourseObject = useMemo(
    () => courses.find((c) => c.id === formData.course),
    [courses, formData.course]
  );

  /*
  ===========================
  Filter tutors for course
  ===========================
  */

  const filteredTutors = useMemo(() => {
    if (!selectedCourseObject) return [];

    return tutorCourses.filter(
      (t) =>
        selectedCourseObject?.name?.toLowerCase() ===
        t.course_name?.toLowerCase()
    );
  }, [tutorCourses, selectedCourseObject]);

  /*
  ===========================
  Selected tutor
  ===========================
  */

  const selectedTutorCourse = useMemo(
    () =>
      tutorCourses.find(
        (t) => t.tutor_course_id === formData.selectedTutor
      ),
    [tutorCourses, formData.selectedTutor]
  );

  /*
  ===========================
  Selected course pricing
  ===========================
  */

  const selectedCourse = useMemo(() => {
    if (!selectedTutorCourse) return null;

    return {
      name: selectedTutorCourse.course_name,
      price: Number(selectedTutorCourse.price) || 0,
    };
  }, [selectedTutorCourse]);

  const getAdjustedPrice = (price) => Number(price || 0);

  const fullPaymentAmount = selectedCourse
    ? getAdjustedPrice(selectedCourse.price)
    : 0;

  const installmentAmount = selectedCourse
    ? fullPaymentAmount <= 80000
      ? Math.floor(fullPaymentAmount / 2)
      : Math.max(80000, Math.floor(fullPaymentAmount * 0.3))
    : 80000;

  /*
  ===========================
  Navigation
  ===========================
  */

  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  const handleBack = () => setActiveStep((prev) => prev - 1);

  /*
  ===========================
  Payment success
  ===========================
  */

  const handlePaymentSuccess = () => {
    setSnackbar({
      open: true,
      message: "Enrollment & payment verified successfully!",
      severity: "success",
    });

    setTimeout(() => navigate("/dashboard"), 2000);
  };

  return (
    <Box sx={{ maxWidth: "800px", mx: "auto", p: 3, mt: 12 }}>
      <Button startIcon={<ArrowBack />} onClick={() => navigate(-1)} sx={{ mb: 3 }}>
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

          {activeStep === 3 && selectedTutorCourse && (
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

