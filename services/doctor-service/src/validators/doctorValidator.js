const { body, param } = require("express-validator");

const createProfileRules = [
  body("fullName").trim().notEmpty().withMessage("Full name is required").isLength({ min: 3, max: 100 }).withMessage("Full name must be 3-100 characters"),
  body("specialization").trim().notEmpty().withMessage("Specialization is required").isLength({ max: 100 }),
  body("licenseNumber").optional().trim().isLength({ max: 50 }),
  body("phone").optional().trim().matches(/^(?:\+94|0)?\d{9,10}$/).withMessage("Invalid phone number format"),
  body("consultationFee").optional().isFloat({ min: 0 }).withMessage("Consultation fee must be non-negative"),
  body("experience").optional().isInt({ min: 0, max: 60 }).withMessage("Experience must be 0-60 years"),
  body("qualifications").optional().isArray().withMessage("Qualifications must be an array"),
  body("bio").optional().trim().isLength({ max: 1000 }),
];

const updateProfileRules = [
  body("fullName").optional().trim().isLength({ min: 3, max: 100 }),
  body("specialization").optional().trim().isLength({ max: 100 }),
  body("licenseNumber").optional().trim().isLength({ max: 50 }),
  body("phone").optional().trim().matches(/^(?:\+94|0)?\d{9,10}$/),
  body("consultationFee").optional().isFloat({ min: 0 }),
  body("experience").optional().isInt({ min: 0, max: 60 }),
  body("qualifications").optional().isArray(),
  body("bio").optional().trim().isLength({ max: 1000 }),
];

const addSlotsRules = [
  body("slots").isArray({ min: 1 }).withMessage("slots must be a non-empty array"),
  body("slots.*.date").notEmpty().matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("Slot date must be YYYY-MM-DD"),
  body("slots.*.startTime").notEmpty().matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage("startTime must be HH:mm"),
  body("slots.*.endTime").notEmpty().matches(/^([01]\d|2[0-3]):[0-5]\d$/).withMessage("endTime must be HH:mm"),
  body("slots").custom((slots) => {
    for (let i = 0; i < slots.length; i++) {
      if (slots[i].startTime && slots[i].endTime && slots[i].startTime >= slots[i].endTime) {
        throw new Error(`Slot ${i + 1}: endTime must be after startTime`);
      }
    }
    return true;
  }),
];

const mongoIdParam = (paramName = "id") => [
  param(paramName).isMongoId().withMessage(`Invalid ${paramName} format`),
];

module.exports = {
  createProfileRules,
  updateProfileRules,
  addSlotsRules,
  mongoIdParam,
};
