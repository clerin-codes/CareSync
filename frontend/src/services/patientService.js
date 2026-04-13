import api from "./api";

export const getMyDashboard = async () => {
  const res = await api.get("/patients/me/dashboard");
  return res.data;
};

export const getMyProfile = async () => {
  const res = await api.get("/patients/me");
  return res.data;
};

export const createMyProfile = async (payload) => {
  const res = await api.post("/patients/me", payload);
  return res.data;
};

export const updateMyProfile = async (payload) => {
  const res = await api.patch("/patients/me", payload);
  return res.data;
};

export const getMyDocuments = async () => {
  const res = await api.get("/patients/me/documents");
  return res.data;
};

export const uploadMyDocument = async (formData) => {
  const res = await api.post("/patients/me/documents", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

export const deleteMyDocument = async (documentId) => {
  const res = await api.delete(`/patients/me/documents/${documentId}`);
  return res.data;
};