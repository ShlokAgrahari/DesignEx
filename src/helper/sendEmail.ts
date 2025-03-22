import {Resend} from "resend";

import VerificationEmail from "@/components/verifyEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
    email:string,
    verifyCode:string,
):Promise<ApiResponse>{
    const resend = new Resend(process.env.RESEND_API_KEY);
    console.log(email);
    console.log(verifyCode);


    try {
        await resend.emails.send({
            from: 'onboarding@resend.dev',
            to: email,
            subject: 'Verification Code',
            react: VerificationEmail({email,verifyCode}),
        });

        return {success:true,message:"successfully send email"}
    } catch (error) {
        console.log("email verifcation error is ",error);
        return {success:false,message:"failed to send email"}
    }   
}