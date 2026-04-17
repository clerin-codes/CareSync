const calculateProfileStrength = (patient) => {
  let score = 0;

  if (patient.fullName) score += 10;
  if (patient.email) score += 10;
  if (patient.phone) score += 10;
  if (patient.dob) score += 10;
  if (patient.gender) score += 10;
  if (
    patient.address &&
    (patient.address.district || patient.address.city || patient.address.line1)
  ) {
    score += 10;
  }
  if (patient.bloodGroup) score += 10;
  if (
    patient.emergencyContact &&
    (patient.emergencyContact.name ||
      patient.emergencyContact.relationship ||
      patient.emergencyContact.phone)
  ) {
    score += 10;
  }
  if (
    patient.medicalHistory &&
    (
      patient.medicalHistory.allergies?.length ||
      patient.medicalHistory.chronicDiseases?.length ||
      patient.medicalHistory.medications?.length ||
      patient.medicalHistory.surgeries?.length ||
      patient.medicalHistory.notes
    )
  ) {
    score += 10;
  }
  if (patient.heightCm && patient.weightKg) score += 10;

  return score;
};

module.exports = calculateProfileStrength;