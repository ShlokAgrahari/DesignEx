"use server";

import { cookies } from "next/headers";
import mongoose from "mongoose";
import { redirect } from "next/navigation";
import Room from "@/models/room";
import RoomInvite from "@/models/RoomInvite";
import User from "@/models/user";

async function getUserFromCookies() {
  const cookieStore = cookies();
  const userCookie = (await cookieStore).get("user")?.value;
  if (!userCookie) throw new Error("User not logged in (cookie missing)");
  const user = JSON.parse(userCookie);
  if (!user?.id) throw new Error("User ID missing in cookie");
  return user;
}

export async function createRoom() {
  const user =await getUserFromCookies();

  const room = await Room.create({
    ownerId: new mongoose.Types.ObjectId(user.id),
    title: "Untitled",
  });

  console.log("room created"+room)

  redirect("/dashboard/" + room._id.toString());
}

export async function updateRoomTitle(title: string, _id: string) {
  const user =await getUserFromCookies();
  
console.log("User ID:", user.id);

 const room = await Room.findOne({
  _id: new mongoose.Types.ObjectId(_id),
  ownerId: new mongoose.Types.ObjectId(user.id),
});

console.log("room updating is"+room);

if (!room) {
  console.error("Room not found or unauthorized", {
    roomId: _id,
    ownerId: user.id,
  });
  throw new Error("Room not found or unauthorized");
}


  room.title = title;
  await room.save();
}

export async function deleteRoom(id: string) {
  const user =await getUserFromCookies();

  const room = await Room.findOne({
    _id: id,
    ownerId: user.id,
  });

  if (!room) throw new Error("Room not found or unauthorized");

  await Room.deleteOne({ _id: id });
}

export async function shareRoom(id: string, inviteEmail: string) {
  const user =await getUserFromCookies();
  console.log("user shared",user);
  const room = await Room.findById(id); // just find by _id
  console.log("room is in shared", room);
  if (!room) throw new Error("Room not found or unauthorized");

  const invitedUser = await User.findOne({ email: inviteEmail });
  console.log("invited user is",invitedUser)
  if (!invitedUser) return "User not found.";
  
  const alreadyInvited = await RoomInvite.findOne({
    roomId: room._id,
    userId: invitedUser._id,
  });

  if (alreadyInvited) return "Already shared with this user.";

  await RoomInvite.create({
    roomId: room._id,
    userId: invitedUser._id,
  });

  console.log(RoomInvite);
  return "Invite successful.";
}

export async function deleteInvitation(id: string, inviteEmail: string) {
  const user =await getUserFromCookies();

  const room = await Room.findOne({
    _id: id,
    ownerId: user.id,
  });

  if (!room) throw new Error("Room not found or unauthorized");

  await RoomInvite.deleteMany({
    roomId: room._id,
  }).where("userId").in(
    await User.find({ email: inviteEmail }).select("_id")
  );
}
