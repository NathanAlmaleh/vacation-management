import { ref } from "vue";
import type { User } from "./useUsers";

const STORAGE_KEY = "vacation-app-current-user";
const currentUser = ref<User | null>(null);

export function useCurrentUser() {
  const setCurrentUser = (user: User | null) => {
    currentUser.value = user;
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const loadCurrentUser = () => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return;
      }
      const parsed = JSON.parse(stored) as User;
      currentUser.value = parsed;
    } catch {
      currentUser.value = null;
    }
  };

  return {
    currentUser,
    setCurrentUser,
    loadCurrentUser,
  };
}
