// src/pages/Schedule/SessionItem.jsx
import React from "react";
import {
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Typography,
  Box,
  Chip,
  Button
} from "@mui/material";
import {
  Person as PersonIcon,
  CalendarToday as CalendarIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon
} from "@mui/icons-material";

export default function SessionItem({ session, showActions = true, onMarkCompleted, onEdit }) {
  return (
    <ListItem
      secondaryAction={
        showActions && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              disabled={session.is_completed === 1}
              onClick={() => onMarkCompleted(session.id)}
              startIcon={<CheckCircleIcon fontSize="small" />}
            >
              Mark Completed
            </Button>
            <Button
              size="small"
              onClick={() => onEdit(session)}
            >
              Edit
            </Button>
          </Box>
        )
      }
    >
      <ListItemAvatar>
        <Avatar>{session.student_name.charAt(0)}</Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={<Typography fontWeight="bold">{session.course_name}</Typography>}
        secondary={
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 0.5 }}>
            <Chip icon={<PersonIcon />} label={session.student_name} size="small" />
            <Chip
              icon={<CalendarIcon />}
              label={new Date(session.date).toLocaleDateString()}
              size="small"
            />
            <Chip
              icon={<AccessTimeIcon />}
              label={session.time}
              size="small"
              color={session.is_completed === 0 ? "primary" : "default"}
            />
            {session.is_completed === 1 && (
              <Chip
                icon={<CheckCircleIcon />}
                label="Completed"
                color="success"
                size="small"
              />
            )}
          </Box>
        }
      />
    </ListItem>
  );
}
