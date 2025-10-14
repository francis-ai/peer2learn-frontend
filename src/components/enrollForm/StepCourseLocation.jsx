// components/EnrollForm/StepCourse.jsx
import { useState, useMemo } from "react";
import { Grid, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

export default function StepCourse({ courses, formData, handleChange }) {
  const [selectedCategory, setSelectedCategory] = useState("");

  // Get unique categories from courses
  const categories = useMemo(() => {
    const cats = courses.map((c) => c.category);
    return [...new Set(cats)]; // remove duplicates
  }, [courses]);

  // Filter courses by selected category
  const filteredCourses = useMemo(() => {
    if (!selectedCategory) return [];
    return courses.filter((c) => c.category === selectedCategory);
  }, [courses, selectedCategory]);

  return (
    <Grid container spacing={3}>
      {/* Category Select */}
      <Grid item xs={12} md={6} sx={{ width: { xs: "250px", md: "360px" }, mx: "auto" }}>
        <FormControl fullWidth>
          <InputLabel>Select Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              handleChange({ target: { name: "course", value: "" } }); // reset course
            }}
            label="Select Category"
          >
            {categories.map((cat, idx) => (
              <MenuItem key={idx} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      {/* Course Select */}
      <Grid item xs={12} md={6} sx={{ width: { xs: "250px", md: "360px" }, mx: "auto" }}>
        <FormControl fullWidth disabled={!selectedCategory}>
          <InputLabel>Select Course</InputLabel>
          <Select
            name="course"
            value={formData.course || ""}
            onChange={handleChange}
            label="Select Course"
            required
          >
            {filteredCourses.map((course) => (
              <MenuItem key={course.id} value={course.id}>
                {course.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
    </Grid>
  );
}
