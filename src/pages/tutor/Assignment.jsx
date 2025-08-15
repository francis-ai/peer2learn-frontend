import React, { useEffect, useState, useCallback } from 'react';
import {
  Box, Tabs, Tab, Typography, Grid, Card, CardContent, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField,
  Table, TableHead, TableRow, TableCell, TableBody, IconButton,
  Snackbar, Alert, CircularProgress
} from '@mui/material';
import FaqIcon from '@mui/icons-material/Help';
import SecurityIcon from '@mui/icons-material/Security';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DownloadIcon from '@mui/icons-material/Download';
import { Download } from '@mui/icons-material';
import { useTutorAuth } from '../../context/tutorAuthContext';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Assignment() {
  const { tutor } = useTutorAuth();
  const tutorId = tutor?.id;

  const [tabValue, setTabValue] = useState(0);
  const [students, setStudents] = useState([]);
  const [assignments, setAssignments] = useState([]);

  // Assignment modal
  const [openModal, setOpenModal] = useState(false);
  const [selectedEnrollmentId, setSelectedEnrollmentId] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [file, setFile] = useState(null);

  // Grading modal
  const [gradingModal, setGradingModal] = useState(false);
  const [gradingAssignmentId, setGradingAssignmentId] = useState(null);
  const [grade, setGrade] = useState('');
  const [remark, setRemark] = useState('');
  const [submissionText, setSubmissionText] = useState(null);
  const [submissionFile, setSubmissionFile] = useState(null);
  const [myGrade, setMyGrade] = useState(null);
  const [myRemark, setMyRemark] = useState(null);
  
  const [loadingSubmission, setLoadingSubmission] = useState(false);

  // Snackbar
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleTabChange = (e, newValue) => setTabValue(newValue);

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchStudents = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/tutors/active-student/${tutorId}`, {
        headers: { 'Cache-Control': 'no-cache' },
      });
      setStudents(res.data);
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to fetch students', 'error');
    }
  }, [tutorId]);

  const fetchAssignments = useCallback(async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/tutors/student-assignments/${tutorId}?t=${Date.now()}`);
      setAssignments(res.data);
    } catch (err) {
      console.error('Error fetching assignments:', err);
      showSnackbar('Failed to fetch assignments', 'error');
    }
  }, [tutorId]);

  useEffect(() => {
    if (tutorId) {
      fetchStudents();
      fetchAssignments();
    }
  }, [tutorId, fetchStudents, fetchAssignments]);

  const openAssignmentModal = (enrollmentId) => {
    setSelectedEnrollmentId(enrollmentId);
    setOpenModal(true);
  };

  const handleAssign = async () => {
    if (!title || !description || !selectedEnrollmentId) {
      showSnackbar('Please complete all required fields', 'error');
      return;
    }

    const formData = new FormData();
    formData.append('title', title);
    formData.append('description', description);
    formData.append('file', file);
    formData.append('enrollment_id', selectedEnrollmentId);
    formData.append('due_date', dueDate);

    try {
      await axios.post(`${BASE_URL}/api/tutors/assign-assignment`, formData);
      showSnackbar('Assignment assigned successfully');
      setOpenModal(false);
      setTitle('');
      setDescription('');
      setDueDate('');
      setFile(null);
      fetchAssignments();
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to assign assignment', 'error');
    }
  };

  const openGradingModal = async (assignmentId) => {
    setGradingAssignmentId(assignmentId);
    setLoadingSubmission(true);
    setGradingModal(true);
    try {
      const res = await axios.get(`${BASE_URL}/api/tutors/assignment/${assignmentId}`);
      const { submission } = res.data;
      setSubmissionText(submission?.submission_text || 'No submission text found');
      setSubmissionFile(submission?.submission_file || 'No submission file found');
      setMyGrade(submission?.grade || 'No submission file found');
      setMyRemark(submission?.remark || 'No submission file found');
      setGrade(submission?.score || '');
      setRemark(submission?.remarks || '');
    } catch (err) {
      console.error('Failed to fetch assignment detail:', err);
      showSnackbar('Failed to load submission', 'error');
    } finally {
      setLoadingSubmission(false);
    }
  };

  const handleGradeSubmit = async () => {
    if (!grade) {
      showSnackbar('Please enter a grade', 'error');
      return;
    }

    try {
      await axios.put(`${BASE_URL}/api/tutors/grade-assignment/${gradingAssignmentId}`, {
        grade,
        remark,
      });
      showSnackbar('Grade submitted successfully');
      setGradingModal(false);
      setGrade('');
      setRemark('');
      setGradingAssignmentId(null);
      fetchAssignments();
    } catch (err) {
      console.error(err);
      showSnackbar('Failed to grade assignment', 'error');
    }
  };

  return (
    <Box p={3}>
      <Tabs value={tabValue} onChange={handleTabChange} variant="fullWidth">
        <Tab label="Active Students" icon={<FaqIcon />} />
        <Tab label="Manage Assignments" icon={<SecurityIcon />} />
      </Tabs>

      {tabValue === 0 && (
        <Grid container spacing={2} mt={2}>
          {students.length === 0 ? (
            <Typography>No active students found.</Typography>
          ) : (
            students.map((student) => (
              <Grid item xs={12} md={4} key={student.id}>
                <Card>
                  <CardContent>
                    <Typography variant="h6">{student.student_name}</Typography>
                    <Typography variant="body2">{student.student_email}</Typography>
                    <Typography variant="body2">{student.course_title}</Typography>
                    <Button
                      variant="contained"
                      fullWidth
                      sx={{ mt: 2 }}
                      onClick={() => openAssignmentModal(student.enrollment_id)}
                    >
                      Give Assignment
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      )}

      {tabValue === 1 && (
        <Table sx={{ mt: 3 }}>
          <TableHead>
            <TableRow>
              <TableCell>Student</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Submitted</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {assignments.map((item) => (
              <TableRow key={item.assignment_id}>
                <TableCell>{item.student_name}</TableCell>
                <TableCell>{item.title}</TableCell>
                <TableCell>{item.submission_count > 0 ? 'Yes' : 'No'}</TableCell>
                <TableCell>{myGrade || 'Ungraded'}</TableCell>
                <TableCell>
                  {item.submission_count > 0 && (
                    <>
                      {item.submission_file_url && (
                        <IconButton href={item.submission_file_url} target="_blank">
                          <DownloadIcon />
                        </IconButton>
                      )}
                      <IconButton onClick={() => openGradingModal(item.assignment_id)}>
                        <VisibilityIcon />
                      </IconButton>
                    </>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={openModal} onClose={() => setOpenModal(false)}>
        <DialogTitle>Assign Assignment</DialogTitle>
        <DialogContent>
          <TextField label="Title" fullWidth margin="normal" value={title} onChange={(e) => setTitle(e.target.value)} />
          <TextField label="Description" fullWidth multiline rows={4} margin="normal" value={description} onChange={(e) => setDescription(e.target.value)} />
          <TextField label="Due Date" type="date" fullWidth margin="normal" InputLabelProps={{ shrink: true }} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          <input type="file" style={{ marginTop: 12 }} onChange={(e) => setFile(e.target.files[0])} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAssign}>Assign</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={gradingModal} onClose={() => setGradingModal(false)}>
        <DialogTitle>Grade Assignment</DialogTitle>
        <DialogContent>
          {loadingSubmission ? (
            <CircularProgress />
          ) : (
            <>
              <Typography variant="subtitle2" gutterBottom>
                Student's Submission:
              </Typography>
              <Box sx={{ backgroundColor: '#f4f4f4', p: 2, borderRadius: 2, mb: 2, whiteSpace: 'pre-wrap' }}>
                {submissionText}
              </Box>
              <Box sx={{ backgroundColor: '#f4f4f4', p: 2, borderRadius: 2, mb: 2, whiteSpace: 'pre-wrap' }}>
                {myGrade}
              </Box>
              <Box sx={{ backgroundColor: '#f4f4f4', p: 2, borderRadius: 2, mb: 2, whiteSpace: 'pre-wrap' }}>
                {myRemark}
              </Box>
              <Box
                sx={{
                    backgroundColor: '#f4f4f4',
                    p: 2,
                    borderRadius: 2,
                    mb: 2,
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}
                >
                <Typography sx={{ whiteSpace: 'pre-wrap', mr: 2 }}>
                    {submissionFile}
                </Typography>

                {submissionFile && (
                    <IconButton
                    component="a"
                    href={`${BASE_URL}/uploads/assignment-submission/${submissionFile}`}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    >
                    <Download />
                    </IconButton>
                )}
                </Box>

              <TextField label="Grade" fullWidth margin="normal" value={grade} onChange={(e) => setGrade(e.target.value)} />
              <TextField label="Remark" fullWidth multiline rows={3} margin="normal" value={remark} onChange={(e) => setRemark(e.target.value)} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setGradingModal(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleGradeSubmit}>Submit Grade</Button>
        </DialogActions>
      </Dialog>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
