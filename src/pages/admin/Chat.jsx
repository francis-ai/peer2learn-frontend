// src/pages/admin/Chat.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const Chat = () => {
  const { studentId, tutorId } = useParams();
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  const chatInfo = location.state?.chat;

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/admin/chat/${tutorId}/${studentId}`
        );
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("❌ Error fetching messages:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [studentId, tutorId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Box sx={{ mt: 10, p: 2, display: "flex", justifyContent: "center" }}>
      <Paper sx={{ width: "100%", maxWidth: 700, p: 2 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Chat between {chatInfo?.student_name || "Student"} &{" "}
          {chatInfo?.tutor_name || "Tutor"}
        </Typography>
        <Divider sx={{ mb: 2 }} />

        {loading ? (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        ) : messages.length === 0 ? (
          <Typography>No messages yet.</Typography>
        ) : (
          <Box
            sx={{
              maxHeight: "70vh",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: 1,
            }}
          >
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  alignSelf:
                    msg.sender_type === "tutor" ? "flex-end" : "flex-start",
                  backgroundColor:
                    msg.sender_type === "tutor" ? "#e3f2fd" : "#f1f8e9",
                  px: 2,
                  py: 1,
                  borderRadius: 2,
                  maxWidth: "80%",
                }}
              >
                <Typography variant="body2">{msg.message}</Typography>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ display: "block", textAlign: "right" }}
                >
                  {new Date(msg.created_at).toLocaleString()}
                </Typography>
              </Box>
            ))}
            <div ref={messagesEndRef} />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default Chat;
