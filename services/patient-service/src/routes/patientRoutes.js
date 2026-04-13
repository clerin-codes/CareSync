const express = require("express");
const {
  getMyProfile,
  createMyProfile,
  updateMyProfile,
  getAllPatients,
  updatePatientStatus,
  uploadMyDocument,
  getMyDocuments,
  getMyDashboard,
  deleteMyDocument
} = require("../controllers/patientController");

const { protect } = require("../middleware/authMiddleware");
const { authorize } = require("../middleware/authorize");
const uploadPatientDocument = require("../middleware/uploadPatientDocument");


const router = express.Router();

router.post("/me", protect, authorize("patient"), createMyProfile);
router.get("/me", protect, authorize("patient"), getMyProfile);
router.patch("/me", protect, authorize("patient"), updateMyProfile);
router.get("/me/dashboard", protect, authorize("patient"), getMyDashboard);

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