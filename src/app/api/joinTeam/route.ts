import Team from "@/models/team";
import { connect } from "@/dbConfig/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";
import { shareRoom } from "@/actions/rooms"; // ✅ Adjust path as per your file structure

export async function POST(request: NextRequest) {
  await connect();

  try {
    const reqBody = await request.json();
    const { teamId, user } = reqBody;

    if (!teamId) {
      return NextResponse.json({ message: "TeamId is required" }, { status: 400 });
    }

    const team = await Team.findOne({ teamId });
    if (!team) {
      return NextResponse.json({ message: "Team does not exist" }, { status: 401 });
    }
    console.log("team is",team)
    const isMember = team.members.some((member: any) => member.id.toString() === user.id);
    if (isMember) {
      return NextResponse.json(
        { message: "User is already a member of the team" },
        { status: 409 }
      );
    }

    // Add user to team
    team.members.push({ id: user.id, name: user.name });
    await team.save();
    console.log("updated team is", team);

    // Add team info to user
    await User.findByIdAndUpdate(
      user.id,
      {
        $push: {
          myTeams: {
            teamId: teamId,
            teamName: team.teamName,
            projectName: team.projectName, // optional
          },
        },
      },
      { new: true }
    );

    // ✅ Share the room with the new user
    await shareRoom(team.roomId, user.email);

    return NextResponse.json(
      { message: "User joined the team successfully and room shared." },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error in joining team", error);
    return NextResponse.json({ message: "Server Error", error }, { status: 500 });
  }
}
