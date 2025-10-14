// src/pages/Schedule/CompletedSessions.jsx
import React from "react";
import { Box, Typography, Card, CardContent, List } from "@mui/material";
import SessionItem from "./SessionItem";

export default function CompletedSessions({ sessions }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Completed Sessions ({sessions.length})
      </Typography>
      {sessions.length === 0 ? (
        <Typography>No completed sessions</Typography>
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
