const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();

app.use(cors());
app.use(express.json());

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const authRoutes = require("./src/routes/auth.routes");
const profileRoutes = require("./src/routes/profile.routes");
const preferenceRoutes = require("./src/routes/preference.routes");
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/preferences", preferenceRoutes);

// Test route
app.get("/api/test", (req, res) => {
  res.json({ message: "API is working" });
});

app.get("/", (req, res) => {
  res.send("SmartMatch server is running 🚀");
});

module.exports = app;
