const Patient = require("../models/Patient");

const getMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    res.status(200).json(patient);
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message
    });
  }
};

const createMyProfile = async (req, res) => {
  try {
    const existingProfile = await Patient.findOne({ userId: req.user.id });

    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const patient = await Patient.create({
      userId: req.user.id,
      name: req.user.name,
      email: req.user.email,
      phone: req.body.phone || "",
      age: req.body.age || null,
      gender: req.body.gender || "",
      address: req.body.address || "",
      bloodGroup: req.body.bloodGroup || "",
      emergencyContact: req.body.emergencyContact || "",
      medicalHistory: req.body.medicalHistory || ""
    });

    res.status(201).json({
      message: "Patient profile created successfully",
      patient
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create profile",
      error: error.message
    });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user.id });

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    patient.phone = req.body.phone ?? patient.phone;
    patient.age = req.body.age ?? patient.age;
    patient.gender = req.body.gender ?? patient.gender;
    patient.address = req.body.address ?? patient.address;
    patient.bloodGroup = req.body.bloodGroup ?? patient.bloodGroup;
    patient.emergencyContact =
      req.body.emergencyContact ?? patient.emergencyContact;
    patient.medicalHistory = req.body.medicalHistory ?? patient.medicalHistory;

    const updatedPatient = await patient.save();

    res.status(200).json({
      message: "Patient profile updated successfully",
      patient: updatedPatient
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update profile",
      error: error.message
    });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().sort({ createdAt: -1 });

    res.status(200).json({
      count: patients.length,
      patients
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch patients",
      error: error.message
    });
  }
};

module.exports = {
  getMyProfile,
  createMyProfile,
  updateMyProfile,
  getAllPatients
};