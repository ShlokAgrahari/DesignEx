import {connect} from "@/dbConfig/db";
import Team from "@/models/team";


export async function POST(request:Request){
    await connect();
    try {
        const {team_id} = await request.json(); 
        const team = await Team.findById(team_id);

        if(!team){
            return Response.json({
                success:false,
                message:"user does not exists",
            },{status:500});
        }

        team.isActive = !team.isActive;
        await team.save({ validateBeforeSave: false });
        return Response.json({
            success:true,
            message:"completed successfully",
        },{status:200});
    } catch (error) {
        console.log("get status error ",error);
        return Response.json({
            success:false,
            message:"failed to set status",
        },{status:500});
    }
}