import { connect } from "@/dbConfig/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Message from "@/models/Message";
import fs from "fs";
import path from "path";

export async function POST(req: Request) {
  await connect();
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { messageId } = await req.json();
  const message = await Message.findById(messageId);

  if (!message)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (message.imageUrl && message.imageUrl.includes("/uploads/")) {
    const fileName = message.imageUrl.split("/uploads/")[1];
    const filePath = path.join(process.cwd(), "public", "uploads", fileName);
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error("Error deleting file:", err);
    }
  }

  await Message.findByIdAndDelete(messageId);

  return NextResponse.json({ success: true });
}
