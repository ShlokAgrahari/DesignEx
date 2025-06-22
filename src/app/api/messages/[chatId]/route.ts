import { connect } from "@/dbConfig/db";
import Message from "@/models/Message";
import { NextResponse, NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { chatId: string } }
) {
  await connect();

  const chatId = params.chatId; // ✅ No await here

  const messages = await Message.find({
    $or: [
      { roomId: chatId },
      {
        $and: [
          {
            $or: [
              { senderId: chatId },
              { receiverId: chatId },
            ],
          },
        ],
      },
    ],
  }).sort({ timestamp: 1 });

  return NextResponse.json(messages);
}
