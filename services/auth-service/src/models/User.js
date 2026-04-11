const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true
    },
    password: {
      type: String,
      required: true
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "admin"],
      default: "patient"
    },
    isVerified: {
      type: Boolean,
      default: function () {
        return this.role === "doctor" ? false : true;
      }
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);