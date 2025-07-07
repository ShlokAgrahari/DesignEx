import { LiveblocksRoomProvider } from "@/components/liveblocks/Room";
import Canvas from "@/components/canvas/Canvas";
import Room from "@/models/room";
import RoomInvite from "@/models/RoomInvite";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import mongoose from "mongoose";

type ParamsType = { id: string };


interface LeanRoom {
  _id: mongoose.Types.ObjectId;
  title: string;
  ownerId: mongoose.Types.ObjectId;
}

export default async function Page({ params }: { params: Promise<ParamsType> }) {
  const { id } = await params;

  const cookieStore = cookies();
  const userCookie = (await cookieStore).get("user")?.value;
  if (!userCookie) throw new Error("User not logged in (cookie missing)");

  const user = JSON.parse(userCookie); // user must have `.id`

  

  const invites = await RoomInvite.find({ roomId: id }).populate("userId").lean();

  const inviteeUserIds = invites
    .map((inv: any) => inv.userId?._id?.toString())
    .filter(Boolean);

  const room = await Room.findById(id).lean<LeanRoom>(); 
  if (!room) redirect("/404");

  if (
    !inviteeUserIds.includes(user.id) &&
    user.id !== room.ownerId.toString()
  ) {
    redirect("/404");
  }

  return (
    <LiveblocksRoomProvider roomId={`room:${id}`}>
      <Canvas
      roomName={room.title}
        roomId={id}
        othersWithAccessToRoom={invites.map((x) => x.userId)}
        />
    </LiveblocksRoomProvider>
  );
}
