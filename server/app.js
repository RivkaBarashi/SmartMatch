const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

const authRoutes = require("./src/routes/auth.routes");
const profileRoutes = require("./src/routes/profile.routes");
const preferenceRoutes = require("./src/routes/preference.routes");

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/preference", preferenceRoutes);

app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ message: "Invalid JSON payload" });
  }
  next(err);
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error handler:', err.message);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({ message: 'File too large' });
  }
  if (err.message && err.message.includes('File')) {
    return res.status(400).json({ message: err.message });
  }
  return res.status(500).json({ message: err.message || 'Server error' });
});

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

app.get("/", (req, res) => {
  res.send("SmartMatch server is running 🚀");
});

module.exports = app;
