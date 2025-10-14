// src/pages/PaymentSuccess.jsx
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const BASE_URL= process.env.REACT_APP_BASE_URL;

export default function PaymentSuccess({student, onSuccess }) {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const tx_ref = searchParams.get("tx_ref");

    if (!tx_ref || !student) {
      navigate("/dashboard");
      return;
    }

    const verifyPayment = async () => {
      try {
        await axios.post(`${BASE_URL}/api/students/verify-course-enrollment`, {
          reference: tx_ref,
          student_id: student.id,
          // other formData fields as needed
        });
        onSuccess && onSuccess();
        navigate("/dashboard");
      } catch (err) {
        console.error(err);
        navigate("/dashboard");
      }
    };

    verifyPayment();
  }, [location, student, navigate, onSuccess]);

  return <div>Verifying payment, please wait...</div>;
}
