import { useState } from "react";
import { Card, CardContent, Typography, Button, Stack, Alert } from "@mui/material";
import { sendInterest } from "../../services/interest.service.js";

const MatchCard = ({ match }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const receiverId = match.user?._id || match.user || match._id || match.id;

  const handleSendInterest = async () => {
    try {
      setLoading(true);
      setMessage("");

      await sendInterest(receiverId);

      setMessage("ההתעניינות נשלחה בהצלחה");
    } catch (err) {
      console.error("Failed to send interest:", err);
      setMessage("לא הצלחנו לשלוח התעניינות");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6">
            {match.name || match.profile?.name || "משתמש"}
          </Typography>

          <Typography>
            עיר: {match.city || match.profile?.city || "לא צוין"}
          </Typography>

          <Typography>
            גיל: {match.age || match.profile?.age || "לא צוין"}
          </Typography>

          <Button
            variant="contained"
            onClick={handleSendInterest}
            disabled={loading || !receiverId}
          >
            {loading ? "שולח..." : "שליחת התעניינות"}
          </Button>

          {message && <Alert severity={message.includes("בהצלחה") ? "success" : "error"}>{message}</Alert>}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MatchCard;