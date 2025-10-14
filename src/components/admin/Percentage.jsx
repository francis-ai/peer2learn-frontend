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
  // State for form fields
  const [tutorFull, setTutorFull] = useState("");
  const [platformFull, setPlatformFull] = useState("");
  const [tutorInstallment, setTutorInstallment] = useState("");
  const [platformInstallment, setPlatformInstallment] = useState("");
  const [cohubPercentage, setCohubPercentage] = useState("");
  const [developerPercentage, setDeveloperPercentage] = useState("");

  // UI States
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [fetchedData, setFetchedData] = useState(null);

  // ✅ Fetch existing percentages
  const fetchPercentages = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${BASE_URL}/api/admin/percentages`);
      if (data.success && data.data) {
        setTutorFull(data.data.tutor_percentage_full || "");
        setPlatformFull(data.data.platform_percentage_full || "");
        setTutorInstallment(data.data.tutor_percentage_installment || "");
        setPlatformInstallment(data.data.platform_percentage_installment || "");
        setCohubPercentage(data.data.cohub_percentage || "");
        setDeveloperPercentage(data.data.developer_percentage || "");
        setFetchedData(data.data);
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

  // ✅ Save / Update percentages
  const handleSave = async () => {
    if (
      !tutorFull ||
      !platformFull ||
      !tutorInstallment ||
      !platformInstallment ||
      !cohubPercentage ||
      !developerPercentage
    ) {
      setError("All fields are required.");
      return;
    }

    if (
      [
        tutorFull,
        platformFull,
        tutorInstallment,
        platformInstallment,
        cohubPercentage,
        developerPercentage,
      ].some((val) => isNaN(val))
    ) {
      setError("All percentages must be numbers.");
      return;
    }

    const totalFull =
      Number(tutorFull) +
      Number(platformFull) +
      Number(cohubPercentage) +
      Number(developerPercentage);

    const totalInstallment =
      Number(tutorInstallment) +
      Number(platformInstallment) +
      Number(cohubPercentage) +
      Number(developerPercentage);

    if (totalFull !== 100 || totalInstallment !== 100) {
      setError(
        `Total percentage must equal 100%. (Full: ${totalFull}%, Installment: ${totalInstallment}%)`
      );
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
        cohub_percentage: cohubPercentage,
        developer_percentage: developerPercentage,
      });

      if (data.success) {
        setSuccess("✅ Percentages updated successfully.");
        fetchPercentages();
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
      <Typography variant="h5" fontWeight="bold" mb={3}>
        Manage Percentage Distribution
      </Typography>

      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Paper sx={{ p: 3, maxWidth: 500, mb: 4 }}>
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
              label="Tutor % (Full Payment)"
              fullWidth
              value={tutorFull}
              onChange={(e) => setTutorFull(e.target.value)}
              type="number"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Platform % (Full Payment)"
              fullWidth
              value={platformFull}
              onChange={(e) => setPlatformFull(e.target.value)}
              type="number"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Tutor % (Installment)"
              fullWidth
              value={tutorInstallment}
              onChange={(e) => setTutorInstallment(e.target.value)}
              type="number"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Platform % (Installment)"
              fullWidth
              value={platformInstallment}
              onChange={(e) => setPlatformInstallment(e.target.value)}
              type="number"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Cohub %"
              fullWidth
              value={cohubPercentage}
              onChange={(e) => setCohubPercentage(e.target.value)}
              type="number"
              sx={{ mb: 2 }}
            />
            <TextField
              label="Developer %"
              fullWidth
              value={developerPercentage}
              onChange={(e) => setDeveloperPercentage(e.target.value)}
              type="number"
              sx={{ mb: 2 }}
            />

            <Button
              variant="contained"
              color="primary"
              onClick={handleSave}
              disabled={saving}
              fullWidth
            >
              {saving ? <CircularProgress size={24} /> : "Save Percentages"}
            </Button>
          </Paper>

          {/* ✅ Display Saved Percentages */}
          {fetchedData && (
            <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell><strong>Tutor % (Full)</strong></TableCell>
                    <TableCell><strong>Platform % (Full)</strong></TableCell>
                    <TableCell><strong>Tutor % (Installment)</strong></TableCell>
                    <TableCell><strong>Platform % (Installment)</strong></TableCell>
                    <TableCell><strong>Cohub %</strong></TableCell>
                    <TableCell><strong>Developer %</strong></TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>{fetchedData.tutor_percentage_full}%</TableCell>
                    <TableCell>{fetchedData.platform_percentage_full}%</TableCell>
                    <TableCell>{fetchedData.tutor_percentage_installment}%</TableCell>
                    <TableCell>{fetchedData.platform_percentage_installment}%</TableCell>
                    <TableCell>{fetchedData.cohub_percentage}%</TableCell>
                    <TableCell>{fetchedData.developer_percentage}%</TableCell>
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
