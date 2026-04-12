import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getMyProfile = () => API.get("/patients/me");
export const createMyProfile = (data) => API.post("/patients/me", data);
export const updateMyProfile = (data) => API.put("/patients/me", data);

export default API;