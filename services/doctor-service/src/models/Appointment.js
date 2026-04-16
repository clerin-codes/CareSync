const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema(
  {
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    doctor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    date: { type: Date, required: true },
    time: { type: String, required: true },
    consultationType: { type: String, enum: ["in-person", "video", "phone", "physical"], required: true },
    symptoms: { type: String, trim: true },
    notes: { type: String, trim: true },
    status: { type: String, enum: ["pending", "confirmed", "completed", "cancelled"], default: "pending" },
    priority: { type: String, enum: ["low", "medium", "high", "urgent"], default: "low" },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Appointment || mongoose.model("Appointment", appointmentSchema);
