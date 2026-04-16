const express = require("express");
const {
  sendEmailNotification,
  sendWelcomeEmail,
  sendAppointmentConfirmation,
} = require("../controllers/notificationController");

const router = express.Router();

router.post("/send-email", sendEmailNotification);
router.post("/welcome", sendWelcomeEmail);
router.post("/appointment-confirmation", sendAppointmentConfirmation);

module.exports = router;