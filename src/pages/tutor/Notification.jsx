import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Box, Button, Card, Chip, Divider, IconButton,
  List, ListItem, ListItemAvatar, ListItemButton, ListItemText,
  Menu, MenuItem, Typography, Badge, Tabs, Tab, Avatar, CircularProgress
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  CircleNotifications as UnreadIcon,
  NotificationsOff as MutedIcon,
  CheckCircle as ReadIcon,
  Delete as DeleteIcon,
  FilterList as FilterIcon,
  MarkEmailRead as MarkReadIcon,
  Settings as SettingsIcon,
  AttachMoney
} from '@mui/icons-material';
import { useTutorAuth } from '../../context/tutorAuthContext';

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Notifications = () => {
  const { tutor } = useTutorAuth();
  const [notifications, setNotifications] = useState([]);
  const [filter, setFilter] = useState('all');
  const [anchorEl, setAnchorEl] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (!tutor?.id) return;
      setLoading(true);
      try {
        const res = await axios.get(`${BASE_URL}/api/tutors/notifications/${tutor.id}`);
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [tutor?.id]);

  const handleFilterClick = (event) => setAnchorEl(event.currentTarget);
  const handleFilterClose = () => setAnchorEl(null);

  const handleFilterSelect = (type) => {
    setFilter(type);
    handleFilterClose();
  };

  const handleTabChange = (event, newValue) => setActiveTab(newValue);

  const markAsRead = async (id) => {
    try {
      await axios.put(`${BASE_URL}/api/tutors/notification-read/${id}`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
      );
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axios.put(`${BASE_URL}/api/tutors/notifications-read-all/${tutor.id}`);
      setNotifications((prev) => prev.map((n) => ({ ...n, is_read: 1 })));
    } catch (err) {
      console.error('Error marking all notifications as read:', err);
    }
  };

  const deleteNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const filteredNotifications = notifications.filter((n) => {
    if (filter === 'all') return true;
    if (filter === 'unread') return n.is_read === 0;
    if (filter === 'important') return n.important === 1;
    return n.type === filter;
  });

  const unreadCount = notifications.filter((n) => n.is_read === 0).length;

  const formatTime = (time) => new Date(time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDate = (date) => new Date(date).toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <Box sx={{ p: 3, mx: 'auto'}}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Notifications{' '}
          {unreadCount > 0 && (
            <Chip label={unreadCount} color="primary" size="small" sx={{ ml: 2 }} />
          )}
        </Typography>

        <Box>
          <Button startIcon={<FilterIcon />} onClick={handleFilterClick} sx={{ mr: 2 }}>
            Filter
          </Button>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleFilterClose}>
            <MenuItem onClick={() => handleFilterSelect('all')}>All</MenuItem>
            <MenuItem onClick={() => handleFilterSelect('unread')}>Unread</MenuItem>
            <MenuItem onClick={() => handleFilterSelect('important')}>Important</MenuItem>
            <Divider />
            <MenuItem onClick={() => handleFilterSelect('session')}>Session</MenuItem>
            <MenuItem onClick={() => handleFilterSelect('payment')}>Payment</MenuItem>
            <MenuItem onClick={() => handleFilterSelect('course')}>Course</MenuItem>
          </Menu>

          <Button startIcon={<MarkReadIcon />} onClick={markAllAsRead} disabled={unreadCount === 0}>
            Mark All Read
          </Button>
        </Box>
      </Box>

      <Tabs value={activeTab} onChange={handleTabChange} sx={{ mb: 2 }}>
        <Tab label="All" />
        <Tab label="Unread" />
        <Tab label="Important" />
      </Tabs>

      {loading ? (
        <Box sx={{ textAlign: 'center', mt: 6 }}>
          <CircularProgress />
          <Typography variant="body2" mt={2}>Loading...</Typography>
        </Box>
      ) : (
        <Card>
          <List>
            {filteredNotifications.length > 0 ? (
              filteredNotifications.map((notification) => (
                <ListItem
                  key={notification.id}
                  secondaryAction={
                    <IconButton edge="end" onClick={() => deleteNotification(notification.id)}>
                      <DeleteIcon />
                    </IconButton>
                  }
                  disablePadding
                >
                  <ListItemButton
                    sx={{
                      px: 3,
                      py: 2,
                      bgcolor: notification.is_read ? 'inherit' : 'action.hover',
                      borderLeft: notification.important ? '4px solid red' : 'none'
                    }}
                    onClick={() => markAsRead(notification.id)}
                  >
                    <ListItemAvatar>
                      <Badge
                        color="primary"
                        variant="dot"
                        invisible={notification.is_read}
                        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                      >
                        <Avatar
                          sx={{
                            bgcolor: notification.muted ? 'grey.300' : 'primary.light',
                            color: notification.muted ? 'grey.600' : 'primary.contrastText'
                          }}
                        >
                          {notification.type === 'session' && <UnreadIcon />}
                          {notification.type === 'payment' && <AttachMoney />}
                          {notification.type === 'course' && <ReadIcon />}
                          {notification.muted && <MutedIcon />}
                        </Avatar>
                      </Badge>
                    </ListItemAvatar>

                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: notification.is_read ? 'normal' : 'bold' }}>
                            {notification.title}
                          </Typography>
                          {notification.important === 1 && (
                            <Chip label="Important" size="small" color="error" sx={{ ml: 1 }} />
                          )}
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="body2">{notification.message}</Typography>
                          <Typography variant="caption" color="text.secondary">
                            {formatDate(notification.created_at)} • {formatTime(notification.created_at)}
                          </Typography>
                        </>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <Box sx={{ p: 4, textAlign: 'center' }}>
                <NotificationsIcon sx={{ fontSize: 60, color: 'grey.400' }} />
                <Typography variant="h6" color="text.secondary">
                  No notifications
                </Typography>
              </Box>
            )}
          </List>
        </Card>
      )}

      <Box sx={{ mt: 3, textAlign: 'right' }}>
        <Button startIcon={<SettingsIcon />} onClick={() => console.log('Settings')}>
          Notification Settings
        </Button>
      </Box>
    </Box>
  );
};

export default Notifications;
