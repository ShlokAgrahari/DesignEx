import { connect } from "@/dbConfig/db";
import Message from "@/models/Message";
import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  context: { params: { chatId: string } }
) {
  await connect();

  const { chatId } = context.params;

  const messages = await Message.find({
    $or: [
      { roomId: chatId },
      {
        $and: [
          {
            $or: [{ senderId: chatId }, { receiverId: chatId }],
          },
        ],
      },
    ],
  }).sort({ timestamp: 1 });

  return NextResponse.json(messages);
}
