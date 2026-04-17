const axios = require("axios");

const API_BASE = "http://localhost:4000";
const SHARED_PASSWORD = "Test@123";

const admin = {
  name: "Admin User",
  email: "admin@caresync.lk",
  password: SHARED_PASSWORD
};

const doctors = [
  {
    name: "Dr. Kavinda Perera",
    email: "kavinda.perera@caresync.lk",
    specialization: "Cardiology",
    experience: 12,
    hospital: "Lanka Hospitals, Colombo",
    consultationFee: 5500,
    availability: [
      { day: "Monday", slots: ["09:00 AM", "10:00 AM", "11:00 AM"] },
      { day: "Wednesday", slots: ["02:00 PM", "03:00 PM", "04:00 PM"] }
    ]
  },
  {
    name: "Dr. Nishantha Fernando",
    email: "nishantha.fernando@caresync.lk",
    specialization: "Dermatology",
    experience: 9,
    hospital: "Nawaloka Hospital, Colombo",
    consultationFee: 3500,
    availability: [
      { day: "Tuesday", slots: ["10:00 AM", "11:00 AM"] },
      { day: "Thursday", slots: ["03:00 PM", "04:00 PM", "05:00 PM"] }
    ]
  },
  {
    name: "Dr. Dilini Jayawardena",
    email: "dilini.jayawardena@caresync.lk",
    specialization: "Pediatrics",
    experience: 14,
    hospital: "Asiri Central Hospital, Colombo",
    consultationFee: 4000,
    availability: [
      { day: "Monday", slots: ["08:00 AM", "09:00 AM"] },
      { day: "Friday", slots: ["01:00 PM", "02:00 PM", "03:00 PM"] }
    ]
  },
  {
    name: "Dr. Arun Thevarajah",
    email: "arun.thevarajah@caresync.lk",
    specialization: "Orthopedics",
    experience: 11,
    hospital: "Jaffna Teaching Hospital",
    consultationFee: 6000,
    availability: [
      { day: "Wednesday", slots: ["10:00 AM", "11:00 AM"] },
      { day: "Saturday", slots: ["09:00 AM", "10:00 AM"] }
    ]
  },
  {
    name: "Dr. Priya Selvarasa",
    email: "priya.selvarasa@caresync.lk",
    specialization: "Neurology",
    experience: 18,
    hospital: "Batticaloa Teaching Hospital",
    consultationFee: 7500,
    availability: [
      { day: "Tuesday", slots: ["02:00 PM", "03:00 PM"] },
      { day: "Thursday", slots: ["11:00 AM", "12:00 PM"] }
    ]
  }
];

const patients = [
  { name: "Ashan Bandara", email: "ashan.bandara@gmail.com" },
  { name: "Sachini Wijesinghe", email: "sachini.wijesinghe@gmail.com" },
  { name: "Nuwan Rajapaksha", email: "nuwan.rajapaksha@gmail.com" },
  { name: "Kavitha Ramanathan", email: "kavitha.ramanathan@gmail.com" },
  { name: "Karthik Sivakumar", email: "karthik.sivakumar@gmail.com" }
];

const isDuplicate = (error) =>
  error.response?.status === 400 &&
  (error.response?.data?.message || "").toLowerCase().includes("already");

async function ensureAdmin() {
  console.log("\n-- Admin --");
  try {
    await axios.post(`${API_BASE}/auth/create-admin`, admin);
    console.log(`Created admin: ${admin.email}`);
  } catch (error) {
    if (isDuplicate(error)) {
      console.log(`Admin already exists: ${admin.email}`);
    } else {
      throw error;
    }
  }

  const { data } = await axios.post(`${API_BASE}/auth/login`, {
    email: admin.email,
    password: admin.password
  });
  return data.token;
}

async function seedDoctors(adminToken) {
  console.log("\n-- Doctors --");
  const headers = { Authorization: `Bearer ${adminToken}` };

  for (const doctor of doctors) {
    try {
      const accountRes = await axios.post(
        `${API_BASE}/auth/create-doctor`,
        { name: doctor.name, email: doctor.email, password: SHARED_PASSWORD },
        { headers }
      );

      await axios.post(
        `${API_BASE}/doctors`,
        {
          userId: accountRes.data.user.id,
          name: doctor.name,
          email: doctor.email,
          specialization: doctor.specialization,
          experience: doctor.experience,
          hospital: doctor.hospital,
          consultationFee: doctor.consultationFee,
          availability: doctor.availability
        },
        { headers }
      );

      console.log(`Created: ${doctor.name} (${doctor.specialization})`);
    } catch (error) {
      if (isDuplicate(error)) {
        console.log(`Skipped (exists): ${doctor.name}`);
      } else {
        console.error(
          `Failed: ${doctor.name} — ${error.response?.data?.message || error.message}`
        );
      }
    }
  }
}

async function seedPatients() {
  console.log("\n-- Patients --");
  for (const patient of patients) {
    try {
      await axios.post(`${API_BASE}/auth/register`, {
        name: patient.name,
        email: patient.email,
        password: SHARED_PASSWORD
      });
      console.log(`Registered: ${patient.name}`);
    } catch (error) {
      if (isDuplicate(error)) {
        console.log(`Skipped (exists): ${patient.name}`);
      } else {
        console.error(
          `Failed: ${patient.name} — ${error.response?.data?.message || error.message}`
        );
      }
    }
  }
}

async function printSummary() {
  console.log("\n============================================");
  console.log("  CareSync — Test Credentials");
  console.log(`  Password for ALL accounts: ${SHARED_PASSWORD}`);
  console.log("============================================\n");

  console.log("--- ADMIN ---");
  console.log(`  ${admin.email}\n`);

  console.log("--- DOCTORS ---");
  doctors.forEach((d, i) => console.log(`  ${i + 1}. ${d.name.padEnd(30)} ${d.email}`));

  console.log("\n--- PATIENTS ---");
  patients.forEach((p, i) => console.log(`  ${i + 1}. ${p.name.padEnd(30)} ${p.email}`));

  try {
    const { data } = await axios.get(`${API_BASE}/doctors`);
    console.log(`\nDoctors currently in DB: ${data.length}`);
  } catch {
    // ignore summary-only errors
  }
}

(async () => {
  try {
    const adminToken = await ensureAdmin();
    await seedDoctors(adminToken);
    await seedPatients();
    await printSummary();
    console.log("\nSeeding completed.");
  } catch (error) {
    console.error("\nSeeding failed:", error.response?.data || error.message);
    process.exit(1);
  }
})();
