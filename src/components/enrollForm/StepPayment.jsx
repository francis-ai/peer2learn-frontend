// components/EnrollForm/StepPayment.jsx
import {
  Box,
  Typography,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";
import axios from "axios";

export default function StepPayment({
  BASE_URL,
  PAYSTACK_PUBLIC_KEY,
  student,
  formData,
  setFormData,
  selectedCourse,
  selectedTutorCourse,
  installmentAmount,
  fullPaymentAmount,
  setSnackbar,
  onSuccess,
}) {
  const getAdjustedPrice = (price) =>
    formData.deliveryMethod === "online" ? Math.floor(Number(price || 0) / 2) : Number(price || 0);

  const handleSubmit = async () => {
    try {
      // Validate
      if (
        !formData.course ||
        !formData.selectedTutor ||
        !formData.paymentPlan ||
        !formData.deliveryMethod
      ) {
        setSnackbar({
          open: true,
          message: "Please complete all steps before payment.",
          severity: "warning",
        });
        return;
      }

      const amount = formData.paymentPlan === "installment" ? installmentAmount : fullPaymentAmount;

      if (!student || !student.email) {
        setSnackbar({ open: true, message: "Student not authenticated.", severity: "error" });
        return;
      }

      if (!window.PaystackPop) {
        setSnackbar({
          open: true,
          message:
            "Paystack SDK not found. Please ensure <script src='https://js.paystack.co/v1/inline.js'></script> is loaded.",
          severity: "error",
        });
        return;
      }

      const ref = `ENROLL-${student.id}-${Date.now()}`;

      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: student.email,
        amount: Number(amount) * 100, // in kobo
        currency: "NGN",
        ref,
        callback: function (response) {
          axios
            .post(`${BASE_URL}/api/students/verify-course-enrollment`, {
              reference: response.reference,
              student_id: student.id,
              tutor_course_id: formData.selectedTutor,
              course_id: formData.course,
              location: formData.location,
              delivery_method: formData.deliveryMethod,
              payment_plan: formData.paymentPlan,
              office_id: formData.officeId || null,
              email: student.email,
              name: student.name,
            })
            .then(() => {
              onSuccess && onSuccess();
            })
            .catch((error) => {
              console.error("Payment verification error:", error);
              setSnackbar({
                open: true,
                message: "Payment verification failed. Contact support.",
                severity: "error",
              });
            });
        },
        onClose: function () {
          setSnackbar({ open: true, message: "Payment was cancelled.", severity: "info" });
        },
      });

      handler.openIframe();
    } catch (err) {
      console.error("Unexpected error:", err);
      setSnackbar({ open: true, message: "An unexpected error occurred.", severity: "error" });
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Summary
      </Typography>

      <Box sx={{ mb: 3 }}>
        <Typography>
          <strong>Course:</strong> {selectedCourse?.name}
        </Typography>
        <Typography>
          <strong>Tutor:</strong> {selectedTutorCourse?.tutor_name || "Not selected"}
        </Typography>
        <Typography>
          <strong>Delivery:</strong>{" "}
          {formData.deliveryMethod === "online" ? "Online (50% discount)" : "On-Site"}
        </Typography>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6">
          Total: ₦{getAdjustedPrice(selectedCourse?.price).toLocaleString()}
          {formData.deliveryMethod === "online" && (
            <span
              style={{
                textDecoration: "line-through",
                marginLeft: 8,
                color: "#999",
                fontSize: "0.9rem",
              }}
            >
              ₦{Number(selectedCourse?.price || 0).toLocaleString()}
            </span>
          )}
        </Typography>
      </Box>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Payment Plan</InputLabel>
        <Select
          name="paymentPlan"
          value={formData.paymentPlan}
          onChange={(e) => setFormData((p) => ({ ...p, paymentPlan: e.target.value }))}
          label="Payment Plan"
        >
          <MenuItem value="installment">
            Installment (₦{Number(installmentAmount).toLocaleString()})
          </MenuItem>
          <MenuItem value="full">Full (₦{Number(fullPaymentAmount).toLocaleString()})</MenuItem>
        </Select>
      </FormControl>

      <FormControlLabel
        control={
          <Checkbox
            checked={formData.termsAccepted}
            onChange={(e) => setFormData((prev) => ({ ...prev, termsAccepted: e.target.checked }))}
            required
          />
        }
        label={
          <Typography variant="body2">
            I agree to the{" "}
            <Typography
              component="a"
              href="/terms"
              target="_blank"
              // rel="noopener noreferrer"
              sx={{
                color: "primary.main",
                textDecoration: "underline",
                cursor: "pointer",
                "&:hover": { textDecoration: "none" },
              }}
            >
              terms and conditions
            </Typography>
          </Typography>
        }
        sx={{ mb: 2 }}
      />

      <Button
        variant="contained"
        size="large"
        fullWidth
        disabled={!formData.termsAccepted}
        onClick={handleSubmit}
      >
        Pay ₦
        {(
          formData.paymentPlan === "installment" ? installmentAmount : fullPaymentAmount
        ).toLocaleString()}
      </Button>
    </Box>
  );
}
