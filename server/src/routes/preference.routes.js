const express = require("express");
const router = express.Router();

const {
  createPreference,
  getMyPreference,
  updatePreference,
} = require("../controllers/preference.controller");

const { protect } = require("../middleware/auth.middleware");

router.post("/", protect, createPreference);
router.get("/me", protect, getMyPreference);
router.put("/", protect, updatePreference);

module.exports = router;