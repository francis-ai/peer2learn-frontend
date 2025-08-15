import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/studentAuthContext";

const SocialLoginSuccess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setStudent, fetchStudentProfile } = useAuth();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("token", token);
      const payload = JSON.parse(atob(token.split(".")[1]));

      // Fetch full profile via backend
      fetchStudentProfile(payload.id, token)
        .then(() => {
          navigate("/dashboard"); // redirect after student info is ready
        })
        .catch(() => {
          localStorage.removeItem("token");
          navigate("/login");
        });
    } else {
      navigate("/login");
    }
  }, [location.search, navigate, setStudent, fetchStudentProfile]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Signing you in...</h2>
      <p>Please wait while we log you in.</p>
    </div>
  );
};

export default SocialLoginSuccess;
