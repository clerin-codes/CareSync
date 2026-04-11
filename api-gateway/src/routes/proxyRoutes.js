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

/* ================= AUTH SERVICE ================= */
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

/* ================= PATIENT SERVICE ================= */
router.use(
  "/patients",
  protect,
  createProxyMiddleware({
    target: process.env.PATIENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/patients": "/api/patients"
    },
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

/* ================= DOCTOR SERVICE ================= */
router.use(
  "/doctors",
  protect,
  createProxyMiddleware({
    target: process.env.DOCTOR_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/doctors": "/api/doctors"
    },
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

/* ================= APPOINTMENT SERVICE ================= */
router.use(
  "/appointments",
  protect,
  createProxyMiddleware({
    target: process.env.APPOINTMENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/appointments": "/api/appointments"
    },
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

/* ================= PAYMENT SERVICE ================= */
router.use(
  "/payments",
  protect,
  createProxyMiddleware({
    target: process.env.PAYMENT_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/payments": "/api/payments"
    },
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

/* ================= NOTIFICATION SERVICE ================= */
router.use(
  "/notifications",
  protect,
  authorizeRoles("admin"),
  createProxyMiddleware({
    target: process.env.NOTIFICATION_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/notifications": "/api/notifications"
    },
    on: {
      proxyReq: (proxyReq, req) => {
        fixRequestBody(proxyReq, req);
      },
      error: (err, req, res) => {
        console.error("Notification proxy error:", err.message);
        res.status(500).json({ message: "Gateway proxy error - Notification Service" });
      }
    }
  })
);

/* ================= TELEMEDICINE SERVICE ================= */
router.use(
  "/telemedicine",
  protect,
  createProxyMiddleware({
    target: process.env.TELEMEDICINE_SERVICE_URL,
    changeOrigin: true,
    pathRewrite: {
      "^/telemedicine": "/api/telemedicine"
    },
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