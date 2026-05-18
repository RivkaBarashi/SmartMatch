import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  CircularProgress,
  Alert,
} from "@mui/material";
import api from "../api/axios.js";

export default function AdminPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchUsers = async () => {
    setError("");
    setLoading(true);

    try {
      const response = await api.get("/api/admin/users");
      setUsers(response.data?.users || []);
    } catch (fetchError) {
      let message = fetchError?.response?.data?.message || fetchError.message || "שגיאה בטעינת משתמשים";
      if (fetchError?.response?.status === 403) {
        message = "אין הרשאת מנהל";
      }
      setError(message);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        ניהול מנהל
      </Typography>

      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, alignItems: "center", mb: 3 }}>
        <Button variant="contained" color="primary" onClick={fetchUsers}>
          הצג כל המשתמשים
        </Button>
        {loading && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={20} />
            <Typography>טוען משתמשים...</Typography>
          </Box>
        )}
      </Box>

      {error ? (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      ) : null}

      {users.length > 0 ? (
        <TableContainer component={Paper} elevation={2}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>שם</TableCell>
                <TableCell>תעודת זהות</TableCell>
                <TableCell>תפקיד</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user._id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.idNumber}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        !loading && !error && (
          <Typography color="text.secondary">לא הוצגו עדיין משתמשים.</Typography>
        )
      )}
    </Container>
  );
}
