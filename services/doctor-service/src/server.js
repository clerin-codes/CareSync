require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const doctorRoutes = require("./routes/doctorRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/doctors/health", (req, res) => {
  res.json({ message: "Doctor Service is running" });
});

app.use("/api/doctors", doctorRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
  console.log(`[Doctor Service] running on port ${PORT}`);
});
