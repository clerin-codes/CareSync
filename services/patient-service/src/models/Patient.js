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
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true
    },
    profilePhoto: {
      type: String,
      default: ""
    },
    phone: {
      type: String,
      default: "",
      validate: {
        validator: function (value) {
          return value === "" || /^[0-9]{10}$/.test(value);
        },
        message: "Phone number must be 10 digits"
      }
    },
    age: {
      type: Number,
      min: [0, "Age cannot be negative"],
      max: [120, "Age cannot exceed 120"],
      default: null
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other", ""],
        message: "Invalid gender value"
      },
      default: ""
    },
    address: {
      type: String,
      default: "",
      trim: true
    },
    bloodGroup: {
      type: String,
      enum: {
        values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""],
        message: "Invalid blood group"
      },
      default: ""
    },
    emergencyContact: {
      name: {
        type: String,
        default: "",
        trim: true
      },
      relationship: {
        type: String,
        default: "",
        trim: true
      },
      phone: {
        type: String,
        default: "",
        validate: {
          validator: function (value) {
            return value === "" || /^[0-9]{10}$/.test(value);
          },
          message: "Emergency contact phone must be 10 digits"
        }
      }
    },
    medicalHistory: {
      allergies: { type: [String], default: [] },
      chronicDiseases: { type: [String], default: [] },
      medications: { type: [String], default: [] },
      surgeries: { type: [String], default: [] },
      notes: { type: String, default: "" }
    },
    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "blocked"],
        message: "Invalid patient status"
      },
      default: "active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Patient", patientSchema);