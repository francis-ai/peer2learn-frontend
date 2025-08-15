import { Routes, Route } from 'react-router-dom';

// Auth Context
import { AdminAuthProvider } from './context/adminAuthContext';

// Protected Routes
import AdminProtectedRoutes from './routes/AdminProtectedRoutes';

// Admin Layout
import AdminLayout from './layouts/AdminLayout';

// Auth
import Login from './pages/auth/admin/Login';

// Pages 
import Dashboard from './pages/admin/Dashboard';
import ManageStudent from './pages/admin/ManageStudent';
import ManageTutor from './pages/admin/ManageTutor';
import Offices from './pages/admin/Offices';
import Courses from './pages/admin/Courses';
import Payment from './pages/admin/Payments';
import TutorCourses from './pages/admin/TutorCourses';
import Reviews from './pages/admin/Reviews';
import Assignment from './pages/admin/Assignment';
import Withdrawals from './pages/admin/Withdrawals';
import Classes from './pages/admin/Classes';
import Settings from './pages/admin/Settings';
import OtherSettings from './pages/admin/OtherSettings';
import ManageCohub from './pages/admin/ManageCohub';


const AdminApp = () => {
  return (
    <AdminAuthProvider>
      <Routes>
        {/* Auth routes - these will be at /Admin/login etc. */}
        <Route path="login" element={<Login />} />

        {/* Protected routes with layout */}
        <Route 
          element={
            <AdminProtectedRoutes role="admin">
              <AdminLayout />
            </AdminProtectedRoutes>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="students" element={<ManageStudent />} />
          <Route path="tutors" element={<ManageTutor />} />
          <Route path="offices" element={<Offices />} />
          <Route path="courses" element={<Courses />} />
          <Route path="tutor-courses" element={<TutorCourses />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="withdrawals" element={<Withdrawals />} />
          <Route path="classes" element={<Classes />} />
          <Route path="assignments" element={<Assignment />} />
          <Route path="payments" element={<Payment />} />
          <Route path="settings" element={<Settings />} />
          <Route path="other-settings" element={<OtherSettings />} />
          <Route path="cohubs" element={<ManageCohub />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  );
};

export default AdminApp;