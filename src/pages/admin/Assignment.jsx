import React, { useEffect, useState } from "react";
import {
  Box, Button, Typography, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, TablePagination
} from "@mui/material";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function AdminAssignments() {
  const [assignments, setAssignments] = useState([]);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [openModal, setOpenModal] = useState(false);

  // Search + pagination states
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    fetchAssignments();
  }, []);

  const fetchAssignments = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/admin/all-assignments`);
      setAssignments(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleViewResponse = (assignment) => {
    setSelectedAssignment(assignment);
    setOpenModal(true);
  };

  // Filtered assignments based on search
  const filteredAssignments = assignments.filter((a) =>
    a.title.toLowerCase().includes(search.toLowerCase()) ||
    a.tutor_name.toLowerCase().includes(search.toLowerCase()) ||
    a.student_name.toLowerCase().includes(search.toLowerCase())
  );

  // Pagination slice
  const paginatedAssignments = filteredAssignments.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3 }}>
        Assignment Submissions
      </Typography>

      {/* Search Bar */}
      <Box sx={{ mb: 2 }}>
        <TextField
          label="Search assignments..."
          variant="outlined"
          size="small"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ width: 300 }}
        />
      </Box>

      {/* Table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Assignment Title</TableCell>
              <TableCell>Tutor</TableCell>
              <TableCell>Student</TableCell>
              <TableCell>Due Date</TableCell>
              <TableCell>Grade</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedAssignments.map((a, idx) => (
              <TableRow key={idx}>
                <TableCell>{a.title}</TableCell>
                <TableCell>{a.tutor_name}</TableCell>
                <TableCell>{a.student_name}</TableCell>
                <TableCell>{new Date(a.due_date).toLocaleDateString()}</TableCell>
                <TableCell>{a.grade || "Not graded"}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    size="small"
                    onClick={() => handleViewResponse(a)}
                  >
                    View Student Response
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {/* Pagination controls */}
        <TablePagination
          component="div"
          count={filteredAssignments.length}
          page={page}
          onPageChange={(e, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      {/* Modal for Student Response */}
      <Dialog open={openModal} onClose={() => setOpenModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Student Response</DialogTitle>
        <DialogContent dividers>
          {selectedAssignment && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold">Assignment:</Typography>
              <Typography>{selectedAssignment.title}</Typography>

              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>Description:</Typography>
              <Typography>{selectedAssignment.description}</Typography>

              {/* Assignment File */}
              {selectedAssignment.file_url && (
                <Box sx={{ mt: 2 }}>
                  <Typography fontWeight="bold">Assignment File:</Typography>
                  <a
                    href={selectedAssignment.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Assignment File
                  </a>
                </Box>
              )}

              {/* Student Response */}
              <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>Student Response:</Typography>
              <Typography>{selectedAssignment.submission_text}</Typography>

              {/* Submission File */}
              {selectedAssignment.submission_file && (
                <Box sx={{ mt: 2 }}>
                  <Typography fontWeight="bold">Submitted File:</Typography>
                  <a
                    href={`${BASE_URL}/uploads/assignment-submission/${selectedAssignment.submission_file}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View Submission File
                  </a>
                </Box>
              )}

              {/* Grade + Remark */}
              {selectedAssignment.grade && (
                <>
                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>Grade:</Typography>
                  <Typography>{selectedAssignment.grade}</Typography>

                  <Typography variant="subtitle1" fontWeight="bold" sx={{ mt: 2 }}>Remark:</Typography>
                  <Typography>{selectedAssignment.remark}</Typography>
                </>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenModal(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
