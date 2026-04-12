const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    patientId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
    },

    avatarUrl: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      default: "",
      validate: {
        validator: function (value) {
          return value === "" || /^[0-9]{10}$/.test(value);
        },
        message: "Phone number must be 10 digits",
      },
    },

    dob: {
      type: Date,
      default: null,
    },

    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other", ""],
        message: "Invalid gender value",
      },
      default: "",
    },

    nic: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      district: {
        type: String,
        default: "",
        trim: true,
      },
      city: {
        type: String,
        default: "",
        trim: true,
      },
      line1: {
        type: String,
        default: "",
        trim: true,
      },
    },

    bloodGroup: {
      type: String,
      enum: {
        values: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""],
        message: "Invalid blood group",
      },
      default: "",
    },

    emergencyContact: {
      name: {
        type: String,
        default: "",
        trim: true,
      },
      relationship: {
        type: String,
        default: "",
        trim: true,
      },
      phone: {
        type: String,
        default: "",
        validate: {
          validator: function (value) {
            return value === "" || /^[0-9]{10}$/.test(value);
          },
          message: "Emergency contact phone must be 10 digits",
        },
      },
    },

    medicalHistory: {
      allergies: {
        type: [String],
        default: [],
      },
      chronicDiseases: {
        type: [String],
        default: [],
      },
      medications: {
        type: [String],
        default: [],
      },
      surgeries: {
        type: [String],
        default: [],
      },
      notes: {
        type: String,
        default: "",
        trim: true,
      },
    },

    heightCm: {
      type: Number,
      min: [30, "Height cannot be less than 30 cm"],
      max: [250, "Height cannot exceed 250 cm"],
      default: null,
    },

    weightKg: {
      type: Number,
      min: [2, "Weight cannot be less than 2 kg"],
      max: [300, "Weight cannot exceed 300 kg"],
      default: null,
    },

    profileStrength: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },

    status: {
      type: String,
      enum: {
        values: ["active", "inactive", "blocked"],
        message: "Invalid patient status",
      },
      default: "active",
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Patient", patientSchema);