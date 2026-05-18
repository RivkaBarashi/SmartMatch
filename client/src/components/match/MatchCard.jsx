import { Card, CardContent, Typography, Button, Stack } from "@mui/material";

const MatchCard = ({ match }) => {
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

          <Button variant="contained">
            שליחת התעניינות
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default MatchCard;