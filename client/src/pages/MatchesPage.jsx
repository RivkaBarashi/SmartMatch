import { useEffect, useState } from "react";
import { Box, CircularProgress, Typography } from "@mui/material";
import { getMatches } from "../services/match.service.js";
import MatchCard from "../components/match/MatchCard.jsx";

const MatchesPage = () => {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadMatches = async () => {
      try {
        const data = await getMatches();

        console.log("matches response:", data);

        const matchesArray = Array.isArray(data)
          ? data
          : data?.matches || data?.data || [];

        setMatches(matchesArray);
      } catch (err) {
        console.error("Failed to load matches:", err);
        setError("לא הצלחנו לטעון התאמות");
      } finally {
        setLoading(false);
      }
    };

    loadMatches();
  }, []);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        התאמות
      </Typography>

      {matches.length === 0 ? (
        <Typography>לא נמצאו התאמות כרגע</Typography>
      ) : (
        matches.map((match) => (
          <MatchCard
            key={match._id || match.id}
            match={match}
          />
        ))
      )}
    </Box>
  );
};

export default MatchesPage;