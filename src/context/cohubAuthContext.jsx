// src/context/CohubAuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export const CohubAuthProvider = ({ children }) => {
  const [cohub, setCohub] = useState(null);

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

  return (
    <AuthContext.Provider value={{ cohub, setCohub }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useCohubAuth = () => useContext(AuthContext);
