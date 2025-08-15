import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  Pagination,
  Alert
} from "@mui/material";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Announcement() {
  const [announcements, setAnnouncements] = useState([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", content: "" });
  const [editId, setEditId] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Pagination
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const fetchAnnouncements = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/announcements`);
      setAnnouncements(res.data || []);
    } catch (err) {
      console.error(err);
      showSnackbar("Failed to load announcements", "error");
    }
  }, []); // ✅ empty array so this function is stable

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]); 

  const handleOpen = (announcement = null) => {
    if (announcement) {
      setFormData({ title: announcement.title, content: announcement.content });
      setEditId(announcement.id);
    } else {
      setFormData({ title: "", content: "" });
      setEditId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData({ title: "", content: "" });
    setEditId(null);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (editId) {
        await axios.put(`${BASE_URL}/api/admin/announcement/${editId}`, formData);
        showSnackbar("Announcement updated successfully", "success");
      } else {
        await axios.post(`${BASE_URL}/api/admin/announcement`, formData);
        showSnackbar("Announcement added successfully", "success");
      }
      fetchAnnouncements();
      handleClose();
    } catch (err) {
      console.error(err);
      showSnackbar("Error saving announcement", "error");
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Pagination logic
  const paginatedData = announcements.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <h2>Announcements</h2>
        <Button variant="contained" onClick={() => handleOpen()}>
          Add Announcement
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell><strong>Title</strong></TableCell>
              <TableCell><strong>Content</strong></TableCell>
              <TableCell><strong>Actions</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((announcement) => (
              <TableRow key={announcement.id}>
                <TableCell>{announcement.title}</TableCell>
                <TableCell>{announcement.content}</TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={() => handleOpen(announcement)}
                  >
                    Edit
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {paginatedData.length === 0 && (
              <TableRow>
                <TableCell colSpan={3} align="center">
                  No announcements found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(announcements.length / rowsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
        />
      </Box>

      {/* Dialog for Add/Edit */}
      <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
        <DialogTitle>{editId ? "Edit Announcement" : "Add Announcement"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="dense"
          />
          <TextField
            fullWidth
            label="Content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            margin="dense"
            multiline
            rows={3}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            {editId ? "Update" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Alerts */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
