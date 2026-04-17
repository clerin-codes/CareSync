const mongoose = require("mongoose");

const ratingSchema = new mongoose.Schema(
  {
    appointmentId: {
      type: String,
      required: true,
      unique: true,
      index: true
    },
    patientId: {
      type: String,
      required: true,
      index: true
    },
    patientName: {
      type: String,
      required: true
    },
    doctorId: {
      type: String,
      required: true,
      index: true
    },
    doctorProfileId: {
      type: String,
      required: true,
      index: true
    },
    doctorName: {
      type: String,
      default: ""
    },
    stars: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    review: {
      type: String,
      default: "",
      trim: true,
      maxlength: 500
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Rating", ratingSchema);
