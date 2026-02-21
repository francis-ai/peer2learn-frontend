// src/context/CohubAuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const CohubAuthProvider = ({ children }) => {
  const [cohub, setCohub] = useState(null);
  const navigate = useNavigate();

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

  // ✅ Redirect automatically when tutor becomes null
  useEffect(() => {
    if (cohub === null) {
      navigate('/cohub/login', { replace: true });
    }
  }, [cohub, navigate]);

  return (
    <AuthContext.Provider value={{ cohub, setCohub }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useCohubAuth = () => useContext(AuthContext);
