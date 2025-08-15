import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Percentage = () => {
  const [tutorFull, setTutorFull] = useState("");
  const [platformFull, setPlatformFull] = useState("");
  const [tutorInstallment, setTutorInstallment] = useState("");
  const [platformInstallment, setPlatformInstallment] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [fetchedData, setFetchedData] = useState(null);

  // Fetch existing percentages
  const fetchPercentages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/api/admin/percentages`);
      if (data.success && data.data) {
        setTutorFull(data.data.tutor_percentage_full || "");
        setPlatformFull(data.data.platform_percentage_full || "");
        setTutorInstallment(data.data.tutor_percentage_installment || "");
        setPlatformInstallment(data.data.platform_percentage_installment || "");
        setFetchedData(data.data); // store fetched data for table display
      }
    } catch (err) {
      setError("Failed to load percentages.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPercentages();
  }, []);

  // Save / Update percentages
  const handleSave = async () => {
    if (
      !tutorFull ||
      !platformFull ||
      !tutorInstallment ||
      !platformInstallment
    ) {
      setError("All four percentages are required.");
      return;
    }

    if (
      [tutorFull, platformFull, tutorInstallment, platformInstallment].some(
        (val) => isNaN(val)
      )
    ) {
      setError("Percentages must be numbers.");
      return;
    }

    setError("");
    setSuccess("");
    setSaving(true);
    try {
      const { data } = await axios.put(`${BASE_URL}/api/admin/percentages`, {
        tutor_percentage_full: tutorFull,
        platform_percentage_full: platformFull,
        tutor_percentage_installment: tutorInstallment,
        platform_percentage_installment: platformInstallment,
      });

      if (data.success) {
        setSuccess("Percentages updated successfully.");
        fetchPercentages(); // refresh table after save
      } else {
        setError("Failed to update percentages.");
      }
    } catch (err) {
      setError("An error occurred while saving.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight="bold" mb={2}>
        Manage Percentages
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Paper sx={{ p: 3, maxWidth: 400, mb: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <TextField
              label="Tutor Percentage (Full Payment) %"
              fullWidth
              value={tutorFull}
              onChange={(e) => setTutorFull(e.target.value)}
              type="number"
              sx={{ mb: 2 }}
            />

            <TextField
              label="Platform Percentage (Full Payment) %"
              fullWidth
              value={platformFull}
              onChange={(e) => setPlatformFull(e.target.value)}
              type="number"
              sx={{ mb: 2 }}
            />

            <TextField
              label="Tutor Percentage (Installment) %"
              fullWidth
              value={tutorInstallment}
              onChange={(e) => setTutorInstallment(e.target.value)}
              type="number"
              sx={{ mb: 2 }}
            />

            <TextField
              label="Platform Percentage (Installment) %"
              fullWidth
              value={platformInstallment}
              onChange={(e) => setPlatformInstallment(e.target.value)}
              type="number"
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? <CircularProgress size={24} /> : "Save"}
            </Button>
          </Paper>

          {/* Table Display */}
          {fetchedData && (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Tutor % (Full)</strong></TableCell>
                    <TableCell><strong>Platform % (Full)</strong></TableCell>
                    <TableCell><strong>Tutor % (Installment)</strong></TableCell>
                    <TableCell><strong>Platform % (Installment)</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{fetchedData.tutor_percentage_full}</TableCell>
                    <TableCell>{fetchedData.platform_percentage_full}</TableCell>
                    <TableCell>{fetchedData.tutor_percentage_installment}</TableCell>
                    <TableCell>{fetchedData.platform_percentage_installment}</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}
    </Box>
  );
};

export default Percentage;
