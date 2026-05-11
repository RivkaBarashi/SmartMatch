const express = require("express");
const router = express.Router();

const {
  createProfile,
  getMyProfile,
  updateProfile,
} = require("../controllers/profile.controller");

const { protect } = require("../middleware/auth.middleware");

router.post("/", protect, createProfile);
router.get("/me", protect, getMyProfile);
router.put("/", protect, updateProfile);

module.exports = router;