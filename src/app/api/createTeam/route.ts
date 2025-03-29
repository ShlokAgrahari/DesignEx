import { connect } from "@/dbConfig/db";
import User from "@/models/user";
import Team from "@/models/team"
import { NextRequest, NextResponse } from "next/server";
import { useAuthStore } from "@/store/useAuthStore";
const generateUniqueTeamId = async (): Promise<string> => {
    let teamId: string="";
    let exists = true;
  
    while (exists) {
      teamId = Math.random().toString(36).substr(2, 8).toUpperCase(); // Example: "A1B2C3D4"
      exists = !!(await Team.exists({ teamId }));
    }
  
    return teamId;
  };

export async function POST(request:NextRequest) {
    await connect();
    
    try {
      const reqBody = await request.json();
      const { teamName, user } = reqBody; // Get user info from frontend

      if (!teamName || !user) {
          return NextResponse.json({ message: "Team name and user info are required" }, { status: 400 });
      }

      const teamId = await generateUniqueTeamId();

      const newTeam = new Team({
          teamId,
          teamName,
          leaderId: user.id,
          leaderName: user.name,
          members: [{ id: user.id, name: user.name }],
      });

      await newTeam.save();

      await User.findByIdAndUpdate(user.id, {
        $push: { myTeams: { teamId: newTeam._id, teamName: newTeam.teamName } }
    }, { new: true }); 
    
    return NextResponse.json({ message: "Team created successfully", teamId }, { status: 201 });
    
    } catch (error) {
        console.log("Error in team formation",error);
        return NextResponse.json({ message: "Error creating team", error }, { status: 500 });
    }
}