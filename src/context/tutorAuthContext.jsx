import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const TutorAuthContext = createContext();

export const TutorAuthProvider = ({ children }) => {
  const [tutor, setTutor] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const storedTutor = localStorage.getItem('tutor');
    const token = localStorage.getItem('tutorToken');

    if (storedTutor && token) {
      setTutor(JSON.parse(storedTutor));
    } else {
      setTutor(null);
    }
  }, []);

  // ✅ Redirect automatically when tutor becomes null, but not on public auth routes
  useEffect(() => {
    if (tutor === null) {
      const publicAuthRoutes = [
        '/tutor/login',
        '/tutor/register',
        '/tutor/forgot-password',
      ];
      // Also allow reset-password with token param
      const isResetPassword = location.pathname.startsWith('/tutor/reset-password');
      if (!publicAuthRoutes.includes(location.pathname) && !isResetPassword) {
        navigate('/tutor/login', { replace: true });
      }
    }
  }, [tutor, navigate, location]);

  return (
    <TutorAuthContext.Provider value={{ tutor, setTutor }}>
      {children}
    </TutorAuthContext.Provider>
  );
};

export const useTutorAuth = () => useContext(TutorAuthContext);