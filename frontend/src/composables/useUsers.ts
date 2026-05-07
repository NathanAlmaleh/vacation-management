import { ref } from "vue";
import api from "../services/api";

type Role = "requester" | "validator";

export type User = {
  id: number;
  name: string;
  role: Role;
};

const users = ref<User[]>([]);
const loading = ref(false);
const error = ref<string | null>(null);

export function useUsers() {
  const fetchUsers = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get<User[]>("/users");
      users.value = response.data;
    } catch (err) {
      error.value = "Failed to load users.";
      console.error(err);
    } finally {
      loading.value = false;
    }
  };

  const createUser = async (payload: { name: string; role: Role }) => {
    try {
      const response = await api.post<User>("/users", payload);
      users.value.push(response.data);
      return response.data;
    } catch (err) {
      console.error("Failed to create user", err);
      throw err;
    }
  };

  const deleteUser = async (id: number) => {
    try {
      await api.delete(`/users/${id}`);
      users.value = users.value.filter((user) => user.id !== id);
    } catch (err) {
      console.error("Failed to delete user", err);
      throw err;
    }
  };

  const findUserById = (id: number) => users.value.find((user) => user.id === id) ?? null;

  return {
    users,
    loading,
    error,
    fetchUsers,
    createUser,
    findUserById,
    deleteUser,
  };
}
