import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Paper,
} from "@mui/material";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const VerifyEmail = () => {
  const { token } = useParams();
  const [message, setMessage] = useState("Verifying...");
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    const verify = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/auth/students/verify-email/${token}`
        );
        setMessage(res.data.message);
      } catch (err) {
        setMessage(err.response?.data?.message || "Verification failed.");
        setExpired(true);
      } finally {
        setLoading(false);
      }
    };
    verify();
  }, [token]);

  const handleResend = async () => {
    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/auth/students/resend-verification`, { token });
      setMessage(res.data.message);
      setExpired(false);
    } catch (err) {
      setMessage(err.response?.data?.message || "Failed to resend link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      bgcolor="background.default"
      px={2}
    >
      <Paper elevation={6} sx={{ p: 6, textAlign: "center", borderRadius: 3, maxWidth: 500 }}>
        <Typography variant="h4" color="primary.main" fontWeight="bold" gutterBottom>
          Peer2Learn
        </Typography>
        
        {loading ? (
          <CircularProgress color="primary" />
        ) : (
          <>
            <Typography variant="h6" sx={{ mb: 3 }}>
              {message}
            </Typography>

            {expired && (
              <Button
                variant="contained"
                color="primary"
                onClick={handleResend}
                sx={{ mt: 2, borderRadius: 2, px: 4 }}
              >
                Resend Verification Link
              </Button>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
};

export default VerifyEmail;
