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
      profilePhoto: req.body.profilePhoto || "",
      phone: req.body.phone || "",
      age: req.body.age ?? null,
      gender: req.body.gender || "",
      address: req.body.address || "",
      bloodGroup: req.body.bloodGroup || "",
      emergencyContact: {
        name: req.body.emergencyContact?.name || "",
        relationship: req.body.emergencyContact?.relationship || "",
        phone: req.body.emergencyContact?.phone || ""
      },
      medicalHistory: {
        allergies: req.body.medicalHistory?.allergies || [],
        chronicDiseases: req.body.medicalHistory?.chronicDiseases || [],
        medications: req.body.medicalHistory?.medications || [],
        surgeries: req.body.medicalHistory?.surgeries || [],
        notes: req.body.medicalHistory?.notes || ""
      },
      status: "active"
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

    patient.profilePhoto = req.body.profilePhoto ?? patient.profilePhoto;
    patient.phone = req.body.phone ?? patient.phone;
    patient.age = req.body.age ?? patient.age;
    patient.gender = req.body.gender ?? patient.gender;
    patient.address = req.body.address ?? patient.address;
    patient.bloodGroup = req.body.bloodGroup ?? patient.bloodGroup;

    if (req.body.emergencyContact) {
      if (
        !patient.emergencyContact ||
        typeof patient.emergencyContact === "string"
      ) {
        patient.emergencyContact = {
          name: "",
          relationship: "",
          phone:
            typeof patient.emergencyContact === "string"
              ? patient.emergencyContact
              : ""
        };
      }

      patient.emergencyContact.name =
        req.body.emergencyContact.name ?? patient.emergencyContact.name;

      patient.emergencyContact.relationship =
        req.body.emergencyContact.relationship ??
        patient.emergencyContact.relationship;

      patient.emergencyContact.phone =
        req.body.emergencyContact.phone ?? patient.emergencyContact.phone;
    }

    if (req.body.medicalHistory) {
      patient.medicalHistory = patient.medicalHistory || {
        allergies: [],
        chronicDiseases: [],
        medications: [],
        surgeries: [],
        notes: ""
      };

      patient.medicalHistory.allergies =
        req.body.medicalHistory.allergies ?? patient.medicalHistory.allergies;

      patient.medicalHistory.chronicDiseases =
        req.body.medicalHistory.chronicDiseases ??
        patient.medicalHistory.chronicDiseases;

      patient.medicalHistory.medications =
        req.body.medicalHistory.medications ??
        patient.medicalHistory.medications;

      patient.medicalHistory.surgeries =
        req.body.medicalHistory.surgeries ?? patient.medicalHistory.surgeries;

      patient.medicalHistory.notes =
        req.body.medicalHistory.notes ?? patient.medicalHistory.notes;
    }

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

const updatePatientStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = ["active", "inactive", "blocked"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status value"
      });
    }

    const patient = await Patient.findById(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    patient.status = status;
    await patient.save();

    res.status(200).json({
      message: "Patient status updated successfully",
      patient
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update patient status",
      error: error.message
    });
  }
};

module.exports = {
  getMyProfile,
  createMyProfile,
  updateMyProfile,
  getAllPatients,
  updatePatientStatus
};