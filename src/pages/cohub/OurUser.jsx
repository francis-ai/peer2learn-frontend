import React, { useEffect, useState } from "react";
import {
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TablePagination,
  CircularProgress,
} from "@mui/material";
import { useCohubAuth } from "../../context/cohubAuthContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const OurUser = () => {
  const { cohub } = useCohubAuth();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/cohub/our-user/${cohub.id}`);
        const data = await res.json();
        setStudents(data);
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStudents();
  }, [cohub.id]);

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Filter students by search term
  const filteredStudents = students.filter(
    (student) =>
      student.student_name.toLowerCase().includes(search.toLowerCase()) ||
      student.tutor_name.toLowerCase().includes(search.toLowerCase()) ||
      student.course_name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <Container sx={{ mt: 4, textAlign: "center" }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 1 }}>Loading student details...</Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Cohub Students
      </Typography>

      {/* Search Bar */}
      <TextField
        label="Search by student, tutor, or course"
        variant="outlined"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{ mb: 2 }}
      />

      {/* Table */}
      <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
              <TableCell><strong>Student Name</strong></TableCell>
              <TableCell><strong>Tutor Name</strong></TableCell>
              <TableCell><strong>Course Name</strong></TableCell>
              <TableCell><strong>Duration</strong></TableCell>
              <TableCell><strong>Completed</strong></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStudents
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((row) => (
                <TableRow key={row.student_id}>
                  <TableCell>{row.student_name}</TableCell>
                  <TableCell>{row.tutor_name}</TableCell>
                  <TableCell>{row.course_name}</TableCell>
                  <TableCell>{row.course_duration}</TableCell>
                  <TableCell>
                    {row.is_completed ? "✅ Yes" : "❌ No"}
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <TablePagination
        component="div"
        count={filteredStudents.length}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        rowsPerPageOptions={[5, 10, 25]}
      />
    </Container>
  );
};

export default OurUser;
