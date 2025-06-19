import { connect } from "@/dbConfig/db";
import Room from "@/models/room";
import RoomInvite from "@/models/RoomInvite";

export async function getUserRooms(userId: string) {
  await connect();

  // 1. Get all rooms owned by the user
  const allOwnedRooms = await Room.find({ ownerId: userId }).lean();

  // 2. Separate personal and team-owned rooms based on `inTeam` flag
  const personalRooms = allOwnedRooms.filter((room) => !room.inTeam);
  const teamOwnedRooms = allOwnedRooms.filter((room) => room.inTeam);

  // 3. Get invited rooms (shared)
  const roomInvites = await RoomInvite.find({ userId })
    .populate("roomId", "_id title ownerId inTeam createdAt") // Populate room details
    .lean();

  // 4. Extract valid rooms from invites
  const invitedRooms = roomInvites
    .map((invite) => invite.roomId)
    .filter((room) => room !== null);

  // 5. Combine team-owned + invited rooms
  const sharedRooms = [...teamOwnedRooms, ...invitedRooms];
  console.log("personal rooms",personalRooms);
  console.log("team owned rooms",teamOwnedRooms);
  console.log("roominvites",roomInvites);
  console.log("invited rooms",invitedRooms);
  console.log("shared rooms",sharedRooms)
  return {
    ownedRooms: personalRooms,  // Show only personal projects (not in team)
    sharedRooms,                // Show both: rooms created by user in a team + invited to
  };
}
