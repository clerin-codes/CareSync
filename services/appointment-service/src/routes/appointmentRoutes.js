const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authorize");
const validateRequest = require("../middleware/validateRequest");
const {
  createAppointmentRules,
  updateAppointmentRules,
  statusTransitionRules,
  rescheduleRules,
  cancelRules,
} = require("../validators/appointmentValidator");
const { createRatingRules } = require("../validators/ratingValidator");
const {
  createAppointment,
  getAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
  transitionStatus,
  rescheduleAppointment,
  cancelAppointment,
  getAppointmentStats,
} = require("../controllers/appointmentController");
const { submitRating, getAppointmentRating } = require("../controllers/ratingController");

router.use(protect);

router.post("/", authorize("patient"), createAppointmentRules, validateRequest, createAppointment);
router.get("/stats", getAppointmentStats);
router.get("/", getAppointments);
router.get("/:id", getAppointmentById);
router.put("/:id", updateAppointmentRules, validateRequest, updateAppointment);
router.delete("/:id", deleteAppointment);
router.patch("/:id/status", authorize("doctor"), statusTransitionRules, validateRequest, transitionStatus);
router.patch("/:id/reschedule", rescheduleRules, validateRequest, rescheduleAppointment);
router.patch("/:id/cancel", cancelRules, validateRequest, cancelAppointment);

router.post("/:id/rating", authorize("patient"), createRatingRules, validateRequest, submitRating);
router.get("/:id/rating", getAppointmentRating);

module.exports = router;
