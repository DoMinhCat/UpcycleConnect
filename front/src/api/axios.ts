import axios from "axios";
import { getNewAccessToken } from "./auth";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        const response = await getNewAccessToken();
        localStorage.setItem("token", response.data.token);
        originalRequest.headers.Authorization = `Bearer ${response.data.token}`;
        return api(originalRequest);
      }
    }
    return Promise.reject(error);
  },
);
