// src/routes/CohubProtectedRoutes.jsx
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCohubAuth } from '../context/cohubAuthContext';

const CohubProtectedRoutes = ({ children }) => {
  const { cohub } = useCohubAuth(); // ✅ fixed hook name
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Delay to allow localStorage/context hydration
    const timeout = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) return null; // Avoid flickering

  const hasToken = localStorage.getItem('token');
  if (!cohub || !hasToken) {
    return <Navigate to="/cohub/login" replace />;
  }

  return children;
};

export default CohubProtectedRoutes;
