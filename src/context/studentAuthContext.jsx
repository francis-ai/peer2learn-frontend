import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const StudentAuthProvider = ({ children }) => {
  const [student, setStudentState] = useState(null);

  // Load student from localStorage
  useEffect(() => {
    const storedStudent = localStorage.getItem("student");
    if (storedStudent) setStudentState(JSON.parse(storedStudent));
  }, []);

  // Wrap setStudent to also save to localStorage
  const setStudent = (studentData) => {
    setStudentState(studentData);
    localStorage.setItem("student", JSON.stringify(studentData));
  };

  // Fetch full student profile by ID
  const fetchStudentProfile = async (id, token) => {
    try {
      const res = await fetch(`/api/profile/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch profile");
      const data = await res.json();
      setStudent({
        id: data.id,
        email: data.email,
        name: data.name,
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider value={{ student, setStudent, fetchStudentProfile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
