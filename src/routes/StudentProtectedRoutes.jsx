import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/studentAuthContext';

const StudentProtectedRoutes = ({ children }) => {
  const { student, setStudent } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if token exists in localStorage
    const token = localStorage.getItem('token');

    if (token && !student) {
      try {
        // Decode JWT to get student info
        const payload = JSON.parse(atob(token.split('.')[1]));
        setStudent({ id: payload.id, email: payload.email, name: payload.name});
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem('token');
      }
    }

    // Small delay to let context hydrate
    const timeout = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timeout);
  }, [student, setStudent]);

  if (isLoading) return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Loading...</h2>
    </div>
  );

  const token = localStorage.getItem('token');
  if (!student || !token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default StudentProtectedRoutes;
