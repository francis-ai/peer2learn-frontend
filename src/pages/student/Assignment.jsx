import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Button,
  Modal,
  Box,
  Container,
  Typography,
  TextField,
  List,
  ListItem,
  Snackbar,
  Alert,
  Pagination
} from '@mui/material';
import { useAuth } from '../../context/studentAuthContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Assignment = () => {
  const { student } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [submittedText, setSubmittedText] = useState('');
  const [submittedFile, setSubmittedFile] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [page, setPage] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/students/my-assignments/${student.id}`);
        setAssignments(res.data);
      } catch (err) {
        console.error(err);
        setSnackbar({ open: true, message: 'Failed to load assignments', severity: 'error' });
      }
    };

    if (student?.id) fetchAssignments();
  }, [student]);

  const handleSubmit = async () => {
    if (!submittedFile && !submittedText) {
      setSnackbar({ open: true, message: 'Please provide a file or submission text.', severity: 'warning' });
      return;
    }

    if (!selectedAssignment || !selectedAssignment.assignment_id) {
      setSnackbar({ open: true, message: 'No assignment selected!', severity: 'warning' });
      return;
    }

    const formData = new FormData();
    formData.append('assignment_id', selectedAssignment.assignment_id);
    formData.append('student_id', student.id);
    formData.append('submission_text', submittedText);
    if (submittedFile) {
      formData.append('submission_file', submittedFile); // ✅ correct field name
    }

    try {
      await axios.post(`${BASE_URL}/api/students/submit-assignment`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setSnackbar({ open: true, message: 'Assignment submitted!', severity: 'success' });
      setOpenModal(false);
      setSubmittedText('');
      setSubmittedFile(null);

      const res = await axios.get(`${BASE_URL}/api/students/my-assignments/${student.id}`);
      setAssignments(res.data);
    } catch (err) {
      console.error('Assignment submission failed:', err);
      setSnackbar({ open: true, message: 'Submission failed!', severity: 'error' });
    }
  };

  const pageCount = Math.ceil(assignments.length / itemsPerPage);
  const paginatedAssignments = assignments.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  return (
    <Container sx={{ p: 3, mt: 12, maxWidth: { md: '80%', xs: '100%' }, mx: 'auto' }}>
      <Typography variant="h5" gutterBottom>
        My Assignments
      </Typography>

      <List>
        {paginatedAssignments.map((a) => (
          <ListItem key={a.assignment_id} divider sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">
                {a.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Course: {a.course_title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Due: {new Date(a.due_date).toLocaleDateString()}
              </Typography>
              <Typography variant="body2" sx={{ mt: 1 }}>
                {a.description}
              </Typography>
            </Box>
            <Button
              variant="contained"
              disabled={a.has_submitted}
              onClick={() => {
                setSelectedAssignment(a);
                setOpenModal(true);
              }}
            >
              {a.has_submitted ? 'Submitted' : 'Submit'}
            </Button>
          </ListItem>
        ))}
      </List>

      {pageCount > 1 && (
        <Box display="flex" justifyContent="center" mt={2}>
          <Pagination count={pageCount} page={page} onChange={(e, value) => setPage(value)} />
        </Box>
      )}

      {/* Submission Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{
          position: 'absolute',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          boxShadow: 24,
          p: 4,
          borderRadius: 2,
          width: 400
        }}>
          <Typography variant="h6" gutterBottom>
            Submit Assignment
          </Typography>
          <TextField
            label="Submission Text"
            fullWidth
            multiline
            rows={3}
            value={submittedText}
            onChange={(e) => setSubmittedText(e.target.value)}
            sx={{ mb: 2 }}
          />
          <Button
            variant="outlined"
            component="label"
            sx={{ mb: 2 }}
          >
            Upload File
            <input
              type="file"
              hidden
              name="submission_file"
              accept=".pdf,.doc,.docx,.jpg,.png"
              onChange={(e) => setSubmittedFile(e.target.files[0])}
            />
          </Button>
          {submittedFile && (
            <Typography variant="body2" sx={{ mb: 2 }}>{submittedFile.name}</Typography>
          )}
          <Box display="flex" justifyContent="flex-end">
            <Button variant="contained" onClick={handleSubmit}>
              Submit
            </Button>
          </Box>
        </Box>
      </Modal>

      {/* Snackbar Notification */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Assignment;
