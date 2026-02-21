import { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TutorAuthContext = createContext();

export const TutorAuthProvider = ({ children }) => {
  const [tutor, setTutor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedTutor = localStorage.getItem('tutor');
    const token = localStorage.getItem('tutorToken');

    if (storedTutor && token) {
      setTutor(JSON.parse(storedTutor));
    } else {
      setTutor(null);
    }
  }, []);

  // ✅ Redirect automatically when tutor becomes null
  useEffect(() => {
    if (tutor === null) {
      navigate('/tutor/login', { replace: true });
    }
  }, [tutor, navigate]);

  return (
    <TutorAuthContext.Provider value={{ tutor, setTutor }}>
      {children}
    </TutorAuthContext.Provider>
  );
};

export const useTutorAuth = () => useContext(TutorAuthContext);