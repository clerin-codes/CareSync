require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const appointmentRoutes = require("./routes/appointmentRoutes");

connectDB();

require("./models/User");

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/appointments/health", (req, res) => {
  res.json({ message: "Appointment Service is running" });
});

app.use("/api/appointments", appointmentRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5003;
app.listen(PORT, () => {
  console.log(`[Appointment Service] running on port ${PORT}`);
});
