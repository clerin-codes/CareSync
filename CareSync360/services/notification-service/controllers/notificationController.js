const nodemailer = require("nodemailer");

const normalizeEnvValue = (value = "") => value.toString().trim();
const normalizeSmtpPassword = (value = "") => {
  const raw = value.toString();

  // Google app passwords are often pasted with spaces for readability.
  if ((process.env.SMTP_HOST || "").toLowerCase().includes("gmail")) {
    return raw.replace(/\s+/g, "");
  }

  return raw.trim();
};

const createTransporter = () => {
  const host = normalizeEnvValue(process.env.SMTP_HOST);
  const user = normalizeEnvValue(process.env.SMTP_USER);
  const pass = normalizeSmtpPassword(process.env.SMTP_PASS);

  if (host && user && pass) {
    return nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: false,
      auth: {
        user,
        pass
      }
    });
  }

  return nodemailer.createTransport({
    jsonTransport: true
  });
};

const normalizePhoneNumber = (value = "") => value.toString().replace(/\s+/g, "").trim();

const sendSms = async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ message: "to and message are required" });
    }

    const userId = normalizeEnvValue(process.env.SMSLENZ_USER_ID);
    const apiKey = normalizeEnvValue(process.env.SMSLENZ_API_KEY);
    const senderId = normalizeEnvValue(process.env.SMSLENZ_SENDER_ID);

    if (!userId || !apiKey || !senderId) {
      return res.status(500).json({
        message: "SMSLenz credentials are missing. Configure SMSLENZ_USER_ID, SMSLENZ_API_KEY and SMSLENZ_SENDER_ID"
      });
    }

    const smsPayload = {
      user_id: userId,
      api_key: apiKey,
      sender_id: senderId,
      mobile: normalizePhoneNumber(to),
      message: normalizeEnvValue(message)
    };

    const response = await fetch("https://smslenz.lk/api/v3/sms/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(smsPayload)
    });

    const bodyText = await response.text();

    if (!response.ok) {
      return res.status(502).json({
        message: "SMS provider request failed",
        providerStatus: response.status,
        providerResponse: bodyText
      });
    }

    return res.status(200).json({
      message: "SMS notification sent",
      providerResponse: bodyText
    });
  } catch (error) {
    console.error("SMS notification failed:", {
      message: error.message
    });
    return res.status(500).json({ message: "Server error while sending SMS notification" });
  }
};

const sendEmail = async (req, res) => {
  try {
    const { to, subject, message } = req.body;

    if (!to || !subject || !message) {
      return res.status(400).json({ message: "to, subject and message are required" });
    }

    const transporter = createTransporter();
    const result = await transporter.sendMail({
      from:
        normalizeEnvValue(process.env.EMAIL_FROM) ||
        normalizeEnvValue(process.env.SMTP_FROM) ||
        normalizeEnvValue(process.env.SMTP_USER) ||
        "smart-healthcare@example.com",
      to,
      subject,
      text: message
    });

    return res.status(200).json({
      message: "Notification sent",
      resultId: result.messageId || "mock-message"
    });
  } catch (error) {
    console.error("Notification send failed:", {
      message: error.message,
      code: error.code,
      response: error.response
    });
    return res.status(500).json({ message: "Server error while sending notification" });
  }
};

module.exports = {
  sendEmail,
  sendSms
};
