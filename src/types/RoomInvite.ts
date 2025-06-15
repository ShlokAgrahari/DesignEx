import type { RoomType } from "@/types/room"; // ✅ point to the type, not model

export interface RoomInviteType {
  id: string;
  room: RoomType;
  roomId: string;
  userId: string;
  createdAt?: string;
  updatedAt?: string;
}
