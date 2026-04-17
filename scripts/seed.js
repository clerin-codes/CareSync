require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/caresync";
const PASSWORD = "Test@123";

const userSchema = new mongoose.Schema({
  role: { type: String, enum: ["patient", "doctor", "responder", "admin"], required: true },
  fullName: { type: String, trim: true, required: true },
  email: { type: String, lowercase: true, trim: true, unique: true, sparse: true },
  phone: { type: String, trim: true, unique: true, sparse: true },
  passwordHash: { type: String, required: true },
  isVerified: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  status: { type: String, enum: ["ACTIVE", "PENDING", "REJECTED", "SUSPENDED"], default: "ACTIVE" },
  refreshTokenHash: { type: String, default: null },
  lastLoginAt: { type: Date, default: null },
  passwordResetToken: { type: String, default: null },
  passwordResetExpires: { type: Date, default: null },
  passwordChangedAt: { type: Date, default: null },
}, { timestamps: true });

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  patientId: { type: String, required: true, unique: true, trim: true },
  fullName: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  phone: { type: String, default: "" },
  dob: { type: Date, default: null },
  gender: { type: String, enum: ["male", "female", "other", ""], default: "" },
  nic: { type: String, default: "" },
  address: {
    district: { type: String, default: "" },
    city: { type: String, default: "" },
    line1: { type: String, default: "" },
  },
  bloodGroup: { type: String, enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", ""], default: "" },
  emergencyContact: {
    name: { type: String, default: "" },
    relationship: { type: String, default: "" },
    phone: { type: String, default: "" },
  },
  medicalHistory: {
    allergies: [String],
    chronicDiseases: [String],
    medications: [String],
    surgeries: [String],
    notes: { type: String, default: "" },
  },
  heightCm: { type: Number, default: null },
  weightKg: { type: Number, default: null },
  profileStrength: { type: Number, default: 0 },
  avatarUrl: { type: String, default: "" },
  documents: [],
  status: { type: String, enum: ["active", "inactive", "blocked"], default: "active" },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
const Patient = mongoose.models.Patient || mongoose.model("Patient", patientSchema);

const doctors = [
  { fullName: "Kavinda Perera", email: "kavinda.perera@caresync.lk", phone: "0771234501" },
  { fullName: "Nishantha Fernando", email: "nishantha.fernando@caresync.lk", phone: "0771234502" },
  { fullName: "Dilini Jayawardena", email: "dilini.jayawardena@caresync.lk", phone: "0771234503" },
  { fullName: "Ruwan Dissanayake", email: "ruwan.dissanayake@caresync.lk", phone: "0771234504" },
  { fullName: "Tharushi De Silva", email: "tharushi.desilva@caresync.lk", phone: "0771234505" },
];

const patients = [
  { fullName: "Ashan Bandara", email: "ashan.bandara@gmail.com", phone: "0769876501", dob: "1995-03-15", gender: "male", bloodGroup: "O+", district: "Colombo", city: "Dehiwala" },
  { fullName: "Sachini Wijesinghe", email: "sachini.wijesinghe@gmail.com", phone: "0769876502", dob: "1998-07-22", gender: "female", bloodGroup: "A+", district: "Kandy", city: "Peradeniya" },
  { fullName: "Nuwan Rajapaksha", email: "nuwan.rajapaksha@gmail.com", phone: "0769876503", dob: "1992-11-08", gender: "male", bloodGroup: "B+", district: "Galle", city: "Unawatuna" },
  { fullName: "Malsha Gunathilaka", email: "malsha.gunathilaka@gmail.com", phone: "0769876504", dob: "2000-01-30", gender: "female", bloodGroup: "AB+", district: "Matara", city: "Matara" },
  { fullName: "Isuru Senanayake", email: "isuru.senanayake@gmail.com", phone: "0769876505", dob: "1997-05-12", gender: "male", bloodGroup: "O-", district: "Kurunegala", city: "Kurunegala" },
];

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    const passwordHash = await bcrypt.hash(PASSWORD, 10);

    console.log("\n--- Seeding Doctors ---");
    for (const doc of doctors) {
      const existing = await User.findOne({ email: doc.email });
      if (existing) {
        console.log(`  [skip] ${doc.fullName} (${doc.email}) already exists`);
        continue;
      }
      const user = await User.create({
        fullName: doc.fullName,
        email: doc.email,
        phone: doc.phone,
        passwordHash,
        role: "doctor",
        isVerified: true,
        isActive: true,
        status: "ACTIVE",
      });
      console.log(`  [created] Dr. ${doc.fullName} — ${doc.email}`);
    }

    console.log("\n--- Seeding Patients ---");
    for (let i = 0; i < patients.length; i++) {
      const pat = patients[i];
      const existing = await User.findOne({ email: pat.email });
      if (existing) {
        console.log(`  [skip] ${pat.fullName} (${pat.email}) already exists`);
        continue;
      }
      const user = await User.create({
        fullName: pat.fullName,
        email: pat.email,
        phone: pat.phone,
        passwordHash,
        role: "patient",
        isVerified: true,
        isActive: true,
        status: "ACTIVE",
      });

      const patientId = `PAT-2026-${String(i + 1).padStart(4, "0")}`;
      await Patient.create({
        userId: user._id,
        patientId,
        fullName: pat.fullName,
        email: pat.email,
        phone: pat.phone,
        dob: new Date(pat.dob),
        gender: pat.gender,
        bloodGroup: pat.bloodGroup,
        address: { district: pat.district, city: pat.city, line1: "" },
        profileStrength: 60,
      });

      console.log(`  [created] ${pat.fullName} — ${pat.email} (${patientId})`);
    }

    console.log("\n--- Seeding Admin ---");
    const adminEmail = "admin@caresync.lk";
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log(`  [skip] Admin (${adminEmail}) already exists`);
    } else {
      await User.create({
        fullName: "Admin User",
        email: adminEmail,
        passwordHash,
        role: "admin",
        isVerified: true,
        isActive: true,
        status: "ACTIVE",
      });
      console.log(`  [created] Admin — ${adminEmail}`);
    }

    console.log("\nSeeding complete!");
  } catch (error) {
    console.error("Seeding failed:", error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seed();
