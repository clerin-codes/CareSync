import api from "../lib/api";

export const getDoctorProfile = async () => {
  const { data } = await api.get("/doctors/profile");
  return data;
};

export const createDoctorProfile = async (payload) => {
  const { data } = await api.post("/doctors/profile", payload);
  return data;
};

export const updateDoctorProfile = async (payload) => {
  const { data } = await api.put("/doctors/profile", payload);
  return data;
};

export const getDoctorDashboard = async () => {
  const { data } = await api.get("/doctors/dashboard");
  return data;
};

export const getDoctorAppointments = async (params) => {
  const { data } = await api.get("/doctors/appointments", { params });
  return data;
};

export const getAvailability = async () => {
  const { data } = await api.get("/doctors/availability");
  return data;
};

export const addAvailabilitySlots = async (slots) => {
  const { data } = await api.post("/doctors/availability", { slots });
  return data;
};

export const deleteAvailabilitySlot = async (slotId) => {
  const { data } = await api.delete(`/doctors/availability/${slotId}`);
  return data;
};
