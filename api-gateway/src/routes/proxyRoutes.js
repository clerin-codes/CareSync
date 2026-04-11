const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Auth service - public routes
router.use(
  "/auth",
  createProxyMiddleware({
    target: process.env.AUTH_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/auth": "/api/auth"
    }
  })
);

// Patient service - protected
router.use(
  "/patients",
  protect,
  createProxyMiddleware({
    target: process.env.PATIENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/patients": "/api/patients"
    }
  })
);

// Doctor service - protected
router.use(
  "/doctors",
  protect,
  createProxyMiddleware({
    target: process.env.DOCTOR_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/doctors": "/api/doctors"
    }
  })
);

// Appointment service - protected
router.use(
  "/appointments",
  protect,
  createProxyMiddleware({
    target: process.env.APPOINTMENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/appointments": "/api/appointments"
    }
  })
);

// Payment service - protected
router.use(
  "/payments",
  protect,
  createProxyMiddleware({
    target: process.env.PAYMENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/payments": "/api/payments"
    }
  })
);

// Notification service - admin only example
router.use(
  "/notifications",
  protect,
  authorizeRoles("admin"),
  createProxyMiddleware({
    target: process.env.NOTIFICATION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/notifications": "/api/notifications"
    }
  })
);

// Telemedicine service - protected
router.use(
  "/telemedicine",
  protect,
  createProxyMiddleware({
    target: process.env.TELEMEDICINE_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/telemedicine": "/api/telemedicine"
    }
  })
);

module.exports = router;