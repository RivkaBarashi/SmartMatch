import { useState } from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  Stack,
  Typography,
  Snackbar,
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
  const [snackOpen, setSnackOpen] = useState(false);
  const [alreadySentOpen, setAlreadySentOpen] = useState(false);

  const otherUser = type === "incoming" ? interest?.sender : interest?.receiver;
  const otherUserId = otherUser?._id || otherUser?.id;

  const handleAction = async (action, value) => {
    try {
      setLoading(true);
      setMessage("");

      // Prevent duplicate send-to-manager requests when already approved
      if (action === sendToManager) {
        const alreadySent = !!(
          interest?.senderApprovedToManager || interest?.receiverApprovedToManager
        );

        if (alreadySent) {
          setAlreadySentOpen(true);
          return;
        }
      }

      console.log("InterestCard: calling action", action?.name || "action", value);
      const result = await action(value);
      console.log("InterestCard: action result", result);

      setMessage("הפעולה בוצעה בהצלחה");

      // Show a small success snackbar specifically when sending to manager
      if (action === sendToManager) {
        setSnackOpen(true);
      }

      if (onChanged) {
        await onChanged();
      }
    } catch (err) {
      console.error("Interest action failed:", err);
      setMessage(err.message || "לא הצלחנו לבצע את הפעולה");
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
        <Stack spacing={1.5}>
          <Typography variant="h6">
            {otherUser?.name || "משתמש"}
          </Typography>

          <Typography>
            מזהה: {otherUser?.idNumber || "לא צוין"}
          </Typography>

          <Chip
            label={getStatusLabel(interest?.status)}
            size="small"
            sx={{ width: "fit-content" }}
          />

          {type === "incoming" && interest?.status === "pending" && (
            <Stack direction="row" spacing={1}>
              <Button
                variant="contained"
                disabled={loading || !otherUserId}
                onClick={() => handleAction(acceptInterest, otherUserId)}
              >
                אישור
              </Button>

              <Button
                variant="outlined"
                color="error"
                disabled={loading || !otherUserId}
                onClick={() => handleAction(rejectInterest, otherUserId)}
              >
                דחייה
              </Button>
            </Stack>
          )}

          {interest?.status === "accepted" && (
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
          <Snackbar
            open={snackOpen}
            autoHideDuration={3000}
            onClose={() => setSnackOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={() => setSnackOpen(false)} severity="success" sx={{ width: "100%" }}>
              הועבר לטיפול המנהל
            </Alert>
          </Snackbar>
          <Snackbar
            open={alreadySentOpen}
            autoHideDuration={3000}
            onClose={() => setAlreadySentOpen(false)}
            anchorOrigin={{ vertical: "top", horizontal: "center" }}
          >
            <Alert onClose={() => setAlreadySentOpen(false)} severity="warning" sx={{ width: "100%" }}>
              הפניה כבר נשלחה למנהל
            </Alert>
          </Snackbar>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default InterestCard;