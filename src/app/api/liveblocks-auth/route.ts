import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import User from "@/models/user";
import { Liveblocks } from "@liveblocks/node";

const liveblocks = new Liveblocks({ secret: process.env.LIVEBLOCKS_SECRET! });

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = (session.user as any).id;
  const email = session.user.email;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Authorize Liveblocks access
    const room = "testing"; // You can make this dynamic
    const userSession = liveblocks.prepareSession(userId, {
      userInfo: {
        name: user.email,
      },
    });

    userSession.allow(`room:${room}`, userSession.FULL_ACCESS);

    const { status, body } = await userSession.authorize();

    return new Response(body, { status });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
