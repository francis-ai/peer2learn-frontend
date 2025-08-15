// src/context/AdminAuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const AdminAuthContext = createContext();

export const AdminAuthProvider = ({ children }) => {
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const storedAdmin = localStorage.getItem('Admin');
    if (storedAdmin) {
      setAdmin(JSON.parse(storedAdmin));
    }
  }, []);

  return (
    <AdminAuthContext.Provider value={{ admin, setAdmin }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

// Correct named export (make sure this line exists exactly like this)
export const useAdminAuth = () => useContext(AdminAuthContext);
