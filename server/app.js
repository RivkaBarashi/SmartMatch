const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// app.use("/auth", require("./src/routes/auth.routes"));
app.get("/", (req, res) => {
  res.send("SmartMatch server is running 🚀");
});

module.exports = app;