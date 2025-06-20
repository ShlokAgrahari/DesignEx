import { connect } from "@/dbConfig/db";
import User from "@/models/user";

export async function GET(request:Request){
    await connect();
    try {
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if(!userId){
            return Response.json({
                success:false,
                message:"user id does not found",
            })
        }

        const userData  = await User.findById(userId);
        return Response.json(
            {
                success:true,
                data:userData.myTeams,
            },
            {status:200}
        )
    } catch (error) {
        console.log("getting team error is ",error);
    }
}