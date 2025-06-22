import { connect } from "@/dbConfig/db";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import Message from "@/models/Message";
import { pusherServer } from "@/lib/pusher";
import  {cloudinary}  from "@/lib/cloudinary";
import { v4 as uuid } from "uuid";

export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req: Request) {
  await connect();
  const session = await getServerSession(authOptions);
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await req.formData();
  const content = formData.get("content") as string | null;
  const receiverId = formData.get("receiverId") as string;
  const roomId = formData.get("roomId") as string | null;
  const file = formData.get("image") as File | null;

  let imageUrl = null;

  if (file) {
    const buffer = Buffer.from(await file.arrayBuffer());

    // Convert buffer to base64 Data URI
    const base64 = buffer.toString("base64");
    const mime = file.type; // e.g., "image/jpeg"
    const dataUri = `data:${mime};base64,${base64}`;

    // Upload to Cloudinary
    try {
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "chat-app",
        public_id: `${uuid()}-${file.name}`,
      });
      imageUrl = result.secure_url;
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
    }
  }

  const message = await Message.create({
    senderId: session.user.id,
    senderName: session.user.name,
    receiverId,
    roomId,
    content,
    imageUrl,
  });

  const channel = roomId || receiverId;
  await pusherServer.trigger(channel!, "new-message", message);

  return NextResponse.json({ success: true, message });
}
