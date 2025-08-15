import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/studentAuthContext'; // adjust path as needed

const Logout = () => {
  const { setStudent } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Clear localStorage
    localStorage.removeItem('studentToken');
    localStorage.removeItem('student');
    setStudent(null);

    // Redirect to login page after logout
    navigate('/login', { replace: true });
  }, [navigate, setStudent]);

  // Optionally show a message while redirecting
  return <p>Logging out...</p>;
};

export default Logout;
