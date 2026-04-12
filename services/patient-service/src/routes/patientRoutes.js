const express = require("express");
const {
  getMyProfile,
  createMyProfile,
  updateMyProfile,
  getAllPatients,
  updatePatientStatus
} = require("../controllers/patientController");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/me", protect, authorize("patient"), createMyProfile);
router.get("/me", protect, authorize("patient"), getMyProfile);
router.put("/me", protect, authorize("patient"), updateMyProfile);

router.get("/", protect, authorize("admin"), getAllPatients);
router.put("/:id/status", protect, authorize("admin"), updatePatientStatus);

module.exports = router;