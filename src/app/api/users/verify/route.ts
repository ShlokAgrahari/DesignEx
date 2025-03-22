import {connect} from "@/dbConfig/db";
import User from "@/models/user";

export async function POST(request:Request) {
    await connect();
    const {email,verifyCode} = await request.json();
    console.log("request has been made");
    try {
        const user = await User.findOne({email:email});
        if(!user){
            console.log('not exist');
            return Response.json({
                success:false,
                message:"user does not found"
            },{status:400});
        }

        const isCodeValid = user.verifyCode === verifyCode;
        const isNotExpired = new Date(user.verifyCodeExpiry) > new Date();

        if(isCodeValid && isNotExpired){
            console.log("verifying");
            user.isVerified = true;
            await user.save();
            return Response.json({
                success:true,
                message:"verified successfully"
            },{status:200})
        }
        else if(!isNotExpired){
            console.log("is expired");
            return Response.json({
                success:false,
                message:"code expired"
            },{status:400})
        }
        else{
            return Response.json({
                success:false,
                message:"wrong code"
            },{status:400})
        }

    } catch (error) {
        console.log("error during verification",error);
        return Response.json({
            success:false,
            message:"failed to verify"
        },{status:500})
    }
}