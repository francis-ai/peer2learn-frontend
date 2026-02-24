// src/context/CohubAuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext();

export const CohubAuthProvider = ({ children }) => {
  const [cohub, setCohub] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    try {
      const storedCohub = localStorage.getItem('cohub');
      if (storedCohub) {
        setCohub(JSON.parse(storedCohub));
      }
    } catch (err) {
      console.error('Error parsing cohub from localStorage:', err);
      localStorage.removeItem('cohub');
    }

  }, []);

  // ✅ Redirect automatically when cohub becomes null
  useEffect(() => {
    if (cohub === null) {
      const publicAuthRoutes = [
        '/cohub/login',
        '/cohub/register',
        '/cohub/forgot-password',
      ];
      // Also allow reset-password with token param
      const isResetPassword = location.pathname.startsWith('/cohub/reset-password');
      if (!publicAuthRoutes.includes(location.pathname) && !isResetPassword) {
        navigate('/cohub/login', { replace: true });
      }
    }
  }, [cohub, navigate, location]);

  return (
    <AuthContext.Provider value={{ cohub, setCohub }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useCohubAuth = () => useContext(AuthContext);
