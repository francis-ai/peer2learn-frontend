import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useTutorAuth } from '../context/tutorAuthContext';

const TutorProtectedRoutes = ({ children }) => {
  const { tutor } = useTutorAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Delay to allow localStorage/context hydration
    const timeout = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) return null;

  const hasToken = localStorage.getItem('token');
  if (!tutor || !hasToken) {
    return <Navigate to="/tutor/login" replace />;
  }

  return children;
};

export default TutorProtectedRoutes;
