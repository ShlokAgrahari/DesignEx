// lib/getRooms.ts
import Room from "@/models/room";
import RoomInvite from "@/models/RoomInvite";
import {connect} from "@/dbConfig/db" // make sure you have this

export async function getUserRooms(userId: string) {
  await connect();

  const ownedRooms = await Room.find({ ownerId: userId })
    .lean();

  const roomInvites = await RoomInvite.find({ userId })
    .populate("roomId", "_id title")
    .lean();

  return { ownedRooms, roomInvites };
}
