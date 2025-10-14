import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const StudentAuthProvider = ({ children }) => {
  const [student, setStudentState] = useState(null);

  // Load student from localStorage safely
  useEffect(() => {
    try {
      const storedStudent = localStorage.getItem("student");

      if (storedStudent && storedStudent !== "undefined" && storedStudent !== "null") {
        const parsed = JSON.parse(storedStudent);
        setStudentState(parsed);
      } else {
        localStorage.removeItem("student"); // clean bad value
      }
    } catch (err) {
      console.error("Failed to parse student from localStorage:", err);
      localStorage.removeItem("student"); // clean up if corrupted
    }
  }, []);

  // Wrap setStudent to also save to localStorage
  const setStudent = (studentData) => {
    setStudentState(studentData);
    if (studentData) {
      localStorage.setItem("student", JSON.stringify(studentData));
    } else {
      localStorage.removeItem("student");
    }
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
