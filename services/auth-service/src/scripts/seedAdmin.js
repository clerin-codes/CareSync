const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("../models/User");

const seedAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB connected");

    const fullName = process.env.SEED_ADMIN_NAME || "Admin User";
    const email = process.env.SEED_ADMIN_EMAIL || "admin123@gmail.com";
    const password = process.env.SEED_ADMIN_PASSWORD || "admin123";

    const existingAdmin = await User.findOne({ email });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const admin = await User.create({
      fullName,
      email,
      passwordHash,
      role: "admin",
      isVerified: true,
      isActive: true,
      status: "ACTIVE",
    });

    console.log("Admin created successfully");
    console.log({
      id: admin._id,
      fullName: admin.fullName,
      email: admin.email,
      role: admin.role,
    });

    process.exit(0);
  } catch (error) {
    console.error("Failed to seed admin:", error.message);
    process.exit(1);
  }
};

seedAdmin();