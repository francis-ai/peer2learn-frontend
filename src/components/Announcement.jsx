import React, { useEffect, useState, useCallback, useRef } from "react";
import axios from "axios";
import {
  Paper,
  Box,
  Typography,
  IconButton,
  Chip,
  Stack,
  Fade,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CampaignIcon from "@mui/icons-material/Campaign";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const AnnouncementBanner = () => {
  const [announcement, setAnnouncement] = useState(null);
  const [hidden, setHidden] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const contentRef = useRef(null);
  const containerRef = useRef(null);

  const fetchAnnouncement = useCallback(async () => {
    try {
      const { data } = await axios.get(`${BASE_URL}/api/view/announcement`);
      if (data?.id) {
        setAnnouncement(data);
      }
    } catch (err) {
      console.error("Failed to load announcement:", err);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncement();
  }, [fetchAnnouncement]);

  useEffect(() => {
    if (!announcement || !contentRef.current || !containerRef.current) return;

    const contentWidth = contentRef.current.scrollWidth;
    const containerWidth = containerRef.current.offsetWidth;

    if (contentWidth <= containerWidth) return;

    const ticker = setInterval(() => {
      setScrollPosition((prev) => {
        const newPosition = prev + 0.5;
        if (newPosition >= contentWidth) {
          return -containerWidth;
        }
        return newPosition;
      });
    }, 25);

    return () => clearInterval(ticker);
  }, [announcement]);

  const handleClose = () => setHidden(true);

  if (!announcement) return null;

  return (
    <Fade in={!hidden} timeout={300}>
      <Paper
        elevation={0}
        sx={{
          width: "100%",
          px: { xs: 1, sm: 4 },
          py: { xs: 1, sm: 1.5 },
          bgcolor: "primary.main",
          color: "white",
          borderBottom: "1px solid",
          borderColor: "primary.dark",
          overflow: "hidden",
          position: "sticky",
          top: "75px",
          zIndex: 999,
          left: 0,
          right: 0,
          boxSizing: "border-box",
        }}
        ref={containerRef}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            maxWidth: "100%",
            margin: "0 auto",
            position: "relative",
            width: "100%",
            overflow: "hidden",
          }}
        >
          {/* Icon + Label */}
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{
              mr: 2,
              minWidth: "140px",
              flexShrink: 0,
            }}
          >
            <CampaignIcon fontSize="small" sx={{ color: "primary.light" }} />
            <Chip
              label="Announcement"
              size="small"
              sx={{
                fontWeight: "bold",
                bgcolor: "rgba(255,255,255,0.15)",
                color: "white",
                fontSize: "0.7rem",
                height: "22px",
              }}
            />
          </Stack>

          {/* Scrolling Text */}
          <Box
            sx={{
              flex: 1,
              overflow: "hidden",
              whiteSpace: "nowrap",
              width: "100%",
            }}
          >
            <Box
              ref={contentRef}
              sx={{
                display: "inline-block",
                transform: `translateX(-${scrollPosition}px)`,
                transition: "transform 0.1s linear",
                pr: 2,
              }}
            >
              <Typography
                variant="subtitle2"
                component="span"
                sx={{
                  fontWeight: 600,
                  lineHeight: 1.4,
                  fontSize: { xs: "0.85rem", sm: "0.95rem" },
                  mr: 1,
                }}
              >
                {announcement.title || "Latest Update"}
              </Typography>
              {announcement.content && (
                <Typography
                  variant="caption"
                  component="span"
                  sx={{
                    opacity: 0.9,
                    lineHeight: 1.3,
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                >
                  {announcement.content}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Close Button */}
          <IconButton
            aria-label="dismiss announcement"
            onClick={handleClose}
            size="small"
            sx={{
              color: "rgba(255,255,255,0.8)",
              "&:hover": {
                bgcolor: "primary.dark",
                color: "white",
              },
              ml: 1,
              flexShrink: 0,
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </Box>
      </Paper>
    </Fade>
  );
};

export default AnnouncementBanner;
