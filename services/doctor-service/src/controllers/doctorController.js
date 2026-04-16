const doctorService = require("../services/doctorService");

const createProfile = async (req, res, next) => {
  try {
    const doctor = await doctorService.createDoctorProfile({ userId: req.user.id, ...req.body });
    res.status(201).json({ success: true, data: doctor });
  } catch (error) { next(error); }
};

const getProfile = async (req, res, next) => {
  try {
    const doctor = await doctorService.getDoctorProfile(req.user.id);
    res.json({ success: true, data: doctor });
  } catch (error) { next(error); }
};

const updateProfile = async (req, res, next) => {
  try {
    const doctor = await doctorService.updateDoctorProfile(req.user.id, req.body);
    res.json({ success: true, data: doctor });
  } catch (error) { next(error); }
};

const getDashboard = async (req, res, next) => {
  try {
    const data = await doctorService.getDashboardStats(req.user.id);
    res.json({ success: true, data });
  } catch (error) { next(error); }
};

const getAvailability = async (req, res, next) => {
  try {
    const slots = await doctorService.getAvailability(req.user.id);
    res.json({ success: true, data: { slots } });
  } catch (error) { next(error); }
};

const addSlots = async (req, res, next) => {
  try {
    const slots = await doctorService.addAvailabilitySlots(req.user.id, req.body.slots);
    res.status(201).json({ success: true, data: { slots } });
  } catch (error) { next(error); }
};

const deleteSlot = async (req, res, next) => {
  try {
    const slots = await doctorService.deleteAvailabilitySlot(req.user.id, req.params.slotId);
    res.json({ success: true, data: { slots } });
  } catch (error) { next(error); }
};

const getAppointments = async (req, res, next) => {
  try {
    const result = await doctorService.getMyAppointments({ userId: req.user.id, ...req.query });
    res.json({ success: true, ...result });
  } catch (error) { next(error); }
};

const listDoctors = async (req, res, next) => {
  try {
    const result = await doctorService.getPublicDoctors(req.query);
    res.json({ success: true, ...result });
  } catch (error) { next(error); }
};

const getDoctorById = async (req, res, next) => {
  try {
    const doctor = await doctorService.getPublicDoctorById(req.params.id);
    res.json({ success: true, data: doctor });
  } catch (error) { next(error); }
};

module.exports = {
  createProfile,
  getProfile,
  updateProfile,
  getDashboard,
  getAvailability,
  addSlots,
  deleteSlot,
  getAppointments,
  listDoctors,
  getDoctorById,
};
