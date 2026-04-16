const { sendEmail } = require("../services/emailService");

const sendEmailNotification = async (req, res) => {
  try {
    const { to, subject, text, html } = req.body;

    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({
        message: "to, subject, and text or html are required",
      });
    }

    const info = await sendEmail({ to, subject, text, html });

    return res.status(200).json({
      message: "Email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to send email",
      error: error.message,
    });
  }
};

const sendWelcomeEmail = async (req, res) => {
  try {
    const { to, fullName } = req.body;

    if (!to || !fullName) {
      return res.status(400).json({
        message: "to and fullName are required",
      });
    }

    const subject = "Welcome to CareSync";
    const text = `Hello ${fullName}, welcome to CareSync. Your account has been created successfully.`;
    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Welcome to CareSync</h2>
        <p>Hello <strong>${fullName}</strong>,</p>
        <p>Your account has been created successfully.</p>
        <p>Thank you for joining CareSync.</p>
      </div>
    `;

    const info = await sendEmail({ to, subject, text, html });

    return res.status(200).json({
      message: "Welcome email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to send welcome email",
      error: error.message,
    });
  }
};

const sendAppointmentConfirmation = async (req, res) => {
  try {
    const { to, fullName, doctorName, appointmentDate, appointmentTime } = req.body;

    if (!to || !fullName || !doctorName || !appointmentDate || !appointmentTime) {
      return res.status(400).json({
        message: "to, fullName, doctorName, appointmentDate and appointmentTime are required",
      });
    }

    const subject = "Appointment Confirmation";
    const text = `Hello ${fullName}, your appointment with Dr. ${doctorName} is confirmed for ${appointmentDate} at ${appointmentTime}.`;
    const html = `
      <div style="font-family: Arial, sans-serif;">
        <h2>Appointment Confirmation</h2>
        <p>Hello <strong>${fullName}</strong>,</p>
        <p>Your appointment with <strong>Dr. ${doctorName}</strong> is confirmed.</p>
        <p><strong>Date:</strong> ${appointmentDate}</p>
        <p><strong>Time:</strong> ${appointmentTime}</p>
      </div>
    `;

    const info = await sendEmail({ to, subject, text, html });

    return res.status(200).json({
      message: "Appointment confirmation email sent successfully",
      messageId: info.messageId,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to send appointment confirmation",
      error: error.message,
    });
  }
};

module.exports = {
  sendEmailNotification,
  sendWelcomeEmail,
  sendAppointmentConfirmation,
};