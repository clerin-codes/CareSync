import api from "../lib/api";

export const loginUser = async ({ identifier, password }) => {
  const payload = {
    password,
  };

  // detect email or phone from one input field
  if (identifier.includes("@")) {
    payload.email = identifier.trim().toLowerCase();
  } else {
    payload.phone = identifier.trim();
  }

  const { data } = await api.post("/auth/login", payload);
  return data;
};

export const registerUser = async ({
  fullName,
  email,
  phone,
  password,
  role,
}) => {
  const payload = {
    fullName,
    password,
    role,
  };

  if (email) payload.email = email.trim().toLowerCase();
  if (phone) payload.phone = phone.trim();

  const { data } = await api.post("/auth/register", payload);
  return data;
};

export const forgotPassword = async (email) => {
  const { data } = await api.post("/auth/forgot-password", { email });
  return data;
};

export const resetPassword = async (payload) => {
  const { data } = await api.post("/auth/reset-password", payload);
  return data;
};

export const changePassword = async (payload) => {
  const { data } = await api.put("/auth/change-password", payload);
  return data;
};