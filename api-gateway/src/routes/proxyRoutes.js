const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

const fixRequestBody = (proxyReq, req) => {
  if (!req.body || !Object.keys(req.body).length) return;
  if (req.method === "GET") return;

  const bodyData = JSON.stringify(req.body);

  proxyReq.setHeader("Content-Type", "application/json");
  proxyReq.setHeader("Content-Length", Buffer.byteLength(bodyData));
  proxyReq.write(bodyData);
};

router.use(
  "/auth",
  createProxyMiddleware({
    target: `${process.env.AUTH_SERVICE_URL}/api/auth`,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req) => {
        fixRequestBody(proxyReq, req);
      },
      error: (err, req, res) => {
        console.error("Auth proxy error:", err.message);
        res.status(500).json({ message: "Gateway proxy error - Auth Service" });
      }
    }
  })
);

router.use(
  "/patients",
  protect,
  createProxyMiddleware({
    target: `${process.env.PATIENT_SERVICE_URL}/api/patients`,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req) => {
        fixRequestBody(proxyReq, req);
      },
      error: (err, req, res) => {
        console.error("Patient proxy error:", err.message);
        res.status(500).json({ message: "Gateway proxy error - Patient Service" });
      }
    }
  })
);

router.use(
  "/doctors",
  protect,
  createProxyMiddleware({
    target: `${process.env.DOCTOR_SERVICE_URL}/api/doctors`,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req) => {
        fixRequestBody(proxyReq, req);
      },
      error: (err, req, res) => {
        console.error("Doctor proxy error:", err.message);
        res.status(500).json({ message: "Gateway proxy error - Doctor Service" });
      }
    }
  })
);

router.use(
  "/appointments",
  protect,
  createProxyMiddleware({
    target: `${process.env.APPOINTMENT_SERVICE_URL}/api/appointments`,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req) => {
        fixRequestBody(proxyReq, req);
      },
      error: (err, req, res) => {
        console.error("Appointment proxy error:", err.message);
        res.status(500).json({ message: "Gateway proxy error - Appointment Service" });
      }
    }
  })
);

router.use(
  "/payments",
  protect,
  createProxyMiddleware({
    target: `${process.env.PAYMENT_SERVICE_URL}/api/payments`,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req) => {
        fixRequestBody(proxyReq, req);
      },
      error: (err, req, res) => {
        console.error("Payment proxy error:", err.message);
        res.status(500).json({ message: "Gateway proxy error - Payment Service" });
      }
    }
  })
);

router.use(
  "/notifications",
  protect,
  createProxyMiddleware({
    target: `${process.env.NOTIFICATION_SERVICE_URL}/api/notifications`,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req) => {
        fixRequestBody(proxyReq, req);
      },
      error: (err, req, res) => {
        console.error("Notification proxy error:", err);
        res.status(500).json({ message: "Gateway proxy error - Notification Service" });
      },
    },
  })
);

router.use(
  "/telemedicine",
  protect,
  createProxyMiddleware({
    target: `${process.env.TELEMEDICINE_SERVICE_URL}/api/telemedicine`,
    changeOrigin: true,
    on: {
      proxyReq: (proxyReq, req) => {
        fixRequestBody(proxyReq, req);
      },
      error: (err, req, res) => {
        console.error("Telemedicine proxy error:", err.message);
        res.status(500).json({ message: "Gateway proxy error - Telemedicine Service" });
      }
    }
  })
);

module.exports = router;