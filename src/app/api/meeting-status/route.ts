import {connect} from "@/dbConfig/db"
import userModel from "@/models/user";


export async function GET(request:Request){
    await connect();
    try {
        const { searchParams } = new URL(request.url);
        const email = searchParams.get("email");
        const user = await userModel.findOne({email});
        if(!user){
            return Response.json({
                success:false,
                message:"user does not found",
            },{status:500});
        }
        const activeStatus = user.isActive;
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