// src/components/Category.jsx
import React from "react";
import { Box, Typography, Card, CardContent, CardMedia, Grid, useTheme } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const categories = [
  {
    title: "Tech Stack",
    image: "https://cdn-icons-png.flaticon.com/512/2721/2721267.png",
    description: "Explore frameworks, tools, and technologies shaping modern development.",
  },
  {
    title: "Languages",
    image: "https://cdn-icons-png.flaticon.com/512/1995/1995574.png",
    description: "Master programming languages that power web and mobile apps.",
  },
  {
    title: "Academics",
    image: "https://cdn-icons-png.flaticon.com/512/3062/3062634.png",
    description: "Dive into courses and subjects that build strong technical foundations.",
  },
];

export default function Category() {
  const theme = useTheme();
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        py: 3,
        px: { xs: 2, md: 3 },
        textAlign: "center",
        background: "#f8f9fa",
      }}
    >
      <Typography 
        variant="h3" 
        sx={{ 
          fontWeight: 700,
          mb: 2,
          color: theme.palette.text.primary,
          [theme.breakpoints.down('sm')]: {
            fontSize: '1.5rem'
          }
        }}
        data-aos="fade-down"
      >
        Explore Our Categories
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {categories.map((cat, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
            >
              <Card
                onDoubleClick={() => navigate("/enroll")}
                sx={{
                  borderRadius: "20px",
                  overflow: "hidden",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  bgcolor: "#fff",
                  textAlign: "center",
                  cursor: "pointer",
                  width: { xs: "100%", md: "320px" },
                  transition: "all 0.3s ease",
                  "&:hover": {
                    boxShadow: "0 6px 18px rgba(0,0,0,0.2)",
                    transform: "translateY(-4px)",
                  },
                  "&:active": {
                    transform: "scale(0.98)",
                  },
                }}
              >
                <CardMedia
                  component="img"
                  image={cat.image}
                  alt={cat.title}
                  sx={{
                    width: "100%",
                    height: 180,
                    objectFit: "contain",
                    background: "#e9f5f3",
                  }}
                />
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                    {cat.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {cat.description}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 1.5,
                      fontStyle: "italic",
                      color: theme.palette.primary.main,
                    }}
                  >
                    Double tap to enroll →
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
