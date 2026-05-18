import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
} from "@mui/material";
import {
  acceptInterest,
  rejectInterest,
  sendToManager,
} from "../../services/interest.service.js";

const getStatusLabel = (status) => {
  if (status === "pending") return "ממתין";
  if (status === "accepted") return "אושר";
  if (status === "rejected") return "נדחה";
  return "לא ידוע";
};

const InterestCard = ({ interest, type, onChanged }) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const otherUser = type === "incoming" ? interest.sender : interest.receiver;
  const interestId = interest._id || interest.id;
  const otherUserId = otherUser?._id || otherUser?.id;

  const handleAction = async (action, value) => {
    try {
      setLoading(true);
      setMessage("");

      await action(value);

      setMessage("הפעולה בוצעה בהצלחה");

      if (onChanged) {
        onChanged();
      }
    } catch (err) {
      console.error("Interest action failed:", err);
      setMessage("לא הצלחנו לבצע את הפעולה");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={1.5}>
          <Typography variant="h6">
            {otherUser?.name || "משתמש"}
          </Typography>

          <Chip
            label={getStatusLabel(interest.status)}
            size="small"
            sx={{ width: "fit-content" }}
          />

          {type === "incoming" && interest.status === "pending" && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                disabled={loading}
                onClick={() => handleAction(acceptInterest, interestId)}
              >
                אישור
              </Button>

              <Button
                variant="outlined"
                color="error"
                disabled={loading}
                onClick={() => handleAction(rejectInterest, interestId)}
              >
                דחייה
              </Button>
            </Stack>
          )}

          {interest.status === "accepted" && (
            <Button
              variant="contained"
              disabled={loading || !otherUserId}
              onClick={() => handleAction(sendToManager, otherUserId)}
            >
              העבר לטיפול מנהל
            </Button>
          )}

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

export default InterestCard;