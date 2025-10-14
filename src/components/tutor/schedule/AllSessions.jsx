// src/pages/Schedule/AllSessions.jsx
import React from "react";
import { Box, Typography, Card, CardContent, List } from "@mui/material";
import SessionItem from "./SessionItem";

export default function AllSessions({ sessions }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        All Sessions ({sessions.length})
      </Typography>
      {sessions.length === 0 ? (
        <Typography>No sessions scheduled</Typography>
      ) : (
        <List>
          {sessions.map((session) => (
            <Card key={session.id} sx={{ mb: 2 }}>
              <CardContent>
                <SessionItem session={session} showActions={false} />
              </CardContent>
            </Card>
          ))}
        </List>
      )}
    </Box>
  );
}
