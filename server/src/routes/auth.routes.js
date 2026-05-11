const express = require("express");
const router = express.Router();
const { register, login, getMe } = require("../controllers/auth.controller");
const { protect } = require("../middleware/auth.middleware");
const upload = require("../middleware/upload.middleware");

router.post("/register", upload.fields([
  { name: 'resumePDF', maxCount: 1 },
  { name: 'profileImage', maxCount: 1 }
]), register);
router.post("/login", login);
router.get("/me", protect, getMe);

module.exports = router;