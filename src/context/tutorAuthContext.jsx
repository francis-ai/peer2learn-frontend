// src/context/TutorAuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const TutorAuthContext = createContext();

export const TutorAuthProvider = ({ children }) => {
  const [tutor, setTutor] = useState(null);

  useEffect(() => {
    const storedTutor = localStorage.getItem('tutor');
    if (storedTutor) {
      setTutor(JSON.parse(storedTutor));
    }
  }, []);

  return (
    <TutorAuthContext.Provider value={{ tutor, setTutor }}>
      {children}
    </TutorAuthContext.Provider>
  );
};

// Correct named export (make sure this line exists exactly like this)
export const useTutorAuth = () => useContext(TutorAuthContext);
