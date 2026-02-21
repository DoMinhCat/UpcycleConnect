import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.API_BASE_URL, // change this if backend URL changes
  withCredentials: true, // if using cookies/session
});

// Optional: Add interceptor for JWT
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });
