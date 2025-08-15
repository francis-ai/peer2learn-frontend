import { useEffect, useState } from 'react';
import axios from 'axios';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Chip,
  Rating,
  TextField,
  Tabs,
  Tab,
  Paper,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText
} from '@mui/material';
import {
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  CalendarToday as DateIcon,
  RateReview as ReviewIcon,
} from '@mui/icons-material';

import { useTutorAuth } from '../../context/tutorAuthContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Reviews() {
  const { tutor } = useTutorAuth();
  const tutorId = tutor?.id;

  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!tutorId) return;

    const fetchReviews = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/tutors/reviews/${tutorId}`);
        const data = res.data;

        setReviews(data);

        if (data.length > 0) {
          const totalRating = data.reduce((sum, r) => sum + r.rating, 0);
          const avg = totalRating / data.length;
          setAverageRating(avg);

          // Optional: Update tutor's rating in the DB
          await axios.put(`${BASE_URL}/api/tutors/update-rating/${tutorId}`, { rating: avg });
        } else {
          setAverageRating(0);
        }
      } catch (err) {
        console.error('Error fetching tutor reviews:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [tutorId]);

  const filteredReviews = reviews.filter((review) => {
    const matchesSearch =
      review.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      review.review?.toLowerCase().includes(searchTerm.toLowerCase());
    return filter === 'all' && matchesSearch;
  });

  if (loading) return <Typography>Loading reviews...</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      {/* Rating Summary */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography variant="h3" fontWeight="bold">
                  {averageRating.toFixed(1)}
                </Typography>
                <Rating
                  value={averageRating}
                  precision={0.1}
                  readOnly
                  icon={<StarIcon fontSize="inherit" />}
                  emptyIcon={<StarBorderIcon fontSize="inherit" />}
                />
                <Typography variant="body2" color="text.secondary">
                  {reviews.length} reviews
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Filter Controls */}
      <Paper sx={{ mb: 3, p: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={8} md={9}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: <ReviewIcon color="action" sx={{ mr: 1 }} />,
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Tabs
              value={filter}
              onChange={(e, newValue) => setFilter(newValue)}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                label={
                  <Badge badgeContent={reviews.length} color="primary">
                    All
                  </Badge>
                }
                value="all"
              />
            </Tabs>
          </Grid>
        </Grid>
      </Paper>

      {/* Reviews List */}
      <List>
        {filteredReviews.map((review) => (
          <Card key={review.id} sx={{ mb: 2 }}>
            <CardContent>
              <ListItem disableGutters>
                <ListItemAvatar>
                  <Avatar src={review.avatar || ''}>
                    {review.student_name?.charAt(0)}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <Typography fontWeight="bold">{review.student_name}</Typography>
                      <Chip
                        icon={<DateIcon fontSize="small" />}
                        label={new Date(review.created_at || review.date).toLocaleDateString()}
                        size="small"
                        variant="outlined"
                      />
                    </Box>
                  }
                  secondary={
                    <>
                      <Rating
                        value={review.rating}
                        readOnly
                        size="small"
                        sx={{ my: 1 }}
                      />
                      <Typography variant="body2" component="div">
                        {review.review}
                      </Typography>
                    </>
                  }
                />
              </ListItem>
            </CardContent>
          </Card>
        ))}
      </List>
    </Box>
  );
}
