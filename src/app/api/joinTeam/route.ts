import Team from "@/models/team";
import {connect} from "@/dbConfig/db"
import { NextRequest,NextResponse } from "next/server";
import { useAuthStore } from "@/store/useAuthStore";
import User from "@/models/user";
export async function POST(request:NextRequest){
    await connect();
    try {
       const reqBody= await request.json();
       const {teamId,user}=reqBody;

       if(!teamId){
        return NextResponse.json({message:"TeamId is required"},{status:400})
       }

       let team=await Team.findOne({teamId:teamId})

       if(!team){
        return NextResponse.json({message:"Team does not exist"},{status:401})
       }

       const isMember = team.members.find((member: { id: { toString: () => any; }; }) => member.id.toString() === user.id);
        if (isMember) {
            return NextResponse.json({ message: "User is already a member of the team" }, { status: 400 });
        }

        team.members.push({ id: user.id, name: user.name });
        await team.save();

        await User.findByIdAndUpdate(user.id,{
            $push:{myTeams:{teamId:teamId,teamName:team.teamName}}
        }, { new: true })

        return NextResponse.json({ message: "User joined the team successfully" }, { status: 200 });
    } catch (error) {
        console.log("Error in joining team",error);
    }
}