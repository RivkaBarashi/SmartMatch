import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
} from "@mui/material";
import { sendInterest } from "../../services/interest.service.js";

const MatchCard = ({ match, onInterestSent }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const rawReceiver = match?._id || match?.id || match?.user?._id || match?.user;

  const normalizeId = (item) => {
    if (!item && item !== 0) return item;
    if (typeof item === "object") return item._id || item.id || item.user?._id || item.user || undefined;
    return item;
  };

  const receiverId = normalizeId(rawReceiver);

  const handleSendInterest = async () => {
    try {
      setLoading(true);
      setMessage("");

      await sendInterest(receiverId);

      setMessage("ההתעניינות נשלחה בהצלחה");

      if (onInterestSent) {
        onInterestSent(receiverId);
      }
    } catch (err) {
      console.error("Failed to send interest:", err);
      setMessage(err.message || "לא הצלחנו לשלוח התעניינות");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      sx={{
        mb: 2,
        borderRadius: 20,
        boxShadow: "0 16px 38px rgba(15, 23, 42, 0.08)",
        border: "1px solid rgba(63, 113, 213, 0.12)",
      }}
    >
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="h6">
            {match?.name || "משתמש"}
          </Typography>

          <Typography>עיר: {match?.city || "לא צוין"}</Typography>
          <Typography>גיל: {match?.age || "לא צוין"}</Typography>
          <Typography>גובה: {match?.height || "לא צוין"}</Typography>
          <Typography>סגנון: {match?.style || "לא צוין"}</Typography>
          <Typography>תיאור: {match?.description || "לא צוין"}</Typography>

          <Button
            variant="contained"
            onClick={handleSendInterest}
            disabled={loading || !receiverId}
          >
            {loading ? "שולח..." : "שליחת התעניינות"}
          </Button>

          {message && (
            <Alert severity={message.includes("בהצלחה") ? "success" : "error"}>
              {message}
            </Alert>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MatchCard;