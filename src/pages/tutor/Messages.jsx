import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  CircularProgress,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { useTutorAuth } from "../../context/tutorAuthContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function TutorMessages() {
  const { tutor } = useTutorAuth();
  const tutorId = tutor?.id;
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!tutorId) return;
    const fetchStudents = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/tutors/messages/${tutorId}`);
        setStudents(res.data.students || []);
      } catch (err) {
        console.error("Error fetching students:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [tutorId]);

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 2,
        px: 0,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "#fff",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            color: "#000",
            p: 2,
            fontSize: "1.25rem",
            fontWeight: 600,
          }}
        >
          Messages Inbox
        </Box>

        <Divider />

        {/* Content */}
        <Box sx={{ p: 2 }}>
          {loading ? (
            <Box sx={{ textAlign: "center", mt: 10 }}>
              <CircularProgress />
              <Typography color="text.secondary" sx={{ mt: 1 }}>
                Loading messages...
              </Typography>
            </Box>
          ) : students.length === 0 ? (
            <Typography
              align="center"
              color="text.secondary"
              sx={{ mt: 10, fontSize: "0.95rem" }}
            >
              No messages yet. Students who contact you will appear here 👇
            </Typography>
          ) : (
            <List>
              {students.map((student, i) => (
                <React.Fragment key={student.student_id}>
                  <ListItem
                    button
                    sx={{
                      borderRadius: 2,
                      mb: 1,
                      "&:hover": { bgcolor: "#e1e1e1ff", color: "#000" },
                    }}
                    onClick={() =>
                      navigate(`/tutor/messages/${student.student_id}`, {
                        state: {
                          studentName: student.student_name,
                          studentId: student.student_id,
                        },
                      })
                    }
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {student.student_name?.[0]?.toUpperCase() || "S"}
                      </Avatar>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Typography fontWeight={600}>
                          {student.student_name}
                        </Typography>
                      }
                    />

                    <Typography variant="caption" color="text.secondary">
                      {new Date(student.last_message_time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </Typography>
                  </ListItem>

                  {i < students.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Paper>
    </Box>
  );
}
