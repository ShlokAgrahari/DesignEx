import { connect } from "@/dbConfig/db";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  { params }: { params: { chatId: string } }
) {
  await connect();
  const messages = await Message.find({
    $or: [
      { roomId: await params.chatId },
      {
        $and: [
          { $or: [{ senderId: params.chatId }, { receiverId: params.chatId }] },
        ],
      },
    ],
  }).sort({ timestamp: 1 });

  return NextResponse.json(messages);
}
