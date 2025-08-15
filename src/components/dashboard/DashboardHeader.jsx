import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, useTheme, Box } from "@mui/material";
import { useAuth } from "../../context/studentAuthContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const DashboardHeader = () => {
  const theme = useTheme();
  const { student } = useAuth();
  const studentId = student?.id;
  const [name, setName] = useState("");

  useEffect(() => {
    if (!studentId) return;

    const fetchName = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/students/profile/${studentId}`);
        console.log("Student profile response:", res.data); // ✅ log the response
        setName(res.data.name || "");
      } catch (err) {
        console.error("Failed to fetch student name:", err);
      }
    };

    fetchName();
  }, [studentId]);

  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
        Welcome back,{" "}
        <span style={{ color: theme.palette.primary.main }}>
          {name || student.name || "Student"}
        </span>
      </Typography>
      <Typography color="text.secondary">
        Here's what's happening with your learning journey
      </Typography>
    </Box>
  );
};

export default DashboardHeader;
