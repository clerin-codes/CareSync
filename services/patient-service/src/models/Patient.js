const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      default: ""
    },
    age: {
      type: Number,
      default: null
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: ""
    },
    address: {
      type: String,
      default: ""
    },
    bloodGroup: {
      type: String,
      default: ""
    },
    emergencyContact: {
      type: String,
      default: ""
    },
    medicalHistory: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Patient", patientSchema);