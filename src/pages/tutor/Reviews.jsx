import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Avatar,
  Grid,
  Rating,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Chip,
  CircularProgress,
} from "@mui/material";
import { Star as StarIcon, StarBorder as StarBorderIcon, CalendarToday as DateIcon } from "@mui/icons-material";
import { useTutorAuth } from "../../context/tutorAuthContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Reviews() {
  const { tutor } = useTutorAuth();
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch Reviews
  useEffect(() => {
    if (!tutor?.id) return;
    const fetchReviews = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/api/tutors/reviews/${tutor.id}`);
        setReviews(data);
        const avg = data.length ? data.reduce((s, r) => s + r.rating, 0) / data.length : 0;
        setAverageRating(avg);

        // Optional: update tutor rating in DB
        if (avg > 0) {
          await axios.put(`${BASE_URL}/api/tutors/update-rating/${tutor.id}`, { rating: avg });
        }
      } catch (err) {
        console.error("Error fetching reviews:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [tutor?.id]);

  if (loading)
    return (
      <Box sx={{ textAlign: "center", mt: 6 }}>
        <CircularProgress />
        <Typography variant="body2" mt={2}>
          Loading reviews...
        </Typography>
      </Box>
    );

  return (
    <Box sx={{ py: 3 }}>
      {/* Rating Summary */}
      <Card sx={{ mb: 4 }}>
        <CardContent>
          <Grid container justifyContent="center" textAlign="center">
            <Grid item xs={12} sm={6}>
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
                {reviews.length} review{reviews.length !== 1 && "s"}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Box sx={{ textAlign: "center", py: 5 }}>
          <Typography variant="h6" color="text.secondary">
            No reviews yet
          </Typography>
        </Box>
      ) : (
        <List>
          {reviews.map((review) => (
            <Card key={review.id} sx={{ mb: 2 }}>
              <CardContent>
                <ListItem disableGutters>
                  <ListItemAvatar>
                    <Avatar src={review.avatar || ""}>
                      {review.student_name?.charAt(0) || "U"}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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
                        <Rating value={review.rating} readOnly size="small" sx={{ my: 1 }} />
                        <Typography variant="body2">{review.review}</Typography>
                      </>
                    }
                  />
                </ListItem>
              </CardContent>
            </Card>
          ))}
        </List>
      )}
    </Box>
  );
}
