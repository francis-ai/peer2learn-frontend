import React, { useEffect, useState } from "react";
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
  TextField,
  Pagination,
} from "@mui/material";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Classes() {
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/admin/all-classes-schedule`);
      setClasses(data);
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const filteredClasses = classes.filter(
    (cls) =>
      cls.student_name?.toLowerCase().includes(search.toLowerCase()) ||
      cls.tutor_name?.toLowerCase().includes(search.toLowerCase()) ||
      cls.class_title?.toLowerCase().includes(search.toLowerCase())
  );

  const paginatedClasses = filteredClasses.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 2 }}>
        All Classes Schedule
      </Typography>

      {/* Search bar */}
      <TextField
        label="Search"
        variant="outlined"
        size="small"
        fullWidth
        sx={{ mb: 2 }}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <TableContainer
        component={Paper}
        sx={{
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 2,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Course Name</TableCell>
              <TableCell>Student Name</TableCell>
              <TableCell>Tutor Name</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Time</TableCell>
              <TableCell>Feedback</TableCell>
              <TableCell>Rating</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedClasses.length > 0 ? (
              paginatedClasses.map((cls, index) => (
                <TableRow key={cls.id}>
                  <TableCell>{(page - 1) * rowsPerPage + index + 1}</TableCell>
                  <TableCell>{cls.course_name}</TableCell>
                  <TableCell>{cls.student_name}</TableCell>
                  <TableCell>{cls.tutor_name}</TableCell>
                  <TableCell>{cls.date}</TableCell>
                  <TableCell>{cls.time}</TableCell>
                  <TableCell>{cls.review || "No feedback yet"}</TableCell>
                  <TableCell>{cls.rating || "N/A"}</TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={9} align="center">
                  No classes found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      <Box display="flex" justifyContent="center" mt={2}>
        <Pagination
          count={Math.ceil(filteredClasses.length / rowsPerPage)}
          page={page}
          onChange={(e, value) => setPage(value)}
          color="primary"
        />
      </Box>
    </Box>
  );
}
