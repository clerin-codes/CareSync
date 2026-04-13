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