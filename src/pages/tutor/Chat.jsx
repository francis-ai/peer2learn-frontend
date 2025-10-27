import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useParams, useLocation } from "react-router-dom";
import { useTutorAuth } from "../../context/tutorAuthContext";
import {
  Box,
  Typography,
  Paper,
  TextField,
  IconButton,
  Divider,
  CircularProgress,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

const BASE_URL = process.env.REACT_APP_BASE_URL;

const TutorChat = () => {
  const { tutor } = useTutorAuth();
  const tutorId = tutor?.id;
  const { studentId } = useParams();
  const location = useLocation();
  const { studentName } = location.state || {}; // 🟢 get name from navigation state

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [fetching, setFetching] = useState(true);
  const chatContainerRef = useRef(null);
  const chatEndRef = useRef(null);

  // 🟢 Fetch chat messages
  useEffect(() => {
    if (!tutorId || !studentId) return;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(
          `${BASE_URL}/api/tutors/messages/${tutorId}/${studentId}`
        );
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error("Error fetching chat:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchMessages();
  }, [tutorId, studentId]);

  // 🟢 Auto-scroll only inside the chat container
  useEffect(() => {
    if (chatContainerRef.current && chatEndRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

  // ✉️ Send message
  const sendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await axios.post(`${BASE_URL}/api/tutors/send-message`, {
        tutorId,
        studentId,
        message: newMessage,
      });

      setMessages((prev) => [
        ...prev,
        {
          sender_type: "tutor",
          message: newMessage,
          created_at: new Date().toISOString(),
        },
      ]);
      setNewMessage("");
    } catch (err) {
      console.error("Error sending message:", err);
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
      }}
    >
      <Paper
        elevation={5}
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            p: 2,
            bgcolor: "primary.main",
            color: "white",
          }}
        >
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 500 }}>
              Chat with {studentName || `Student #${studentId}`}
            </Typography>
            {/* <Typography variant="body2" sx={{ opacity: 0.85 }}>
              {messages.length} message{messages.length !== 1 && "s"}
            </Typography> */}
          </Box>
        </Box>

        <Divider />

        {/* 🔹 Chat messages */}
        <Box
          ref={chatContainerRef}
          sx={{
            flex: 1,
            overflowY: "auto",
            p: 2,
            display: "flex",
            flexDirection: "column",
            bgcolor: "#fff",
          }}
        >
          {fetching ? (
            <Box sx={{ textAlign: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : messages.length > 0 ? (
            messages.map((msg, idx) => (
              <Box
                key={idx}
                sx={{
                  display: "flex",
                  justifyContent:
                    msg.sender_type === "tutor" ? "flex-end" : "flex-start",
                  mb: 1.5,
                }}
              >
                <Paper
                  elevation={1}
                  sx={{
                    px: 2,
                    py: 1,
                    maxWidth: "70%",
                    bgcolor:
                      msg.sender_type === "tutor" ? "primary.main" : "#fff",
                    color:
                      msg.sender_type === "tutor" ? "white" : "text.primary",
                    borderRadius:
                      msg.sender_type === "tutor"
                        ? "16px 16px 0px 16px"
                        : "16px 16px 16px 0px",
                    wordBreak: "break-word",
                  }}
                >
                  <Typography variant="body2">{msg.message}</Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      textAlign:
                        msg.sender_type === "tutor" ? "right" : "left",
                      mt: 0.5,
                      opacity: 0.7,
                    }}
                  >
                    {new Date(msg.created_at).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </Typography>
                </Paper>
              </Box>
            ))
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              align="center"
              sx={{ mt: 4 }}
            >
              No messages yet.
            </Typography>
          )}
          <div ref={chatEndRef} />
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
            sx={{
              bgcolor: "primary.main",
              color: "white",
              "&:hover": { bgcolor: "primary.dark" },
            }}
          >
            <SendIcon />
          </IconButton>
        </Box>
      </Paper>
    </Box>
  );
};

export default TutorChat;
