import {connect} from "@/dbConfig/db"
import Team from "@/models/team";


export async function GET(request:Request){
    await connect();
    try {
        const { searchParams } = new URL(request.url);
        const teamId = searchParams.get("team_id");
        const team = await Team.findById(teamId);
        if(!team){
            return Response.json({
                success:false,
                message:"Team does not found",
            },{status:500});
        }
        const activeStatus = team.isActive;
        return Response.json(
            {
              success: true,
              activeStatus, 
            },
            { status: 200 }
        );

    } catch (error) {
        console.log("get status error is ",error);
    }
}