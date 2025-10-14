// src/pages/Schedule/UpcomingSessions.jsx
import React from "react";
import {
  Card,
  CardContent,
  Typography,
  List,
  Divider
} from "@mui/material";
import SessionItem from "./SessionItem";

export default function UpcomingSessions({ sessions, onMarkCompleted, onEdit }) {
  return (
    <Card>
      <CardContent sx={{ p: 0 }}>
        {sessions.length === 0 ? (
          <Typography sx={{ p: 2 }}>No upcoming sessions scheduled</Typography>
        ) : (
          <List>
            {sessions.map((session) => (
              <div key={session.id}>
                <SessionItem
                  session={session}
                  onMarkCompleted={onMarkCompleted}
                  onEdit={onEdit}
                />
                <Divider variant="inset" component="li" />
              </div>
            ))}
          </List>
        )}
      </CardContent>
    </Card>
  );
}
