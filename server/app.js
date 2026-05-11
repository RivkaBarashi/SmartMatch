const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());
const authRoutes = require("./src/routes/auth.routes");
app.use("/api/auth", authRoutes);
app.use("/api/profile", require("./src/routes/profile.routes"));
app.use("/api/preference", require("./src/routes/preference.routes"));

app.get("/", (req, res) => {
  res.send("SmartMatch server is running 🚀");
});

module.exports = app;


