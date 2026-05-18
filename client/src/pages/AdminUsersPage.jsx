import { useEffect, useState } from "react";
import { Alert, Box, CircularProgress, Paper, Typography } from "@mui/material";
import { getAdminUsers } from "../services/admin.service.js";

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await getAdminUsers();
        setUsers(data?.users || []);
      } catch (err) {
        console.error("Failed to load users:", err);
        setError("לא הצלחנו לטעון משתמשים");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, []);

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
        כל המשתמשים
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      {users.length === 0 ? (
        <Typography>אין משתמשים להצגה</Typography>
      ) : (
        users.map((user) => (
          <Paper key={user._id} sx={{ p: 2, mb: 2 }}>
            <Typography variant="h6">{user.name}</Typography>
            <Typography>מספר מזהה: {user.idNumber}</Typography>
            <Typography>תפקיד: {user.role}</Typography>
          </Paper>
        ))
      )}
    </Box>
  );
};

export default AdminUsersPage;