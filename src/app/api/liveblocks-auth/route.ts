import { Liveblocks } from "@liveblocks/node";
import { getServerSession } from "next-auth";
import { authConfig } from "@/server/auth/config";
import User from "@/models/user";
import { connect } from "@/dbConfig/db";
import { cookies } from "next/headers";
import { Jwt } from "jsonwebtoken";
const liveblocks = new Liveblocks({
  secret: process.env.LIVEBLOCK_SECRET_KEY!,
});

export async function POST(req: Request) {
  await connect();
  
  const cookieStore = cookies();
    const userCookie = (await cookieStore).get("user")?.value;

    if (!userCookie) {
        throw new Error("User not logged in (cookie missing)");
    }

    const user = JSON.parse(userCookie);
    if(!user?.id){
        throw new Error("user not logged in");
    }
    console.log("Current user is",user);
  
  // Create a Liveblocks session with properly typed userInfo
  const liveblocksSession = liveblocks.prepareSession(
    user.id.toString(),
    {
      userInfo: {
        name: user.name || user.email || "Anonymous",
        email: user.email,
        // You can add more custom properties here
      } as { name: string; email: string } // Type assertion
    }
  );

  const roomId = "test";
  liveblocksSession.allow(`room:${roomId}`, liveblocksSession.FULL_ACCESS);

  const { status, body } = await liveblocksSession.authorize();
  return new Response(body, { status });
}