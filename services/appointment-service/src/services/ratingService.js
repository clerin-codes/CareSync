const Rating = require("../models/Rating");
const Appointment = require("../models/Appointment");

const createRating = async ({ appointmentId, patientId, rating, review }) => {
  const appointment = await Appointment.findById(appointmentId);
  if (!appointment) {
    const err = new Error("Appointment not found");
    err.statusCode = 404;
    throw err;
  }
  if (appointment.status !== "completed") {
    const err = new Error("Can only rate completed appointments");
    err.statusCode = 400;
    throw err;
  }
  if (appointment.patient.toString() !== patientId.toString()) {
    const err = new Error("You can only rate your own appointments");
    err.statusCode = 403;
    throw err;
  }

  const newRating = await Rating.create({
    doctorId: appointment.doctor,
    patientId,
    appointmentId,
    rating,
    review: review || "",
  });

  return newRating;
};

const getRatingByAppointment = async (appointmentId) => {
  const rating = await Rating.findOne({ appointmentId });
  return rating;
};

module.exports = { createRating, getRatingByAppointment };
