const bcrypt = require("bcrypt");
const crypto = require("crypto");
const User = require("../models/User");
const sendEmail  = require("../utils/sendEmail");
const generateToken = require("../utils/generateToken");

// Register
const register = async (req, res) => {
  try {
    const { fullName, email, phone, password, role } = req.body;

    if (!fullName || !password || !role || (!email && !phone)) {
      return res.status(400).json({
        message: "Full name, password, role, and email or phone are required",
      });
    }

    if (!["patient", "doctor", "responder"].includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    if (email) {
      const existingEmailUser = await User.findOne({ email: email.toLowerCase() });
      if (existingEmailUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    if (phone) {
      const existingPhoneUser = await User.findOne({ phone });
      if (existingPhoneUser) {
        return res.status(400).json({ message: "Phone already in use" });
      }
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await User.create({
      fullName,
      email: email ? email.toLowerCase() : undefined,
      phone: phone || undefined,
      passwordHash,
      role,
      isVerified: role === "doctor" ? false : true,
      status: role === "doctor" ? "PENDING" : "ACTIVE",
      isActive: true,
    });

    return res.status(201).json({
      message: `${role} registered successfully`,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        status: user.status,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({
        message: "Email or phone and password are required",
      });
    }

    const query = email ? { email: email.toLowerCase() } : { phone };
    const user = await User.findOne(query);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!user.isActive || user.status === "SUSPENDED") {
      return res.status(403).json({
        message: "Your account is inactive or suspended",
      });
    }

    if (user.role === "doctor" && !user.isVerified) {
      return res.status(403).json({
        message: "Doctor account is pending admin verification",
      });
    }

    user.lastLoginAt = new Date();
    await user.save();

    const token = generateToken(user);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        role: user.role,
        isVerified: user.isVerified,
        status: user.status,
        isActive: user.isActive,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Forgot Password
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail });

    // do not reveal whether account exists
    if (!user) {
      return res.status(200).json({
        message: "If an account with that email exists, an OTP has been sent",
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    user.passwordResetToken = hashedOtp;
    user.passwordResetExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save();

    const subject = "CareSync Password Reset OTP";
    const text = `Your CareSync OTP is ${otp}. It will expire in 10 minutes.`;
    const html = `
      <div style="font-family: Arial, sans-serif; color: #1f2937; line-height: 1.6;">
        <h2 style="color: #178d95; margin-bottom: 8px;">CareSync Password Reset</h2>
        <p>Hello ${user.fullName || "User"},</p>
        <p>Use the OTP below to reset your password:</p>
        <div style="font-size: 28px; font-weight: bold; letter-spacing: 6px; color: #111827; margin: 16px 0;">
          ${otp}
        </div>
        <p>This OTP will expire in <strong>10 minutes</strong>.</p>
        <p>If you did not request this, you can ignore this email.</p>
      </div>
    `;

    await sendEmail({
      to: user.email,
      subject,
      text,
      html,
    });

    return res.status(200).json({
      message: "OTP sent successfully to your email",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { otp, newPassword, confirmPassword } = req.body;

    if (!otp || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "OTP, new password, and confirm password are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password do not match",
      });
    }

    const hashedOtp = crypto.createHash("sha256").update(otp).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedOtp,
      passwordResetExpires: { $gt: new Date() },
    });

    if (!user) {
      return res.status(400).json({
        message: "Invalid or expired OTP",
      });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    user.passwordHash = passwordHash;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.passwordChangedAt = new Date();

    await user.save();

    return res.status(200).json({
      message: "Password reset successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Change Password
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        message: "Current password, new password, and confirm password are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        message: "New password and confirm password do not match",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const isSamePassword = await bcrypt.compare(newPassword, user.passwordHash);

    if (isSamePassword) {
      return res.status(400).json({
        message: "New password cannot be the same as current password",
      });
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    user.passwordChangedAt = new Date();

    await user.save();

    return res.status(200).json({
      message: "Password changed successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Create Admin
const createAdmin = async (req, res) => {
  try {
    const { fullName, email, phone, password } = req.body;

    if (!fullName || !password || (!email && !phone)) {
      return res.status(400).json({
        message: "Full name, password, and email or phone are required",
      });
    }

    if (email) {
      const existingEmailUser = await User.findOne({ email: email.toLowerCase() });
      if (existingEmailUser) {
        return res.status(400).json({ message: "Email already in use" });
      }
    }

    if (phone) {
      const existingPhoneUser = await User.findOne({ phone });
      if (existingPhoneUser) {
        return res.status(400).json({ message: "Phone already in use" });
      }
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters long",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await User.create({
      fullName,
      email: email ? email.toLowerCase() : undefined,
      phone: phone || undefined,
      passwordHash,
      role: "admin",
      isVerified: true,
      isActive: true,
      status: "ACTIVE",
    });

    return res.status(201).json({
      message: "Admin created successfully",
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        phone: admin.phone,
        role: admin.role,
        isVerified: admin.isVerified,
        status: admin.status,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// Verify Doctor
const verifyDoctor = async (req, res) => {
  try {
    const { id } = req.params;

    const doctor = await User.findById(id);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    if (doctor.role !== "doctor") {
      return res.status(400).json({ message: "User is not a doctor" });
    }

    doctor.isVerified = true;
    doctor.status = "ACTIVE";

    await doctor.save();

    return res.status(200).json({
      message: "Doctor verified successfully",
      doctor: {
        id: doctor._id,
        fullName: doctor.fullName,
        email: doctor.email,
        phone: doctor.phone,
        role: doctor.role,
        isVerified: doctor.isVerified,
        status: doctor.status,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  changePassword,
  createAdmin,
  verifyDoctor,
};