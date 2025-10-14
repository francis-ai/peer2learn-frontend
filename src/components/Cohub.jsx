import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Container,
  useTheme
} from "@mui/material";
import { motion } from "framer-motion";
import { LocationOn, Groups } from "@mui/icons-material";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function CohubShowcase() {
  const [cohubs, setCohubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchCohubs = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/admin/landing-cohubs`);
        const data = await res.json();
        setCohubs(Array.isArray(data) ? data.slice(0, 6) : []);
      } catch (err) {
        console.error("Error fetching cohubs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCohubs();
  }, []);

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
        <CircularProgress size={45} />
      </Box>
    );

  if (cohubs.length === 0)
    return (
      <Box textAlign="center" py={10}>
        <Groups sx={{ fontSize: 60, color: "text.secondary" }} />
        <Typography variant="h5" mt={2} color="text.secondary">
          No Cohubs Available
        </Typography>
      </Box>
    );

  return (
    <Box
      sx={{
        py: { xs: 8, md: 10 },
        background:
          "linear-gradient(180deg, #f8faff 0%, #eef3ff 40%, #ffffff 100%)",
      }}
    >
      {/* Header */}
      <Container maxWidth="lg" sx={{ textAlign: "center", mb: 8 }}>
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
          Peer2Learn Hubs
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "#5f6f84",
            maxWidth: 650,
            mx: "auto",
          }}
        >
          Explore inspiring environments where creativity meets productivity.
        </Typography>
      </Container>

      {/* Centered Card Layout */}
      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            flexWrap: { xs: "nowrap", md: "wrap" },
            justifyContent: "center",
            gap: 3,
            px: { xs: 2, md: 0 },
            overflowX: { xs: "auto", md: "visible" },
            scrollSnapType: { xs: "x mandatory", md: "none" },
            "&::-webkit-scrollbar": { display: "none" },
          }}
        >
          {cohubs.map((cohub, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.15 }}
              style={{
                scrollSnapAlign: "center",
                flex: "0 0 300px",
              }}
            >
              <Card
                sx={{
                  borderRadius: 5,
                  overflow: "hidden",
                  backdropFilter: "blur(12px)",
                  width: {xs: '100%', md: '330px'},
                  background:
                    "linear-gradient(135deg, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.4) 100%)",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.08)",
                  transition: "all 0.4s ease",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
                  },
                }}
              >
                {/* Image */}
                <Box
                  sx={{ position: "relative", height: 200, overflow: "hidden" }}
                >
                  <motion.img
                    src={
                      cohub.office_images?.length
                        ? `${BASE_URL}/uploads/cohub/${cohub.office_images[0]}`
                        : "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=600&h=400&fit=crop"
                    }
                    alt={cohub.name}
                    initial={{ scale: 1 }}
                    whileHover={{ scale: 1.08 }}
                    transition={{ duration: 0.4 }}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      borderBottom: "3px solid rgba(0,0,0,0.05)",
                    }}
                  />

                  <Chip
                    label="Verified"
                    size="small"
                    sx={{
                      position: "absolute",
                      top: 12,
                      left: 12,
                      bgcolor: "#00C853",
                      color: "#fff",
                      fontWeight: 600,
                      fontSize: "0.7rem",
                      boxShadow: "0 3px 10px rgba(0,0,0,0.2)",
                    }}
                  />
                </Box>

                {/* Details */}
                <CardContent sx={{ p: 3, textAlign: "left" }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: "#1e293b",
                      textTransform: "capitalize",
                      mb: 1,
                    }}
                  >
                    {cohub.name}
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: "#607d8b",
                      mb: 1,
                    }}
                  >
                    <LocationOn sx={{ fontSize: 18, mr: 1 }} />
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 500, color: "#455a64" }}
                    >
                      {cohub.location}
                    </Typography>
                  </Box>

                  <Typography
                    variant="body2"
                    sx={{
                      color: "#6b7280",
                      lineHeight: 1.5,
                    }}
                  >
                    {cohub.address?.length > 60
                      ? `${cohub.address.slice(0, 60)}...`
                      : cohub.address}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
