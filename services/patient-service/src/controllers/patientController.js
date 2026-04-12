const Patient = require("../models/Patient");
const generatePatientId = require("../utils/generatePatientId");
const calculateProfileStrength = require("../utils/calculateProfileStrength");
const uploadDocumentToCloudinary = require("../services/uploadDocumentToCloudinary");
const cloudinary = require("../config/cloudinary");

const getMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      userId: req.user.id,
      isDeleted: false,
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    return res.status(200).json(patient);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};

const createMyProfile = async (req, res) => {
  try {
    const existingProfile = await Patient.findOne({
      userId: req.user.id,
      isDeleted: false,
    });

    if (existingProfile) {
      return res.status(400).json({ message: "Profile already exists" });
    }

    const patientId = await generatePatientId();

    const patientData = {
      userId: req.user.id,
      patientId,
      fullName: req.user.fullName,
      email: req.user.email,
      avatarUrl: req.body.avatarUrl || "",
      phone: req.body.phone || "",
      dob: req.body.dob || null,
      gender: req.body.gender || "",
      nic: req.body.nic || "",
      address: {
        district: req.body.address?.district || "",
        city: req.body.address?.city || "",
        line1: req.body.address?.line1 || "",
      },
      bloodGroup: req.body.bloodGroup || "",
      emergencyContact: {
        name: req.body.emergencyContact?.name || "",
        relationship: req.body.emergencyContact?.relationship || "",
        phone: req.body.emergencyContact?.phone || "",
      },
      medicalHistory: {
        allergies: req.body.medicalHistory?.allergies || [],
        chronicDiseases: req.body.medicalHistory?.chronicDiseases || [],
        medications: req.body.medicalHistory?.medications || [],
        surgeries: req.body.medicalHistory?.surgeries || [],
        notes: req.body.medicalHistory?.notes || "",
      },
      heightCm: req.body.heightCm ?? null,
      weightKg: req.body.weightKg ?? null,
      status: "active",
    };

    patientData.profileStrength = calculateProfileStrength(patientData);

    const patient = await Patient.create(patientData);

    return res.status(201).json({
      message: "Patient profile created successfully",
      patient,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create profile",
      error: error.message,
    });
  }
};

const updateMyProfile = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      userId: req.user.id,
      isDeleted: false,
    });

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

    if (req.body.address) {
      patient.address = {
        district: req.body.address.district ?? patient.address?.district ?? "",
        city: req.body.address.city ?? patient.address?.city ?? "",
        line1: req.body.address.line1 ?? patient.address?.line1 ?? "",
      };
    }

    if (req.body.emergencyContact) {
      patient.emergencyContact = {
        name: req.body.emergencyContact.name ?? patient.emergencyContact?.name ?? "",
        relationship:
          req.body.emergencyContact.relationship ??
          patient.emergencyContact?.relationship ??
          "",
        phone: req.body.emergencyContact.phone ?? patient.emergencyContact?.phone ?? "",
      };
    }

    if (req.body.medicalHistory) {
      patient.medicalHistory = {
        allergies:
          req.body.medicalHistory.allergies ??
          patient.medicalHistory?.allergies ??
          [],
        chronicDiseases:
          req.body.medicalHistory.chronicDiseases ??
          patient.medicalHistory?.chronicDiseases ??
          [],
        medications:
          req.body.medicalHistory.medications ??
          patient.medicalHistory?.medications ??
          [],
        surgeries:
          req.body.medicalHistory.surgeries ??
          patient.medicalHistory?.surgeries ??
          [],
        notes:
          req.body.medicalHistory.notes ??
          patient.medicalHistory?.notes ??
          "",
      };
    }

    patient.profileStrength = calculateProfileStrength(patient);

    const updatedPatient = await patient.save();

    return res.status(200).json({
      message: "Patient profile updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

const getAllPatients = async (req, res) => {
  try {
    const {
      search = "",
      status,
      bloodGroup,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      order = "desc",
    } = req.query;

    const query = { isDeleted: false };

    if (status) {
      query.status = status;
    }

    if (bloodGroup) {
      query.bloodGroup = bloodGroup;
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { patientId: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
      ];
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const sortOrder = order === "asc" ? 1 : -1;

    const patients = await Patient.find(query)
      .sort({ [sortBy]: sortOrder })
      .skip(skip)
      .limit(limitNumber);

    const total = await Patient.countDocuments(query);

    return res.status(200).json({
      message: "Patients fetched successfully",
      pagination: {
        total,
        page: pageNumber,
        limit: limitNumber,
        totalPages: Math.ceil(total / limitNumber),
      },
      filters: {
        search,
        status: status || null,
        bloodGroup: bloodGroup || null,
        sortBy,
        order,
      },
      patients,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch patients",
      error: error.message,
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
        message: "Invalid status value",
      });
    }

    const patient = await Patient.findById(id);

    if (!patient || patient.isDeleted) {
      return res.status(404).json({ message: "Patient not found" });
    }

    patient.status = status;
    await patient.save();

    return res.status(200).json({
      message: "Patient status updated successfully",
      patient,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to update patient status",
      error: error.message,
    });
  }
};

const uploadMyDocument = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      userId: req.user.id,
      isDeleted: false,
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Document file is required" });
    }

    const { title, fileType } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Document title is required" });
    }

    const allowedTypes = ["report", "prescription", "scan", "insurance", "other"];
    const safeFileType = allowedTypes.includes(fileType) ? fileType : "other";

    const uploadResult = await uploadDocumentToCloudinary(
      req.file.buffer,
      "patients/documents",
      "auto"
    );

    const newDocument = {
      title,
      fileUrl: uploadResult.secure_url,
      fileType: safeFileType,
      publicId: uploadResult.public_id,
      resourceType: uploadResult.resource_type || "raw",
      uploadedAt: new Date(),
    };

    patient.documents.push(newDocument);
    await patient.save();

    return res.status(201).json({
      message: "Document uploaded successfully",
      document: patient.documents[patient.documents.length - 1],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to upload document",
      error: error.message,
    });
  }
};

const getMyDocuments = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      userId: req.user.id,
      isDeleted: false,
    }).select("documents patientId fullName");

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    return res.status(200).json({
      patientId: patient.patientId,
      fullName: patient.fullName,
      count: patient.documents.length,
      documents: patient.documents.sort(
        (a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt)
      ),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch documents",
      error: error.message,
    });
  }
};

const getMyDashboard = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      userId: req.user.id,
      isDeleted: false,
    }).select(
      "patientId fullName email phone profileStrength bloodGroup emergencyContact status documents avatarUrl"
    );

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    const hasEmergencyContact = Boolean(
      patient.emergencyContact &&
        (
          patient.emergencyContact.name ||
          patient.emergencyContact.relationship ||
          patient.emergencyContact.phone
        )
    );

    return res.status(200).json({
      message: "Patient dashboard fetched successfully",
      dashboard: {
        patientId: patient.patientId,
        fullName: patient.fullName,
        email: patient.email,
        phone: patient.phone,
        avatarUrl: patient.avatarUrl,
        profileStrength: patient.profileStrength,
        bloodGroup: patient.bloodGroup,
        documentsCount: patient.documents?.length || 0,
        hasEmergencyContact,
        status: patient.status,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch dashboard",
      error: error.message,
    });
  }
};

const deleteMyDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const patient = await Patient.findOne({
      userId: req.user.id,
      isDeleted: false,
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    const document = patient.documents.id(documentId);

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    if (document.publicId) {
      await cloudinary.uploader.destroy(document.publicId, {
        resource_type: document.resourceType || "raw",
      });
    }

    patient.documents.pull(documentId);
    await patient.save();

    return res.status(200).json({
      message: "Document deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to delete document",
      error: error.message,
    });
  }
};

module.exports = {
  getMyProfile,
  createMyProfile,
  updateMyProfile,
  getAllPatients,
  updatePatientStatus,
  uploadMyDocument,
  getMyDocuments,
  getMyDashboard,
  deleteMyDocument,
};