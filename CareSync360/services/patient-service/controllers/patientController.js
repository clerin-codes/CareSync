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

const uploadMyAvatar = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      userId: req.user.id,
      isDeleted: false,
    });

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "Profile image is required" });
    }

    const uploadResult = await uploadDocumentToCloudinary(
      req.file.buffer,
      "patients/avatars",
      "image"
    );

    patient.avatarUrl = uploadResult.secure_url;
    await patient.save();

    return res.status(200).json({
      message: "Profile image uploaded successfully",
      avatarUrl: patient.avatarUrl,
      patient,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to upload profile image",
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

const getMyReports = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      userId: req.user.id,
      isDeleted: false,
    }).select("documents patientId fullName");

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    const reports = patient.documents
      .filter((doc) => doc.fileType === "report")
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    return res.status(200).json(reports);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch reports",
      error: error.message,
    });
  }
};

const getReportsByPatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await Patient.findOne({
      patientId: id,
      isDeleted: false,
    }).select("documents patientId fullName");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    const reports = patient.documents
      .filter((doc) => doc.fileType === "report")
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

    return res.status(200).json(reports);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch patient reports",
      error: error.message,
    });
  }
};

const downloadReport = async (req, res) => {
  try {
    const { reportId } = req.params;

    const patient = await Patient.findOne({
      "documents._id": reportId,
      isDeleted: false,
    }).select("documents");

    if (!patient) {
      return res.status(404).json({ message: "Report not found" });
    }

    const document = patient.documents.id(reportId);
    if (!document) {
      return res.status(404).json({ message: "Report not found" });
    }

    return res.redirect(document.fileUrl);
  } catch (error) {
    return res.status(500).json({
      message: "Failed to download report",
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

//get all medical history of patient
const getAllMedicalHistory = async (req, res) => {
  try {
    const patient = await Patient.findOne({
      userId: req.user.id,
      isDeleted: false,
    }).select("medicalHistory");

    if (!patient) {
      return res.status(404).json({ message: "Patient profile not found" });
    }

    return res.status(200).json({
      medicalHistory: patient.medicalHistory || [],
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch medical history",
      error: error.message,
    });
  }
};

//get all doctors in the system - for directory
const getAllDoctors = async (req, res) => {
  try {
    const doctors = await Doctor.find({ isDeleted: false }).select(
      "fullName email phone specialization hospitalName profilePicture"
    ); 
    
    return res.status(200).json({
      message: "Doctors fetched successfully",
      doctors,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch doctors",
      error: error.message,
    });
  }
};

//get all hospitals in the system - for directory
const getAllHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isDeleted: false }).select(
      "name address phone email profilePicture"
    );
    return res.status(200).json({
      message: "Hospitals fetched successfully",
      hospitals,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch hospitals", 
      error: error.message,
    });
  }
};

//get all appointments of the patient - for dashboard and appointments page
const getMyAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.find({
      patientId: req.user.id,
      isDeleted: false,
    })
      .populate("doctorId", "fullName specialization profilePicture")
      .populate("hospitalId", "name address profilePicture")
      .sort({ date: -1 });

    return res.status(200).json({
      message: "Appointments fetched successfully",
      appointments,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch appointments",
      error: error.message,
    });
  }
};

//ai explain medical text
const aiExplainMedicalText = async (req, res) => {
  try {
    const { text, language } = req.body;
    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Text is required for explanation" });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ success: false, message: "Gemini API key not configured" });
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // gemini-2.0-flash-lite has a separate (more generous) free-tier quota bucket
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    // Default language = English
    const selectedLanguage = language || "english";

    const result = await model.generateContent(
      `Explain this medical information in simple language for a patient.

      Language: ${selectedLanguage}

      Do NOT use markdown formatting.
      Do NOT use headings.
      Do NOT use bold text.
      Do NOT give medical advice.
      Do NOT change dosage.
      Only explain meaning clearly.

      ${text}`,
    );

    return res.status(200).json({
      message: "Medical text explained successfully",
      explanation: "This is a placeholder explanation. In a real implementation, this would be replaced with the actual AI-generated explanation.",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to explain medical text",
      error: error.message,
    });
  }
};

//create emergency sos request
const createEmergencyRequest = async (req, res) => {
  try {
    const { location, description } = req.body;
    if (!location || !description) {
      return res.status(400).json({ message: "Location and description are required" });
    }

    // Implementation for creating emergency request would go here
    return res.status(201).json({
      message: "Emergency request created successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to create emergency request",
      error: error.message,
    });
  }
};


module.exports = {
  getMyProfile,
  createMyProfile,
  updateMyProfile,
  uploadMyAvatar,
  getAllPatients,
  updatePatientStatus,
  uploadMyDocument,
  getMyDocuments,
  getAllMedicalHistory,
  getMyDashboard,
  deleteMyDocument,
  getMyReports,
  getReportsByPatient,
  downloadReport,
  getAllDoctors,
  getAllHospitals,
  getMyAppointments,
  aiExplainMedicalText,
  createEmergencyRequest,
};