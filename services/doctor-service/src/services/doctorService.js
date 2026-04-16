const Doctor = require("../models/Doctor");
const User = require("../models/User");
const Counter = require("../models/Counter");
const Appointment = require("../models/Appointment");

const getNextDoctorId = async () => {
  const counter = await Counter.findOneAndUpdate(
    { key: "doctor" },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );
  return `DOC-${String(counter.seq).padStart(6, "0")}`;
};

const createDoctorProfile = async ({ userId, fullName, specialization, qualifications, experience, bio, licenseNumber, consultationFee, phone }) => {
  const existing = await Doctor.findOne({ userId, isDeleted: false });
  if (existing) {
    const err = new Error("Doctor profile already exists");
    err.statusCode = 409;
    throw err;
  }

  const user = await User.findById(userId);
  if (!user || user.role !== "doctor") {
    const err = new Error("User not found or not a doctor");
    err.statusCode = 400;
    throw err;
  }

  const doctorId = await getNextDoctorId();

  const doctor = await Doctor.create({
    userId,
    doctorId,
    fullName: fullName || user.fullName,
    specialization: specialization || "",
    qualifications: qualifications || [],
    experience: experience || 0,
    bio: bio || "",
    licenseNumber: licenseNumber || "",
    consultationFee: consultationFee || 0,
    phone: phone || user.phone || "",
  });

  return doctor;
};

const getDoctorProfile = async (userId) => {
  const doctor = await Doctor.findOne({ userId, isDeleted: false });
  if (!doctor) {
    const err = new Error("Doctor profile not found");
    err.statusCode = 404;
    throw err;
  }
  return doctor;
};

const updateDoctorProfile = async (userId, updates) => {
  const allowed = ["fullName", "specialization", "qualifications", "experience", "bio", "licenseNumber", "consultationFee", "phone"];
  const sanitized = {};
  for (const key of allowed) {
    if (updates[key] !== undefined) sanitized[key] = updates[key];
  }

  const doctor = await Doctor.findOneAndUpdate(
    { userId, isDeleted: false },
    { $set: sanitized },
    { new: true }
  );

  if (!doctor) {
    const err = new Error("Doctor profile not found");
    err.statusCode = 404;
    throw err;
  }

  return doctor;
};

const getDashboardStats = async (userId) => {
  const doctor = await Doctor.findOne({ userId, isDeleted: false });
  if (!doctor) {
    const err = new Error("Doctor profile not found");
    err.statusCode = 404;
    throw err;
  }

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);
  const todayEnd = new Date();
  todayEnd.setHours(23, 59, 59, 999);

  const [total, pending, confirmed, completed, todayCount] = await Promise.all([
    Appointment.countDocuments({ doctor: userId }),
    Appointment.countDocuments({ doctor: userId, status: "pending" }),
    Appointment.countDocuments({ doctor: userId, status: "confirmed" }),
    Appointment.countDocuments({ doctor: userId, status: "completed" }),
    Appointment.countDocuments({ doctor: userId, date: { $gte: todayStart, $lte: todayEnd } }),
  ]);

  return {
    doctor: { fullName: doctor.fullName, specialization: doctor.specialization, doctorId: doctor.doctorId, rating: doctor.rating, totalRatings: doctor.totalRatings },
    stats: { total, pending, confirmed, completed, todayCount },
  };
};

const getAvailability = async (userId) => {
  const doctor = await Doctor.findOne({ userId, isDeleted: false }).select("availabilitySlots");
  if (!doctor) {
    const err = new Error("Doctor profile not found");
    err.statusCode = 404;
    throw err;
  }
  return doctor.availabilitySlots;
};

const addAvailabilitySlots = async (userId, slots) => {
  const doctor = await Doctor.findOne({ userId, isDeleted: false });
  if (!doctor) {
    const err = new Error("Doctor profile not found");
    err.statusCode = 404;
    throw err;
  }

  const newSlots = [];
  for (const slot of slots) {
    const duplicate = doctor.availabilitySlots.find(
      (s) => s.date === slot.date && s.startTime === slot.startTime
    );
    if (!duplicate) {
      newSlots.push({ date: slot.date, startTime: slot.startTime, endTime: slot.endTime });
    }
  }

  if (newSlots.length > 0) {
    doctor.availabilitySlots.push(...newSlots);
    await doctor.save();
  }

  return doctor.availabilitySlots;
};

const deleteAvailabilitySlot = async (userId, slotId) => {
  const doctor = await Doctor.findOne({ userId, isDeleted: false });
  if (!doctor) {
    const err = new Error("Doctor profile not found");
    err.statusCode = 404;
    throw err;
  }

  const slot = doctor.availabilitySlots.id(slotId);
  if (!slot) {
    const err = new Error("Slot not found");
    err.statusCode = 404;
    throw err;
  }
  if (slot.isBooked) {
    const err = new Error("Cannot delete a booked slot");
    err.statusCode = 400;
    throw err;
  }

  slot.deleteOne();
  await doctor.save();
  return doctor.availabilitySlots;
};

const getMyAppointments = async ({ userId, status, page = 1, limit = 10 }) => {
  const query = { doctor: userId };
  if (status) query.status = status;

  const total = await Appointment.countDocuments(query);
  const appointments = await Appointment.find(query)
    .populate("patient", "fullName email phone")
    .sort("-date -time")
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    appointments,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
  };
};

const getPublicDoctors = async ({ specialization, search, page = 1, limit = 10 }) => {
  const query = { isDeleted: false };

  if (specialization) {
    query.specialization = { $regex: specialization, $options: "i" };
  }
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { specialization: { $regex: search, $options: "i" } },
    ];
  }

  const total = await Doctor.countDocuments(query);
  const doctors = await Doctor.find(query)
    .select("userId fullName specialization experience bio rating totalRatings consultationFee avatarUrl doctorId phone availabilitySlots")
    .sort("-rating")
    .skip((page - 1) * limit)
    .limit(limit);

  return {
    doctors,
    pagination: { total, page: parseInt(page), limit: parseInt(limit), pages: Math.ceil(total / limit) },
  };
};

const getPublicDoctorById = async (id) => {
  const doctor = await Doctor.findOne({ _id: id, isDeleted: false })
    .select("fullName specialization phone avatarUrl qualifications experience bio consultationFee rating totalRatings availabilitySlots doctorId licenseNumber");
  if (!doctor) {
    const err = new Error("Doctor not found");
    err.statusCode = 404;
    throw err;
  }
  return doctor;
};

module.exports = {
  createDoctorProfile,
  getDoctorProfile,
  updateDoctorProfile,
  getDashboardStats,
  getAvailability,
  addAvailabilitySlots,
  deleteAvailabilitySlot,
  getMyAppointments,
  getPublicDoctors,
  getPublicDoctorById,
};
