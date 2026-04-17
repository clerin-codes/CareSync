const express = require("express");
const {
  getMyProfile,
  createMyProfile,
  updateMyProfile,
  uploadMyAvatar,
  getAllPatients,
  updatePatientStatus,
  uploadMyDocument,
  getMyDocuments,
  getMyDashboard,
  deleteMyDocument,
  createEmergencyRequest,
  aiExplainMedicalText,
  getAllMedicalHistory,
  getAllDoctors,
  getAllHospitals,
  getMyAppointments,
} = require("../controllers/patientController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authorize");
const uploadPatientDocument = require("../middleware/uploadPatientDocument");
const uploadAvatar = require("../middleware/uploadAvatar");


const router = express.Router();

router.post("/me", protect, authorize("patient", "admin"), createMyProfile);
router.get("/me", protect, authorize("patient", "admin"), getMyProfile);
router.patch("/me", protect, authorize("patient", "admin"), updateMyProfile);
router.post("/me/avatar", protect, authorize("patient", "admin"), uploadAvatar.single("avatar"), uploadMyAvatar);
router.get("/me/dashboard", protect, authorize("patient", "admin"), getMyDashboard);
router.post("/me/emergency", protect, authorize("patient", "admin"), createEmergencyRequest);
router.post("/me/ai-explain", protect, authorize("patient", "admin"), aiExplainMedicalText);
router.get("/me/medical-history", protect, authorize("patient", "admin"), getAllMedicalHistory);
router.get("/doctors", protect, authorize("patient", "admin"), getAllDoctors);
router.get("/hospitals", protect, authorize("patient", "admin"), getAllHospitals);
router.get("/me/appointments", protect, authorize("patient", "admin"), getMyAppointments);


router.get("/", protect, authorize("admin"), getAllPatients);
router.patch("/:id/status", protect, authorize("admin"), updatePatientStatus);

router.post(
  "/me/documents",
  protect,
  uploadPatientDocument.single("document"),
  uploadMyDocument
);

// Document routes
// router.post("/me/documents", protect, authorize("patient"), uploadMyDocument);
router.get("/me/documents", protect, authorize("patient"), getMyDocuments);
router.delete("/me/documents/:documentId", protect, authorize("patient"), deleteMyDocument);

module.exports = router;