import api from "./api";

export const registerUser = async (payload) => {
  const res = await api.post("/auth/register", payload);
  return res.data;
};

export const loginUser = async (payload) => {
  const res = await api.post("/auth/login", payload);
  return res.data;
};

export const forgotPassword = async (payload) => {
  const res = await api.post("/auth/forgot-password", payload);
  return res.data;
};

export const resetPassword = async (payload) => {
  const res = await api.post("/auth/reset-password", payload);
  return res.data;
};