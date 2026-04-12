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
      patientId: `PAT-${Date.now()}`,

      fullName: req.user.name,
      email: req.user.email,

      avatarUrl: req.body.avatarUrl || "",
      phone: req.body.phone || "",

      dob: req.body.dob || null,
      gender: req.body.gender || "",

      nic: req.body.nic || "",

      address: {
        district: req.body.address?.district || "",
        city: req.body.address?.city || "",
        line1: req.body.address?.line1 || ""
      },

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

      heightCm: req.body.heightCm ?? null,
      weightKg: req.body.weightKg ?? null,

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

    patient.avatarUrl = req.body.avatarUrl ?? patient.avatarUrl;
    patient.phone = req.body.phone ?? patient.phone;
    patient.dob = req.body.dob ?? patient.dob;
    patient.gender = req.body.gender ?? patient.gender;
    patient.nic = req.body.nic ?? patient.nic;
    patient.bloodGroup = req.body.bloodGroup ?? patient.bloodGroup;
    patient.heightCm = req.body.heightCm ?? patient.heightCm;
    patient.weightKg = req.body.weightKg ?? patient.weightKg;

    // address update
    if (req.body.address) {
      patient.address = {
        district: req.body.address.district ?? patient.address.district,
        city: req.body.address.city ?? patient.address.city,
        line1: req.body.address.line1 ?? patient.address.line1
      };
    }

    // emergency contact
    if (req.body.emergencyContact) {
      patient.emergencyContact = {
        name: req.body.emergencyContact.name ?? patient.emergencyContact.name,
        relationship:
          req.body.emergencyContact.relationship ??
          patient.emergencyContact.relationship,
        phone:
          req.body.emergencyContact.phone ??
          patient.emergencyContact.phone
      };
    }

    // medical history
    if (req.body.medicalHistory) {
      patient.medicalHistory = {
        allergies:
          req.body.medicalHistory.allergies ??
          patient.medicalHistory.allergies,
        chronicDiseases:
          req.body.medicalHistory.chronicDiseases ??
          patient.medicalHistory.chronicDiseases,
        medications:
          req.body.medicalHistory.medications ??
          patient.medicalHistory.medications,
        surgeries:
          req.body.medicalHistory.surgeries ??
          patient.medicalHistory.surgeries,
        notes:
          req.body.medicalHistory.notes ??
          patient.medicalHistory.notes
      };
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