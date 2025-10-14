import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TablePagination,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Enrollments() {
  const [enrollments, setEnrollments] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  // 🧠 Fetch all enrollments
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/course-enrollments`);
        setEnrollments(res.data.data || []);
        setFiltered(res.data.data || []);
      } catch (err) {
        console.error("Error fetching enrollments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 🔍 Search logic
  useEffect(() => {
    const result = enrollments.filter((enroll) =>
      `${enroll.student_name} ${enroll.course_name} ${enroll.tutor_name}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFiltered(result);
  }, [search, enrollments]);

  // 🧩 Pagination handlers
  const handleChangePage = (_, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (e) => {
    setRowsPerPage(parseInt(e.target.value, 10));
    setPage(0);
  };

  if (loading) return <Typography sx={{ p: 3 }}>Loading enrollments...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" fontWeight={600} mb={2}>
        Course Enrollments
      </Typography>

      {/* 🔍 Search bar */}
      <TextField
        variant="outlined"
        size="small"
        placeholder="Search by student, tutor, or course..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2, width: "100%", maxWidth: 400 }}
      />

      {/* 📋 Enrollment Table */}
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Student</TableCell>
                <TableCell>Course</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Tutor</TableCell>
                <TableCell>Payment</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="center">Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {filtered
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => (
                  <TableRow key={row.enrollment_id}>
                    <TableCell>{page * rowsPerPage + index + 1}</TableCell>
                    <TableCell>{row.student_name || "—"}</TableCell>
                    <TableCell>{row.course_name || "—"}</TableCell>
                    <TableCell>{row.category || "—"}</TableCell>
                    <TableCell>{row.tutor_name || "—"}</TableCell>
                    <TableCell>
                      {row.is_fully_paid
                        ? "Fully Paid"
                        : row.amount_remaining > 0
                        ? "Partially Paid"
                        : "Pending"}
                    </TableCell>
                    <TableCell sx={{ textTransform: "capitalize" }}>
                      {row.status}
                    </TableCell>
                    <TableCell>
                      {new Date(row.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => setSelected(row)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9} align="center">
                    No enrollments found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <TablePagination
          component="div"
          count={filtered.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Paper>

      {/* 🪟 Modal Popup for Details */}
      <Dialog
        open={!!selected}
        onClose={() => setSelected(null)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Enrollment Details</DialogTitle>
        <DialogContent dividers>
          {selected && (
            <Box>
              <Typography><strong>Student:</strong> {selected.student_name}</Typography>
              <Typography><strong>Tutor:</strong> {selected.tutor_name}</Typography>
              <Typography><strong>Course:</strong> {selected.course_name}</Typography>
              <Typography><strong>Category:</strong> {selected.category}</Typography>
              <Typography><strong>Delivery:</strong> {selected.delivery_method}</Typography>
              <Typography><strong>Payment Plan:</strong> {selected.payment_plan}</Typography>
              <Typography><strong>Amount Paid:</strong> ₦{selected.amount_paid}</Typography>
              <Typography><strong>Remaining:</strong> ₦{selected.amount_remaining}</Typography>
              <Typography><strong>Original Price:</strong> ₦{selected.original_price}</Typography>
              <Typography><strong>Status:</strong> {selected.status}</Typography>
              <Typography><strong>Completed:</strong> {selected.is_completed ? "Yes" : "No"}</Typography>
              <Typography><strong>Fully Paid:</strong> {selected.is_fully_paid ? "Yes" : "No"}</Typography>
              <Typography><strong>Created:</strong> {new Date(selected.created_at).toLocaleString()}</Typography>
              {selected.completed_at && (
                <Typography><strong>Completed At:</strong> {new Date(selected.completed_at).toLocaleString()}</Typography>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelected(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
