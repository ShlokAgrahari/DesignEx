import {connect} from "@/dbConfig/db"
import Team from "@/models/team";

export async function GET(request:Request) {
    await connect();
    try {
        const {searchParams} = new URL(request.url);
        const teamId = searchParams.get("team_id");
        console.log(teamId);
        if(!teamId){
            return Response.json({
                success:false,
                message:"team id does not found",
            })
        }

        const data = await Team.findById(teamId);
        if(!data){
            return Response.json({
                success:false,
                message:"team does not found",
            })
        }
        console.log(data);
        return Response.json(
            {
                success:true,
                data,
            },
            {status:200}
        )

    } catch (error) {
        console.log("Error while getting team data : ",error);
    }
}