import { useState, useEffect, useRef } from "react";
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Paper,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useAuth } from "../../context/studentAuthContext";
import { useLocation } from "react-router-dom";
import axios from "axios";

const BASE_URL = process.env.REACT_APP_BASE_URL;

export default function ChatPage() {
  const { student } = useAuth();
  const location = useLocation();
  const { tutorId, tutorName } = location.state || {};

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);

  // 🟢 Auto-scroll inside chat container only
  useEffect(() => {
    if (chatContainerRef.current && messagesEndRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // 🟢 Fetch chat messages
  useEffect(() => {
    if (!student || !tutorId) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/students/messages/${student.id}/${tutorId}`
        );
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Error fetching chat:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchMessages();
  }, [student, tutorId]);

  // ✉️ Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    setLoading(true);
    try {
      const res = await axios.post(`${BASE_URL}/api/students/message-tutor`, {
        studentId: student.id,
        tutorId,
        message: newMessage,
      });

      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender_id: student.id,
            sender_type: "student",
            message: newMessage,
            created_at: new Date().toISOString(),
          },
        ]);
        setNewMessage("");
      }
    } catch (err) {
      console.error("Error sending message:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        px: 1,
        mt: 5
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 800,
          height: "85vh",
          display: "flex",
          flexDirection: "column",
          borderRadius: 3,
          overflow: "hidden",
          bgcolor: "#fff",
        }}
      >
        {/* 🔹 Header */}
        <Box sx={{ p: 2, bgcolor: "primary.main", color: "white" }}>
          <Typography variant="h6">
            Chat with {tutorName || "Tutor"}
          </Typography>
        </Box>

        {/* 🔹 Chat Messages Area */}
        <Box
          ref={chatContainerRef}
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            bgcolor: "#f9f9f9",
          }}
        >
          {fetching ? (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : messages.length > 0 ? (
            messages.map((msg, i) => (
              <Box
                key={i}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.sender_type === "student" ? "flex-end" : "flex-start",
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    p: 1.5,
                    borderRadius: 2,
                    bgcolor:
                      msg.sender_type === "student" ? "#1976d2" : "#e0e0e0",
                    color: msg.sender_type === "student" ? "#fff" : "#000",
                    maxWidth: "70%",
                  }}
                >
                  <Typography variant="body2">{msg.message}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      opacity: 0.7,
                      display: "block",
                      mt: 0.5,
                      textAlign:
                        msg.sender_type === "student" ? "right" : "left",
                    }}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography
              variant="body2"
              sx={{ textAlign: "center", color: "gray", mt: 3 }}
            >
              No messages yet.
            </Typography>
          )}
          <div ref={messagesEndRef} />
        </Box>

        {/* 🔹 Input Box */}
        <Box
          component="form"
          onSubmit={sendMessage}
          sx={{
            display: "flex",
            alignItems: "center",
            p: 2,
            borderTop: "1px solid #ddd",
            bgcolor: "white",
          }}
        >
          <TextField
            fullWidth
            variant="outlined"
            placeholder="Type your message..."
            size="small"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            sx={{
              mr: 1,
              "& .MuiOutlinedInput-root": {
                borderRadius: "25px",
                bgcolor: "#f1f3f4",
              },
            }}
          />
          <IconButton
            color="primary"
            type="submit"
            disabled={loading}
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
              width: 45,
              height: 45,
            }}
          >
            {loading ? (
              <CircularProgress size={20} color="inherit" />
            ) : (
              <SendIcon />
            )}
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
}
