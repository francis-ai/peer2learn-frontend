// src/App.js
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Protected Routes
import StudentProtectedRoutes from './routes/StudentProtectedRoutes';

// Layout
import PublicLayout from './layouts/PublicLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

// Public Pages
import Home from './pages/public/Home';
import Faqs from './pages/public/Faq';
import Terms from './pages/public/Term';
import Help from './pages/public/HelpCenter';
import Privacy from './pages/public/PrivacyPolicy'

// Dashboards
import StudentDashboard from './pages/student/Dashboard';
import Profile from './pages/student/Profile';
import MyClasses from './pages/student/MyClasses';
import Reviews from './pages/student/Reviews';
import Payment from './pages/student/Payment';
import Notifications from './pages/student/Notifications';
import Enroll from './pages/student/EnrollForm';
import Schedule from './pages/student/Schedule';
import Assignment from './pages/student/Assignment';
import SocialLoginSuccess from './pages/SocialLoginSuccess';
import Logout from './pages/student/Logout';


import TutorApp from './TutorApp';
import AdminApp from './AdminApp';
import CoHubApp from './CoHubApp';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Routes with Navbar and Footer */}
        <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
        <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />
        <Route path="/forgot-password" element={<PublicLayout><ForgotPassword /></PublicLayout>} />
        <Route path="/reset-password" element={<PublicLayout><ResetPassword /></PublicLayout>} />
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
        <Route path="/logout" element={<PublicLayout><Logout /></PublicLayout>} />

        {/* Public Routes with Navbar and Footer */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/faqs" element={<PublicLayout><Faqs /></PublicLayout>} />
        <Route path="/terms" element={<PublicLayout><Terms /></PublicLayout>} />
        <Route path="/help" element={<PublicLayout><Help /></PublicLayout>} />
        <Route path="/privacy" element={<PublicLayout><Privacy /></PublicLayout>} />
        <Route path="/social-login-success" element={<PublicLayout><SocialLoginSuccess /></PublicLayout>} />

        {/* Dashboards without Navbar/Footer (can have their own layout later) */}
        <Route
          path="/dashboard"
          element={
            <StudentProtectedRoutes role="student">
              <PublicLayout><StudentDashboard /></PublicLayout>
            </StudentProtectedRoutes>
          }
        />

        <Route
          path="/profile"
          element={
            <StudentProtectedRoutes role="student">
              <PublicLayout><Profile /></PublicLayout>
            </StudentProtectedRoutes>
          }
        />

        <Route
          path="/my-classes"
          element={
            <StudentProtectedRoutes role="student">
              <PublicLayout><MyClasses /></PublicLayout>
            </StudentProtectedRoutes>
          }
        />

        <Route
          path="/payment"
          element={
            <StudentProtectedRoutes role="student">
              <PublicLayout><Payment /></PublicLayout>
            </StudentProtectedRoutes>
          }
        />

        <Route
          path="/reviews"
          element={
            <StudentProtectedRoutes role="student">
              <PublicLayout><Reviews /></PublicLayout>
            </StudentProtectedRoutes>
          }
        />

        <Route
          path="/notifications"
          element={
            <StudentProtectedRoutes role="student">
              <PublicLayout><Notifications /></PublicLayout>
            </StudentProtectedRoutes>
          }
        />

        <Route
          path="/enroll"
          element={
            <StudentProtectedRoutes role="student">
              <PublicLayout><Enroll /></PublicLayout>
            </StudentProtectedRoutes>
          }
        />
        <Route
          path="/schedule"
          element={
            <StudentProtectedRoutes role="student">
              <PublicLayout><Schedule /></PublicLayout>
            </StudentProtectedRoutes>
          }
        />
        <Route
          path="/assignments"
          element={
            <StudentProtectedRoutes role="student">
              <PublicLayout><Assignment /></PublicLayout>
            </StudentProtectedRoutes>
          }
        />

        <Route path="/tutor/*" element={<TutorApp />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/cohub/*" element={<CoHubApp />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
