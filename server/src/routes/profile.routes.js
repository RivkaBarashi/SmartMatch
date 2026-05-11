const express = require("express");
const router = express.Router();
const { updateProfile } = require("../controllers/profile.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

// Middleware to handle both JSON and multipart/form-data
const handleUpload = upload.fields([
  { name: 'resumePDF', maxCount: 1 },
  { name: 'profileImage', maxCount: 1 }
]);

router.put("/update", protect, handleUpload, updateProfile);

module.exports = router;