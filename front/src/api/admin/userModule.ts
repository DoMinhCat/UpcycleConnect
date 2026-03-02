import { api } from "../axios";
import { ENDPOINTS } from "../endpoints";

export interface Account {
  id: number;
  username: string;
  email: string;
  role: string;
  is_banned: boolean;
  created_at: string;
  last_active: string;
  phone?: string;
  score?: number;
  is_premium?: boolean;
  avatar?: string;
}

export async function getAllAccounts() {
  const response = await api.get(ENDPOINTS.ADMIN.USERS);
  return response.data;
}
export interface RegisterPayload {
  email: string;
  password: string;
  username: string;
  phone?: string;
  role: string;
}

export const RegisterRequest = async (payload: RegisterPayload) => {
  return await api.post(ENDPOINTS.AUTH.REGISTER, payload);
};

export const deleteAccount = async (id_account: number) => {
  return await api.delete(ENDPOINTS.ADMIN.USERS + id_account + "/");
};

export const getAccountDetails = async (id_account: number) => {
  const response = await api.get(ENDPOINTS.ADMIN.USERS + id_account + "/");
  return response.data;
};

export interface updatePasswordPayload {
  id: number;
  newPassword: string;
}
export const updatePassword = async (payload: updatePasswordPayload) => {
  return await api.put(ENDPOINTS.ADMIN.USERS + payload.id + "/password/", {
    password: payload.newPassword,
  });
};
