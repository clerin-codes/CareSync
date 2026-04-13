import api from "../lib/api";

export const getMyProfile = async () => {
  const { data } = await api.get("/patients/me");
  return data;
};

export const createMyProfile = async (payload) => {
  const { data } = await api.post("/patients/me", payload);
  return data;
};

export const updateMyProfile = async (payload) => {
  const { data } = await api.patch("/patients/me", payload);
  return data;
};

export const uploadMyAvatar = async (file) => {
  const formData = new FormData();
  formData.append("avatar", file);

  const { data } = await api.post("/patients/me/avatar", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const getMyDashboard = async () => {
  const { data } = await api.get("/patients/me/dashboard");
  return data;
};

export const getMyDocuments = async () => {
  const { data } = await api.get("/patients/me/documents");
  return data;
};

export const uploadMyDocument = async ({ file, title, fileType }) => {
  const formData = new FormData();
  formData.append("document", file);
  formData.append("title", title);
  if (fileType) formData.append("fileType", fileType);

  const { data } = await api.post("/patients/me/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return data;
};

export const deleteMyDocument = async (documentId) => {
  const { data } = await api.delete(`/patients/me/documents/${documentId}`);
  return data;
};


export const getAllPatients = async (params = {}) => {
  const { data } = await api.get("/patients", { params });
  return data;
};

export const updatePatientStatus = async (id, status) => {
  const { data } = await api.patch(`/patients/${id}/status`, { status });
  return data;
};

export const createEmergencyRequest = async (payload) => {
  const { data } = await api.post("/patients/me/emergency", payload);
  return data;
};

export const aiExplain = async ({ text, language }) => {
  const { data } = await api.post("/patients/me/ai-explain", { text, language });
  return data;
};  

export const getAllMedicalHistory = async () => {
  const { data } = await api.get("/patients/me/medical-history");
  return data;
};

export const getAllDoctors = async () => {
  const { data } = await api.get("/doctors");
  return data;
};

export const getAllHospitals = async () => {
  const { data } = await api.get("/hospitals");
  return data;
};

export const getMyAppointments = async () => {
  const { data } = await api.get("/patients/me/appointments");
  return data;
};
