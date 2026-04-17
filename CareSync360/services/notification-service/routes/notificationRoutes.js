const express = require("express");
const { sendEmail, sendSms } = require("../controllers/notificationController");

const router = express.Router();

router.post("/email", sendEmail);
router.post("/sms", sendSms);

module.exports = router;
