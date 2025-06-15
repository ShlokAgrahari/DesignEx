import { create } from "zustand";
import Cookies from "js-cookie";
import { RoomInviteType } from "@/types/RoomInvite"; // ✅ Only import types here

// Define Room type
interface Room {
  _id: string;
  title?: string;
  ownerId?: string;
  roomInvites?: string[]; // If you populate them, use RoomInviteType[]
}

// Define User type
interface User {
  id: string | null;
  name: string;
  email: string;
}

// Zustand state interface
interface AuthState {
  user: User | null;
  setUser: (user: User) => void;
  logout: () => void;

  ownedRooms: Room[];
  roomInvites: RoomInviteType[];
  setOwnedRooms: (rooms: Room[]) => void;
  setRoomInvites: (invites: RoomInviteType[]) => void;
}

// Zustand store
export const useAuthStore = create<AuthState>((set) => {
  const storedUser = Cookies.get("user");
  const initialUser = storedUser ? JSON.parse(storedUser) : null;

  return {
    user: initialUser,
    ownedRooms: [],
    roomInvites: [],

    setUser: (user) => {
      console.log("Updating Zustand store with user:", user);
      set({ user });
      Cookies.set("user", JSON.stringify(user), { expires: 7 });
    },

    logout: () => {
      console.log("User logged out");
      set({ user: null, ownedRooms: [], roomInvites: [] });
      Cookies.remove("user");
    },

    setOwnedRooms: (rooms) => set({ ownedRooms: rooms }),
    setRoomInvites: (invites) => set({ roomInvites: invites }),
  };
});
