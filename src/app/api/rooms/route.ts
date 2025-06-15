import { NextResponse } from "next/server";
import { getUserRooms } from "@/lib/getRooms";
import { cookies } from "next/headers";

export async function GET() {
  const cookieStore = cookies();
    const userCookie = (await cookieStore).get("user")?.value;
  
      if (!userCookie) {
          throw new Error("User not logged in (cookie missing)");
      }
  
      const user = JSON.parse(userCookie);
      console.log(user);
  if (!user?.id) {
    return NextResponse.json({ error: "User ID missing" }, { status: 400 });
  }

  const { ownedRooms, roomInvites } = await getUserRooms(user.id);

  return NextResponse.json({ ownedRooms, roomInvites });
}
