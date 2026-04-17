const express = require("express");
const {
  createRating,
  getRatingsByDoctor,
  getMyRatings
} = require("../controllers/ratingController");
const { authenticate, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", authenticate, authorize("PATIENT"), createRating);
router.get("/my", authenticate, authorize("PATIENT"), getMyRatings);
router.get("/doctor/:doctorProfileId", getRatingsByDoctor);

module.exports = router;
