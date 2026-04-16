require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const paymentRoutes = require("./routes/paymentRoutes");

connectDB();

require("./models/User");
require("./models/Appointment");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/payments/health", (req, res) => {
  res.json({ message: "Payment Service is running" });
});

app.use("/api/payments", paymentRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5004;
app.listen(PORT, () => {
  console.log(`[Payment Service] running on port ${PORT}`);
});
