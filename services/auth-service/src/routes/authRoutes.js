const express = require("express");
const router = express.Router();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  createAdmin,
  verifyDoctor,
} = require("../controllers/authController");

const protect = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");

router.post("/register", register);
router.post("/login", login);

router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.put("/change-password", protect, changePassword);

router.post("/create-admin", protect, authorize("admin"), createAdmin);
router.put("/verify-doctor/:id", protect, authorize("admin"), verifyDoctor);

module.exports = router;