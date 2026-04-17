import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:4000",
  timeout: 10000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("sh_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      const message =
        error.code === "ECONNABORTED"
          ? "Request timed out. Please check your connection and try again."
          : "Network error. Please check your connection and try again.";
      error.response = { data: { message } };
      return Promise.reject(error);
    }

    const data = error.response.data;
    if (typeof data !== "object" || data === null) {
      error.response.data = {
        message: `Service returned an unexpected response (status ${error.response.status}).`
      };
    }

    return Promise.reject(error);
  }
);

export default api;
