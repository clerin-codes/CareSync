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
  getMyReports,
  getReportsByPatient,
  downloadReport,
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

router.post("/me", protect, authorize("PATIENT", "ADMIN"), createMyProfile);
router.get("/me", protect, authorize("PATIENT", "ADMIN"), getMyProfile);
router.patch("/me", protect, authorize("PATIENT", "ADMIN"), updateMyProfile);
router.get("/me/profile", protect, authorize("PATIENT", "ADMIN"), getMyProfile);
router.put("/me/profile", protect, authorize("PATIENT", "ADMIN"), updateMyProfile);
router.post("/me/avatar", protect, authorize("PATIENT", "ADMIN"), uploadAvatar.single("avatar"), uploadMyAvatar);
router.get("/me/dashboard", protect, authorize("PATIENT", "ADMIN"), getMyDashboard);
router.post("/me/emergency", protect, authorize("PATIENT", "ADMIN"), createEmergencyRequest);
router.post("/me/ai-explain", protect, authorize("PATIENT", "ADMIN"), aiExplainMedicalText);
router.get("/me/medical-history", protect, authorize("PATIENT", "ADMIN"), getAllMedicalHistory);
router.get("/doctors", protect, authorize("PATIENT", "ADMIN"), getAllDoctors);
router.get("/hospitals", protect, authorize("PATIENT", "ADMIN"), getAllHospitals);
router.get("/me/appointments", protect, authorize("PATIENT", "ADMIN"), getMyAppointments);


router.get("/", protect, authorize("ADMIN"), getAllPatients);
router.patch("/:id/status", protect, authorize("ADMIN"), updatePatientStatus);

router.post(
  "/me/documents",
  protect,
  uploadPatientDocument.single("document"),
  uploadMyDocument
);

// Document routes
// router.post("/me/documents", protect, authorize("PATIENT"), uploadMyDocument);
router.get("/me/documents", protect, authorize("PATIENT", "ADMIN"), getMyDocuments);
router.get("/me/reports", protect, authorize("PATIENT", "ADMIN"), getMyReports);
router.post(
  "/me/reports",
  protect,
  uploadPatientDocument.single("document"),
  uploadMyDocument
);
router.get("/reports/:reportId/download", protect, authorize("PATIENT", "DOCTOR", "ADMIN"), downloadReport);
router.get("/:id/reports", protect, authorize("DOCTOR", "ADMIN"), getReportsByPatient);
router.delete("/me/documents/:documentId", protect, authorize("PATIENT", "ADMIN"), deleteMyDocument);

module.exports = router;