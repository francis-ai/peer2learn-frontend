// src/pages/admin/Messages.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  List,
  ListItemButton,
  ListItemText,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Messages = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await axios.get(`${BASE_URL}/api/admin/chats`);
        setChats(res.data.chats || []);
      } catch (error) {
        console.error("❌ Error fetching chats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, []);

  const openChat = (chat) => {
    navigate(`/admin/messages/${chat.tutor_id}/${chat.student_id}`, {
      state: { chat },
    });
  };

  return (
    <Box sx={{ mt: 10, p: 2, display: "flex", justifyContent: "center" }}>
      <Paper sx={{ width: "100%", maxWidth: 700, p: 2 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          All Chats
        </Typography>

        {loading ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : chats.length === 0 ? (
          <Typography>No chats found.</Typography>
        ) : (
          <List>
            {chats.map((chat, i) => (
              <ListItemButton key={i} onClick={() => openChat(chat)}>
                <ListItemText
                  primary={`${chat.student_name} ↔ ${chat.tutor_name}`}
                  secondary={`Last message: ${new Date(
                    chat.last_message_time
                  ).toLocaleString()}`}
                />
              </ListItemButton>
            ))}
          </List>
        )}
      </Paper>
    </Box>
  );
};

export default Messages;
