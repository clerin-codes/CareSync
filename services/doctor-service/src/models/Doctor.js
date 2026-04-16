const mongoose = require("mongoose");

const availabilitySlotSchema = new mongoose.Schema(
  {
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    isBooked: { type: Boolean, default: false },
    appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Appointment", default: null },
  },
  { _id: true }
);

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    doctorId: { type: String, required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    avatarUrl: { type: String, default: "" },
    specialization: { type: String, trim: true, default: "" },
    qualifications: [{ type: String, trim: true }],
    experience: { type: Number, default: 0 },
    bio: { type: String, trim: true, default: "" },
    licenseNumber: { type: String, trim: true, default: "" },
    phone: { type: String, trim: true, default: "" },
    consultationFee: { type: Number, default: 0 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalRatings: { type: Number, default: 0 },
    availabilitySlots: [availabilitySlotSchema],
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Doctor", doctorSchema);
