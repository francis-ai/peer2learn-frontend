import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../context/adminAuthContext';

const AdminProtectedRoutes = ({ children }) => {
  const { admin } = useAdminAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Delay to allow localStorage/context hydration
    const timeout = setTimeout(() => setIsLoading(false), 100);
    return () => clearTimeout(timeout);
  }, []);

  if (isLoading) return null;

  const hasToken = localStorage.getItem('token');
  if (!admin || !hasToken) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default AdminProtectedRoutes;
