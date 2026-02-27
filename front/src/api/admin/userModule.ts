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
  return await api.post(ENDPOINTS.ACCOUNT.REGISTER, payload);
};
