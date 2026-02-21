// src/context/AdminAuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedAdmin = localStorage.getItem('Admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

   useEffect(() => {
    if (admin === null) {
      navigate('/admin/login', { replace: true });
    }
  }, [admin, navigate]);

  return (
    <AdminAuthContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Correct named export (make sure this line exists exactly like this)
export const useAdminAuth = () => useContext(AdminAuthContext);
