const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const morgan = require("morgan");
const connectDB = require("./config/db");
const patientRoutes = require("./routes/patientRoutes");

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.get("/api/patients/health", (req, res) => {
  res.json({ message: "Patient Service is running" });
});

app.use("/api/patients", patientRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log(`[Patient Service] running on port ${PORT}`);
});