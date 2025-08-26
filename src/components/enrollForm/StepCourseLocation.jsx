// components/EnrollForm/StepCourseLocation.jsx
import { Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function StepCourseLocation({ courses, locations, formData, handleChange }) {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6} sx={{ width: { xs: "250px", md: "360px" }, mx: "auto" }}>
        <FormControl fullWidth>
          <InputLabel>Select Course</InputLabel>
          <Select
            name="course"
            value={formData.course}
            onChange={handleChange}
            label="Select Course"
            required
          >
            {courses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6} sx={{ width: { xs: "250px", md: "360px" }, mx: "auto" }}>
        <FormControl fullWidth>
          <InputLabel>Select Location</InputLabel>
          <Select
            name="location"
            value={formData.location}
            onChange={handleChange}
            label="Select Location"
            required
          >
            {locations.map((loc) => (
              <MenuItem key={loc.id} value={loc.location_name}>
                {loc.location_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}
