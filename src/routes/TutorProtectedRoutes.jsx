import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useTutorAuth } from "../context/tutorAuthContext";

const TutorProtectedRoutes = () => {
  const { tutor, loading } = useContext(useTutorAuth);

  // Wait until auth is finished loading
  if (loading) return null;

  // If no tutor, redirect to login
  if (!tutor) {
    return <Navigate to="/tutor/login" replace />;
  }

  return <Outlet />;
};

export default TutorProtectedRoutes;