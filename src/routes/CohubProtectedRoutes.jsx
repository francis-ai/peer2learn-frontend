import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useCohubAuth } from '../context/cohubAuthContext';

const CohubProtectedRoutes = ({ children }) => {
  const { cohub } = useCohubAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) return null;

  const hasToken = localStorage.getItem('cohubToken'); // ✅ FIXED

  if (!cohub || !hasToken) {
    return <Navigate to="/cohub/login" replace />;
  }

  return children;
};

export default CohubProtectedRoutes;