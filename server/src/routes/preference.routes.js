const express = require("express");
const router = express.Router();
const { getPreferences, updatePreferences } = require("../controllers/preference.controller");
const { protect } = require("../middleware/auth.middleware");

router.get("/", protect, getPreferences);
router.put("/", protect, updatePreferences);

module.exports = router;