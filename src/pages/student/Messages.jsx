import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/studentAuthContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function MessagesList() {
  const { student } = useAuth();
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!student) return;
    const fetchTutors = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/students/messages/${student.id}`);
        setTutors(res.data.tutors || []);
      } catch (err) {
        console.error("Error fetching tutors:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, [student]);

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        mt: 14,
        px: 2,
        mb: 3
      }}
    >
      <Paper
        elevation={4}
        sx={{
          width: "100%",
          maxWidth: 900,
          borderRadius: 3,
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h6"
          sx={{
            bgcolor: "primary.main",
            color: "white",
            p: 2,
          }}
        >
          Messages
        </Typography>

        <List>
          {tutors.length > 0 ? (
            tutors.map((tutor) => (
              <ListItemButton
                key={tutor.tutor_id}
                onClick={() =>
                  navigate(`/messages/${student.id}/${tutor.tutor_id}`, {
                    state: { tutorId: tutor.tutor_id, tutorName: tutor.tutor_name },
                  })
                }
              >
                <ListItemText
                  primary={tutor.tutor_name}
                  secondary={`Last message: ${new Date(
                    tutor.last_message_time
                  ).toLocaleString()}`}
                />
              </ListItemButton>
            ))
          ) : (
            <Typography sx={{ textAlign: "center", py: 3, color: "gray" }}>
              No tutors yet.
            </Typography>
          )}
        </List>
      </Paper>
    </Box>
  );
}
