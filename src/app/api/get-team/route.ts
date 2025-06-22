import { NextRequest } from "next/server";
import { connect } from "@/dbConfig/db";
import Team from "@/models/team";

export async function GET(req: NextRequest) {
  try {
    await connect();

    const teamId = req.nextUrl.searchParams.get("team_id");

    if (!teamId) {
      return Response.json(
        { success: false, message: "team_id is required" },
        { status: 400 }
      );
    }

    const data = await Team.findOne({ teamId: teamId });

    if (!data) {
      return Response.json(
        { success: false, message: "Team not found" },
        { status: 404 }
      );
    }

    return Response.json({ success: true, team: data }, { status: 200 });
  } catch (error) {
    console.error("Error while getting team data:", error);
    return Response.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}
