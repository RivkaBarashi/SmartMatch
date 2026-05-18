import { useEffect, useState } from "react";
import { Alert, Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { getPendingMatches, removePendingMatch } from "../services/admin.service.js";

const AdminPendingMatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await getPendingMatches();
      setMatches(data?.matches || []);
    } catch (err) {
      console.error("Failed to load pending matches:", err);
      setMessage("לא הצלחנו לטעון הצעות");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMatches();
  }, []);

  const handleRemove = async (match) => {
    try {
      await removePendingMatch({
        senderId: match.sender?._id,
        receiverId: match.receiver?._id,
      });

      setMessage("ההצעה הוסרה מהרשימה");
      loadMatches();
    } catch (err) {
      console.error("Failed to remove pending match:", err);
      setMessage("לא הצלחנו להסיר את ההצעה");
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        הצעות שממתינות לטיפול
      </Typography>

      {message && (
        <Alert severity={message.includes("הוסרה") ? "success" : "error"} sx={{ mb: 2 }}>
          {message}
        </Alert>
      )}

      {matches.length === 0 ? (
        <Typography>אין הצעות שממתינות לטיפול</Typography>
      ) : (
        matches.map((match) => (
          <Paper key={match._id} sx={{ p: 2, mb: 2 }}>
            <Stack spacing={1}>
              <Typography variant="h6">הצעה לטיפול</Typography>

              <Typography>
                שולח: {match.sender?.name || "לא צוין"}
              </Typography>

              <Typography>
                מקבל: {match.receiver?.name || "לא צוין"}
              </Typography>

              <Button
                variant="outlined"
                color="error"
                onClick={() => handleRemove(match)}
              >
                הסרה מהרשימה
              </Button>
            </Stack>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default AdminPendingMatchesPage;