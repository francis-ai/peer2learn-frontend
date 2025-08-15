import React, { useEffect, useState } from "react";
import axios from "axios";
import { Typography, Box } from "@mui/material";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function VideoPlayer() {
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    fetchVideo();
  }, []);

  const fetchVideo = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/api/view/video`);
      console.log("Video API Response:", res.data);

      let url = res.data?.url || "";
      if (url.includes("youtu.be")) {
        const videoId = url.split("youtu.be/")[1]?.split("?")[0];
        url = `https://www.youtube.com/embed/${videoId}`;
      } else if (url.includes("watch?v=")) {
        const videoId = new URL(url).searchParams.get("v");
        url = `https://www.youtube.com/embed/${videoId}`;
      }

      setVideoUrl(url);
    } catch (err) {
      console.error("Error fetching video:", err);
    }
  };

  return (
    <Box sx={{ mt: 4, textAlign: "center", p: 1 }}>
      {/* <Container maxWidth="lg"> */}
        <Typography 
          variant="h2" 
          sx={{
            fontSize: '2.5rem',
            fontWeight: 700,
            textAlign: 'center',
            mb: 2,
            color: '#1a237e'
          }}
          data-aos="fade-down"
        >
         What you need to know
        </Typography>
        <Typography 
          variant="subtitle1" 
          sx={{
            fontSize: '1.1rem',
            textAlign: 'center',
            mb: 6,
            color: '#64748b'
          }}
          data-aos="fade-down"
          data-aos-delay="100"
        >
          Everything you need to learn effectively
        </Typography>

      {/* Center align iframe */}
      {videoUrl && (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              border: "2px solid #ccc",
              borderRadius: "8px",
              overflow: "hidden",
              width: "800px",
              height: "400px",
            }}
          >
            <iframe
              src={videoUrl}
              title="Video Player"
              width="100%"
              height="100%"
              style={{ border: "none" }}
              allowFullScreen
            ></iframe>
          </Box>
        </Box>
      )}
    </Box>
  );
}
