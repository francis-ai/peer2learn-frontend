import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useTutorAuth } from "../context/tutorAuthContext";

const TutorProtectedRoutes = () => {
  const { tutor } = useTutorAuth();

  if (!tutor) {
    return <Navigate to="/tutor/login" replace />;
  }

  return <Outlet />;
};

export default TutorProtectedRoutes;