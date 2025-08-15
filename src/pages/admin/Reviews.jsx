import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Avatar, Stack, Pagination, Rating
} from '@mui/material';
import {
  Search as SearchIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import axios from 'axios';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/tutor-reviews`);
        setReviews(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch tutor reviews:', err);
      }
    };

    fetchReviews();
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredReviews = reviews.filter((review) => {
    const search = searchTerm.toLowerCase();
    return (
      review.tutor_name.toLowerCase().includes(search) ||
      review.student_name.toLowerCase().includes(search) ||
      review.course_name.toLowerCase().includes(search)
    );
  });

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 3, fontWeight: 'bold' }}>
        Tutor Reviews
      </Typography>

      {/* Search Bar */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack direction="row" spacing={2} alignItems="center">
            <TextField
              variant="outlined"
              size="small"
              placeholder="Search reviews..."
              InputProps={{ startAdornment: <SearchIcon color="action" /> }}
              sx={{ flexGrow: 1 }}
              onChange={handleSearch}
            />
          </Stack>
        </CardContent>
      </Card>

      {/* Reviews Table */}
      <Card>
        <CardContent>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Tutor</TableCell>
                  <TableCell>Student</TableCell>
                  <TableCell>Course</TableCell>
                  <TableCell>Rating</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredReviews
                  .slice((page - 1) * rowsPerPage, page * rowsPerPage)
                  .map((review) => (
                    <TableRow key={review.id} hover>
                      <TableCell>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <Avatar>
                            {review.tutor_name?.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)}
                          </Avatar>
                          <Typography>{review.tutor_name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell>{review.student_name}</TableCell>
                      <TableCell>{review.course_name}</TableCell>
                      <TableCell>
                        <Rating
                          value={parseFloat(review.rating)}
                          precision={0.5}
                          readOnly
                          emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                        />
                      </TableCell>
                      <TableCell>{new Date(review.created_at).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Pagination */}
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
            <Pagination
              count={Math.ceil(filteredReviews.length / rowsPerPage)}
              page={page}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}
