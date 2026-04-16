const Patient = require("../models/Patient");

const generatePatientId = async () => {
  const year = new Date().getFullYear();

  const lastPatient = await Patient.findOne({
    patientId: { $regex: `^PAT-${year}-` },
  }).sort({ createdAt: -1 });

  let nextNumber = 1;

  if (lastPatient && lastPatient.patientId) {
    const parts = lastPatient.patientId.split("-");
    const lastNumber = parseInt(parts[2], 10);

    if (!isNaN(lastNumber)) {
      nextNumber = lastNumber + 1;
    }
  }

  return `PAT-${year}-${String(nextNumber).padStart(4, "0")}`;
};

module.exports = generatePatientId;