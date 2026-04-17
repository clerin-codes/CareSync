const Appointment = require("../models/Appointment");
const Rating = require("../models/Rating");

const toStars = (value) => {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return null;
  const rounded = Math.round(parsed);
  return rounded >= 1 && rounded <= 5 ? rounded : null;
};

const createRating = async (req, res) => {
  try {
    const { appointmentId, stars, review = "" } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ message: "appointmentId is required" });
    }

    const starValue = toStars(stars);
    if (!starValue) {
      return res.status(400).json({ message: "stars must be an integer between 1 and 5" });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment || appointment.patientId !== req.user.id) {
      return res.status(404).json({ message: "Appointment not found" });
    }

    if (appointment.status !== "COMPLETED") {
      return res.status(400).json({ message: "You can only rate completed appointments" });
    }

    const existing = await Rating.findOne({ appointmentId });
    if (existing) {
      return res.status(400).json({ message: "You have already rated this appointment" });
    }

    const rating = await Rating.create({
      appointmentId,
      patientId: req.user.id,
      patientName: req.user.name || "Patient",
      doctorId: appointment.doctorId,
      doctorProfileId: appointment.doctorProfileId,
      doctorName: appointment.doctorName,
      stars: starValue,
      review: (review || "").toString().trim().slice(0, 500)
    });

    return res.status(201).json({
      message: "Rating submitted successfully",
      rating
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already rated this appointment" });
    }
    return res.status(500).json({ message: "Server error while creating rating" });
  }
};

const getRatingsByDoctor = async (req, res) => {
  try {
    const { doctorProfileId } = req.params;
    const ratings = await Rating.find({ doctorProfileId }).sort({ createdAt: -1 });

    const count = ratings.length;
    const average = count === 0 ? 0 : ratings.reduce((sum, r) => sum + r.stars, 0) / count;

    return res.status(200).json({
      count,
      average: Number(average.toFixed(2)),
      ratings
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error while fetching ratings" });
  }
};

const getMyRatings = async (req, res) => {
  try {
    const ratings = await Rating.find({ patientId: req.user.id }).sort({ createdAt: -1 });
    return res.status(200).json(ratings);
  } catch (error) {
    return res.status(500).json({ message: "Server error while fetching ratings" });
  }
};

module.exports = {
  createRating,
  getRatingsByDoctor,
  getMyRatings
};
