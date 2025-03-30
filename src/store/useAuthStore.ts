import { create } from "zustand";
import Cookies from "js-cookie";
interface User {
  id: string|null;
  name: string;
  email: string;
}

interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  const storedUser = Cookies.get("user");
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  return {
    user: initialUser,

    setUser: (user) => {
      console.log("Updating Zustand store with user:", user);
      set({ user });

      Cookies.set("user", JSON.stringify(user), { expires: 7 }); 
    },

    logout: () => {
      console.log("User logged out, clearing Zustand store");
      set({ user: null });

     
      Cookies.remove("user");
    },
  };
});
