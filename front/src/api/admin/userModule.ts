import { api } from "../axios";
import { ENDPOINTS } from "../endpoints";

export interface Account {
    id: number;
    username: string;
    email: string;
    role: string;
    status: string;
    created_at: string;
}

export async function getAllAccounts() {
    const response = await api.get(ENDPOINTS.ADMIN.USERS);
    return response.data;
}