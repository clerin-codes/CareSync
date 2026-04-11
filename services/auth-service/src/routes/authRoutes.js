const express = require("express");
const {
  register,
  login,
  createAdmin,
  verifyDoctor
} = require("../controllers/authController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/create-admin", createAdmin);
router.put("/verify-doctor/:id", protect, authorizeRoles("admin"), verifyDoctor);

module.exports = router;