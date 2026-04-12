const bcrypt = require("bcrypt");
const User = require("../models/User");
const generateToken = require("../utils/generateToken");

// Register patient or doctor
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

// Login with email or phone
const login = async (req, res) => {
  try {
    const { email, phone, password } = req.body;

    if ((!email && !phone) || !password) {
      return res.status(400).json({
        message: "Email or phone and password are required",
      });
    }

    const query = email
      ? { email: email.toLowerCase() }
      : { phone };

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

// Admin creates admin manually or by seed
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

// Admin verifies doctor
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
  createAdmin,
  verifyDoctor,
};