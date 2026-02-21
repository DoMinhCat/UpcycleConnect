import { api } from "../axios";

// pure communication with backend
// NEEDS TO KNOW: request/response structure and endpoints of backend

//example only:
export interface User {
  id: number;
  name: string;
  email: string;
}

export const getUsers = async (): Promise<User[]> => {
  const { data } = await api.get<User[]>("/users");
  return data;
};

export const createUser = async (user: Partial<User>) => {
  const { data } = await api.post("/users", user);
  return data;
};

export const deleteUser = async (id: number) => {
  return api.delete(`/users/${id}`);
};
// end of examples
