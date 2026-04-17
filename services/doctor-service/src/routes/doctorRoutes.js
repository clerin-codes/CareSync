const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authorize");
const validateRequest = require("../middleware/validateRequest");
const { createProfileRules, updateProfileRules, addSlotsRules, mongoIdParam } = require("../validators/doctorValidator");
const {
  createProfile,
  getProfile,
  updateProfile,
  getDashboard,
  getAvailability,
  addSlots,
  deleteSlot,
  getAppointments,
  listDoctors,
  getDoctorById,
} = require("../controllers/doctorController");

router.get("/public", listDoctors);
router.get("/public/:id", getDoctorById);

router.use(protect);

router.post("/profile", authorize("doctor"), createProfileRules, validateRequest, createProfile);
router.get("/profile", authorize("doctor"), getProfile);
router.put("/profile", authorize("doctor"), updateProfileRules, validateRequest, updateProfile);

router.get("/dashboard", authorize("doctor"), getDashboard);

router.get("/availability", authorize("doctor"), getAvailability);
router.post("/availability", authorize("doctor"), addSlotsRules, validateRequest, addSlots);
router.delete("/availability/:slotId", authorize("doctor"), ...mongoIdParam("slotId"), validateRequest, deleteSlot);

router.get("/appointments", authorize("doctor"), getAppointments);

module.exports = router;
