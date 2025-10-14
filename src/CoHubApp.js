import { Routes, Route } from 'react-router-dom';

// Auth Context
import { CohubAuthProvider } from './context/cohubAuthContext';

// Protected Routes
import CohubProtectedRoutes from './routes/CohubProtectedRoutes';

// Layout
import CohubLayout from './layouts/CohubLayout';

// Auth Pages
import Login from './pages/auth/cohub/Login';
import Register from './pages/auth/cohub/Register';
import ForgotPassword from './pages/auth/cohub/ForgotPassword';
import ResetPassword from './pages/auth/cohub/ResetPassword';

// Dashboard Pages
import Dashboard from './pages/cohub/Dashboard';
import OurUser from './pages/cohub/OurUser'
import Profile from './pages/cohub/Profile';
import Payments from './pages/cohub/Payment';
import Withdrawal from './pages/cohub/Withdrawal';

const CohubApp = () => {
  return (
    <CohubAuthProvider>
      <Routes>
        {/* Public Auth Routes */}
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="reset-password/:token" element={<ResetPassword />} />

        {/* Protected Dashboard Routes */}
        <Route
          element={
            <CohubProtectedRoutes role="cohub">
              <CohubLayout />
            </CohubProtectedRoutes>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="users" element={<OurUser />} />
          <Route path="payments" element={<Payments />} />
          <Route path="withdrawal" element={<Withdrawal />} />
          <Route path="profile-settings" element={<Profile />} />
        </Route>
      </Routes>
    </CohubAuthProvider>
  );
};

export default CohubApp;
