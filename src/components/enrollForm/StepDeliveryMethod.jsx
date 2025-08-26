// components/EnrollForm/StepDeliveryMethod.jsx
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { Computer, LocationOn } from "@mui/icons-material";

export default function StepDeliveryMethod({ formData, setFormData, offices }) {
  const filteredOffices = offices.filter(
    (office) =>
      formData.location === "Online" ||
      office.location?.toLowerCase() === formData.location?.toLowerCase()
  );

  const hasNoOffices = formData.location !== "Online" && filteredOffices.length === 0;

  return (
    <Box>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h6" gutterBottom>
          How would you like to take this course?
        </Typography>

        <Grid
          container
          spacing={2}
          sx={{ mt: 3, display: "flex", justifyContent: "space-around" }}
        >
          <Grid item xs={6}>
            <Button
              fullWidth
              variant={formData.deliveryMethod === "online" ? "contained" : "outlined"}
              startIcon={<Computer />}
              onClick={() =>
                setFormData((prev) => ({
                  ...prev,
                  deliveryMethod: "online",
                  officeId: "", // clear any office selection
                }))
              }
              sx={{ py: 3 }}
            >
              Online
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              fullWidth
              variant={formData.deliveryMethod === "onsite" ? "contained" : "outlined"}
              startIcon={<LocationOn />}
              onClick={() => setFormData((prev) => ({ ...prev, deliveryMethod: "onsite" }))}
              sx={{ py: 3 }}
              disabled={formData.location === "Online"}
            >
              On-Site
            </Button>
          </Grid>
        </Grid>
      </Box>

      {formData.deliveryMethod === "onsite" && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Select Your Nearest Cohub Location
          </Typography>

          {hasNoOffices ? (
            <>
              <Typography variant="body1" color="error" sx={{ mb: 2 }}>
                No Cohub Available in the location you selected, you can choose from any of our
                registered Cohubs:
              </Typography>

              <Grid container spacing={2}>
                {offices.map((office) => {
                  const isSelected = formData.officeId === office.id;
                  return (
                    <Grid item xs={12} sm={6} md={4} key={office.id}>
                      <Card
                        onClick={() =>
                          setFormData((prev) => ({
                            ...prev,
                            officeId: office.id,
                          }))
                        }
                        sx={{
                          p: 2,
                          cursor: "pointer",
                          border: isSelected ? "2px solid #1976d2" : "1px solid #ddd",
                          boxShadow: isSelected ? 6 : 2,
                          transition: "all 0.3s ease",
                          backgroundColor: isSelected ? "#e3f2fd" : "#fff",
                        }}
                      >
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {office.office_name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {office.address}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {office.location}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            📞 {office.phone_number}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </>
          ) : (
            <Grid container spacing={2}>
              {filteredOffices.map((office) => {
                const isSelected = formData.officeId === office.id;
                return (
                  <Grid item xs={12} sm={6} md={4} key={office.id}>
                    <Card
                      onClick={() =>
                        setFormData((prev) => ({
                          ...prev,
                          officeId: office.id,
                        }))
                      }
                      sx={{
                        p: 2,
                        cursor: "pointer",
                        border: isSelected ? "2px solid #1976d2" : "1px solid #ddd",
                        boxShadow: isSelected ? 6 : 2,
                        transition: "all 0.3s ease",
                        backgroundColor: isSelected ? "#e3f2fd" : "#fff",
                      }}
                    >
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {office.office_name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {office.address}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {office.location}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          📞 {office.phone_number}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </Box>
      )}
    </Box>
  );
}
