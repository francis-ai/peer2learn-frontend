import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Typography,
  Paper,
  Tabs,
  Tab,
  Badge,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Snackbar,
  Alert
} from "@mui/material";
import axios from "axios";
import { useTutorAuth } from "../../context/tutorAuthContext";
import UpcomingSessions from "../../components/tutor/schedule/UpcomingSessions";
import AllSessions from "../../components/tutor/schedule/AllSessions";
import CompletedSessions from "../../components/tutor/schedule/CompletedSessions";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Schedule() {
  const { tutor } = useTutorAuth();
  const tutorId = tutor?.id;

  const [tabValue, setTabValue] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [allSchedules, setAllSchedules] = useState([]);
  const [formData, setFormData] = useState({ studentId: "", date: "", time: "" });
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editingScheduleId, setEditingScheduleId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const showSnackbar = (msg, severity = "success") => setSnackbar({ open: true, message: msg, severity });

  const fetchEnrolledStudents = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/tutors/enrolled-students/${tutorId}`);
      setStudents(res.data);
    } catch {
      showSnackbar("Failed to fetch students", "error");
    }
  }, [tutorId]);

  const fetchSchedules = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/tutors/schedules/${tutorId}`);
      setAllSchedules(res.data);
    } catch {
      showSnackbar("Failed to fetch schedules", "error");
    }
  }, [tutorId]);

  useEffect(() => {
    if (tutorId) {
      fetchEnrolledStudents();
      fetchSchedules();
    }
  }, [tutorId, fetchEnrolledStudents, fetchSchedules]);

  const upcoming = allSchedules.filter(s => s.is_completed === 0);
  const completed = allSchedules.filter(s => s.is_completed === 1);

  const handleFormChange = (e) => setFormData(p => ({ ...p, [e.target.name]: e.target.value }));

  const resetForm = () => {
    setFormData({ studentId: "", date: "", time: "" });
    setEditMode(false);
    setEditingScheduleId(null);
  };

  const handleSaveSchedule = async () => {
    const { studentId, date, time } = formData;
    if (!studentId || !date || !time) return showSnackbar("Please fill all fields", "error");

    const payload = { enrollment_id: studentId, date, time };
    try {
      setLoading(true);
      const url = editMode
        ? `${BASE_URL}/api/tutors/schedule/${editingScheduleId}`
        : `${BASE_URL}/api/tutors/schedule`;
      const method = editMode ? "put" : "post";
      await axios[method](url, { ...payload, tutor_id: tutorId });
      showSnackbar(`Schedule ${editMode ? "updated" : "added"} successfully!`);
      setOpenModal(false);
      resetForm();
      fetchSchedules();
    } catch {
      showSnackbar("Failed to save schedule", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkCompleted = async (id) => {
    try {
      await axios.put(`${BASE_URL}/api/tutors/schedule/${id}/complete`);
      showSnackbar("Session marked as completed");
      fetchSchedules();
    } catch {
      showSnackbar("Failed to mark as completed", "error");
    }
  };

  const handleEdit = (session) => {
    setFormData({ studentId: session.enrollment_id, date: session.date, time: session.time });
    setEditingScheduleId(session.id);
    setEditMode(true);
    setOpenModal(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
          flexDirection: { xs: "column", sm: "row" }, // stack on mobile
          textAlign: { xs: "center", sm: "left" },    // center on mobile
          gap: { xs: 1.5, sm: 0 },                     // spacing when stacked
        }}
      >
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            fontSize: { xs: "1.2rem", sm: "1.5rem" }, // smaller title on mobile
          }}
        >
          My Schedule
        </Typography>

        <Button
          variant="contained"
          onClick={() => setOpenModal(true)}
          sx={{
            fontSize: { xs: "0.8rem", sm: "0.9rem" }, // smaller text on mobile
            px: { xs: 2, sm: 3 },                     // reduce padding
            py: { xs: 0.7, sm: 1 },
            width: { xs: "100%", sm: "auto" },       // full-width button on mobile
          }}
        >
          Add Schedule
        </Button>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={tabValue}
          onChange={(e, v) => setTabValue(v)}
          variant="fullWidth"
          sx={{
            "& .MuiTab-root": {
              fontSize: { xs: "0.8rem", sm: "0.95rem" }, // responsive tab label size
              minHeight: { xs: 40, sm: 48 },            // slightly shorter tabs on mobile
            },
          }}
        >
          <Tab
            label={
              <Badge badgeContent={upcoming.length} color="primary">
                Upcoming
              </Badge>
            }
          />
          <Tab label="All Sessions" />
          <Tab label="Completed" />
        </Tabs>
      </Paper>

      {tabValue === 0 && <UpcomingSessions sessions={upcoming} onMarkCompleted={handleMarkCompleted} onEdit={handleEdit} />}
      {tabValue === 1 && <AllSessions sessions={allSchedules} />}
      {tabValue === 2 && <CompletedSessions sessions={completed} />}

      {/* Dialog + Snackbar (same as before) */}
      <Dialog open={openModal} onClose={() => { setOpenModal(false); resetForm(); }} fullWidth maxWidth="sm">
        <DialogTitle>{editMode ? "Edit Schedule" : "Schedule a Class"}</DialogTitle>
        <DialogContent sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
          <TextField select label="Select Student" name="studentId" value={formData.studentId} onChange={handleFormChange} fullWidth required>
            {students.map((s) => (
              <MenuItem key={s.enrollment_id} value={s.enrollment_id}>
                {s.student_name} - {s.course_name}
              </MenuItem>
            ))}
          </TextField>
          <TextField label="Date" type="date" name="date" value={formData.date} onChange={handleFormChange} InputLabelProps={{ shrink: true }} fullWidth required />
          <TextField label="Time" type="time" name="time" value={formData.time} onChange={handleFormChange} InputLabelProps={{ shrink: true }} fullWidth required />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => { setOpenModal(false); resetForm(); }}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveSchedule} disabled={loading}>
            {loading ? (editMode ? "Updating..." : "Adding...") : (editMode ? "Update Schedule" : "Add Schedule")}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar(p => ({ ...p, open: false }))}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
