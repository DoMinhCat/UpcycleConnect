import { api } from "./axios";
import { jwtDecode } from "jwt-decode";

// pure communication with backend
export interface LoginPayload {
  email: string;
  password: string;
}

export const LoginRequest = async (payload: LoginPayload) => {
  const response = await api.post("/login/", payload);
  return response.data;
};

// Decode JWT to get User's info
interface DecodedToken {
  user_id: number;
  email: string;
  role: string;
  exp: number;
}

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUserRole = () => {
  const token = getToken();
  if (!token) return null;

  const decoded = jwtDecode<DecodedToken>(token);
  return decoded.role;
};

export const isTokenExpired = () => {
  const token = getToken();
  if (!token) return true;

  const decoded = jwtDecode<DecodedToken>(token);
  return decoded.exp * 1000 < Date.now();
};
