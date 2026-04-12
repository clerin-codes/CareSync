const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["patient", "doctor", "responder", "admin"],
      required: true,
    },

    fullName: {
      type: String,
      trim: true,
      required: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
      unique: true,
      sparse: true,
    },

    phone: {
      type: String,
      trim: true,
      unique: true,
      sparse: true,
    },

    passwordHash: {
      type: String,
      required: true,
    },

    isVerified: {
      type: Boolean,
      default: function () {
        return this.role === "doctor" ? false : true;
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    refreshTokenHash: {
      type: String,
      default: null,
    },

    lastLoginAt: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["ACTIVE", "PENDING", "REJECTED", "SUSPENDED"],
      default: "ACTIVE",
    },

    passwordResetToken: {
      type: String,
      default: null,
    },

    passwordResetExpires: {
      type: Date,
      default: null,
    },

    passwordChangedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);