import { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  Chip,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Typography,
  Badge,
  Tabs,
  Tab,
  Avatar,
  CircularProgress,
} from "@mui/material";
import {
  Notifications as NotificationsIcon,
  CircleNotifications as SessionIcon,
  MarkEmailRead as MarkReadIcon,
  Delete as DeleteIcon,
  AttachMoney as PaymentIcon,
  School as CourseIcon,
  Settings as SettingsIcon,
} from "@mui/icons-material";
import { useTutorAuth } from "../../context/tutorAuthContext";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function Notifications() {
  const { tutor } = useTutorAuth();
  const [notifications, setNotifications] = useState([]);
  const [tab, setTab] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch notifications
  useEffect(() => {
    if (!tutor?.id) return;
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/tutors/notifications/${tutor.id}`);
        setNotifications(res.data);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [tutor?.id]);

  // Derived states
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const important = notifications.filter((n) => n.important === 1);
  const unread = notifications.filter((n) => !n.is_read);

  const getFiltered = () => {
    if (tab === 1) return unread;
    if (tab === 2) return important;
    return notifications;
  };

  // Handlers
  const markAsRead = async (id) => {
    try {
      await axios.put(`${BASE_URL}/api/tutors/notification-read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
      );
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${BASE_URL}/api/tutors/notifications-read-all/${tutor.id}`);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    } catch (err) {
      console.error("Error marking all as read:", err);
    }
  };

  const deleteNotification = (id) =>
    setNotifications((prev) => prev.filter((n) => n.id !== id));

  const formatDate = (d) =>
    new Date(d).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });

  const filtered = getFiltered();

  return (
    <Box sx={{ py: 3, mx: "auto" }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: { xs: "column", sm: "row" },
          alignItems: "center",
          mb: 3,
          gap: 2,
          textAlign: { xs: "center", sm: "left" },
        }}
      >
        <Typography variant="h5" sx={{ display: "flex", alignItems: "center" }}>
          Notifications{" "}
          {unreadCount > 0 && (
            <Chip label={unreadCount} color="primary" size="small" sx={{ ml: 1 }} />
          )}
        </Typography>

        <Button
          startIcon={<MarkReadIcon />}
          onClick={markAllAsRead}
          disabled={unreadCount === 0}
          fullWidth={!!(window.innerWidth < 600)}
        >
          Mark All Read
        </Button>
      </Box>

      {/* Tabs */}
      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="All" />
        <Tab label={`Unread (${unreadCount})`} />
        <Tab label={`Important (${important.length})`} />
      </Tabs>

      {/* Loading */}
      {loading ? (
        <Box sx={{ textAlign: "center", mt: 6 }}>
          <CircularProgress />
          <Typography variant="body2" mt={2}>
            Loading...
          </Typography>
        </Box>
      ) : (
        <Card>
          <List>
            {filtered.length ? (
              filtered.map((n) => (
                <ListItem
                  key={n.id}
                  disablePadding
                  secondaryAction={
                    <IconButton edge="end" onClick={() => deleteNotification(n.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemButton
                    onClick={() => markAsRead(n.id)}
                    sx={{
                      bgcolor: n.is_read ? "inherit" : "action.hover",
                      px: 3,
                      py: 2,
                      borderLeft: n.important ? "4px solid red" : "none",
                    }}
                  >
                    <ListItemAvatar>
                      <Badge
                        color="primary"
                        variant="dot"
                        invisible={n.is_read}
                        anchorOrigin={{ vertical: "top", horizontal: "left" }}
                      >
                        <Avatar sx={{ bgcolor: "primary.light" }}>
                          {n.type === "session" && <SessionIcon />}
                          {n.type === "payment" && <PaymentIcon />}
                          {n.type === "course" && <CourseIcon />}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: n.is_read ? "normal" : "bold" }}
                          >
                            {n.title}
                          </Typography>
                          {n.important === 1 && (
                            <Chip label="Important" size="small" color="error" sx={{ ml: 1 }} />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2">{n.message}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(n.created_at)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <Box sx={{ p: 4, textAlign: "center" }}>
                <NotificationsIcon sx={{ fontSize: 60, color: "grey.400" }} />
                <Typography variant="h6" color="text.secondary">
                  No notifications
                </Typography>
              </Box>
            )}
          </List>
        </Card>
      )}

      {/* Settings Button */}
      <Box sx={{ mt: 3, textAlign: "right" }}>
        <Button startIcon={<SettingsIcon />} onClick={() => console.log("Settings clicked")}>
          Notification Settings
        </Button>
      </Box>
    </Box>
  );
}
