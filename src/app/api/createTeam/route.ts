import { connect } from "@/dbConfig/db";
import User from "@/models/user";
import Team from "@/models/team"
import { NextRequest, NextResponse } from "next/server";
import { useAuthStore } from "@/store/useAuthStore";
import Room from "@/models/room";
import mongoose from "mongoose";
import { redirect } from "next/navigation";
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
      const { teamName, user,projectName } = reqBody; // Get user info from frontend

      if (!teamName || !user || !projectName) {
          return NextResponse.json({ message: "All info are required" }, { status: 400 });
      }

      const teamId = await generateUniqueTeamId();
      const room = await Room.create({
          ownerId: new mongoose.Types.ObjectId(user.id),
          title: projectName,
          inTeam:true
        });
      console.log("new room created is",room)
      console.log("new room created id is",room._id);
      const newTeam = new Team({
          teamId,
          teamName,
          projectName,
          roomId:room._id.toString(),
          leaderId: user.id,
          leaderName: user.name,
          members: [{ id: user.id, name: user.name }],
      });

      await newTeam.save();
      console.log("new team is",newTeam);
      await User.findByIdAndUpdate(user.id, {
        $push: { myTeams: { teamId: newTeam._id, teamName: newTeam.teamName,projectName:newTeam.projectName } }
    }, { new: true }); 
    return NextResponse.json(
  {
    message: "Team created successfully",
    teamId,
    redirectUrl: "/dashboard/" + room._id.toString(),
  },
  { status: 201 }
);

    } catch (error) {
        console.log("Error in team formation",error);
        return NextResponse.json({ message: "Error creating team", error }, { status: 500 });
    }
}