import { Routes, Route } from 'react-router-dom';

// Auth Context
import { TutorAuthProvider } from './context/tutorAuthContext';

// Protected Routes
import TutorProtectedRoutes from './routes/TutorProtectedRoutes';

// Tutor Layout
import TutorLayout from './layouts/TutorLayout';

// Auth
import Login from './pages/auth/tutor/Login';
import Register from './pages/auth/tutor/Register';
import ForgotPassword from './pages/auth/tutor/ForgotPassword';
import ResetPassword from './pages/auth/tutor/ResetPassword';

// Pages 
import Dashboard from './pages/tutor/Dashboard';
import MyStudent from './pages/tutor/Student';
import Earnings from './pages/tutor/Earnings';
import Reviews from './pages/tutor/Reviews';
import MyCourses from './pages/tutor/Courses';
import Schedule from './pages/tutor/Schedule';
import Profile from './pages/tutor/Profile';
import Notification from './pages/tutor/Notification';
import Assignment from './pages/tutor/Assignment';


const TutorApp = () => {
  return (
    <TutorAuthProvider>
      <Routes>
        {/* Public auth routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />

        {/* Protected routes */}
        <Route
          element={
            <TutorProtectedRoutes role="tutor">
              <TutorLayout />
            </TutorProtectedRoutes>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="students" element={<MyStudent />} />
          <Route path="courses" element={<MyCourses />} />
          <Route path="earnings" element={<Earnings />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="schedule" element={<Schedule />} />
          <Route path="profile-settings" element={<Profile />} />
          <Route path="notification" element={<Notification />} />
          <Route path="assignment" element={<Assignment />} />
        </Route>
      </Routes>
    </TutorAuthProvider>
  );
};

export default TutorApp;
