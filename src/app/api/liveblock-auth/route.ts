import { Liveblocks } from "@liveblocks/node";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";

const liveblocks = new Liveblocks({
  secret: "sk_dev_1A2g5go9nbHqL3zV7ky_bb9s0B36Khbs1QE933LI5P544UQav29cCsGJMpXalWaj",
});



export async function POST(request: NextRequest) {
    const cookieStore = cookies();
    const userCookie = (await cookieStore).get("user")?.value;
    const { searchParams } = new URL(request.url);
    const roomId = searchParams.get("roomId");

    if(!roomId){
        return Response.json({
                success:false,
                message:"room id is missing",
        },{status:500});
    }

    if (!userCookie) {
        return Response.json({
                success:false,
                message:"unauthorized acces",
        },{status:500});;
    }

    
    const user = JSON.parse(userCookie);
    console.log(user);

    const session = liveblocks.prepareSession(user.id, {
        userInfo: {
            name:user.name,
            colors: ["#ff0000", "#00ff00", "#0000ff"],
        },
    });

    session.allow(roomId,session.FULL_ACCESS);
    const {status,body} = await session.authorize();
    return new Response(body,{status,headers:{ "content-type": "application/json" }});

} 
  
