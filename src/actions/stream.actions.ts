"use server"

import { cookies } from "next/headers";
import { StreamClient } from "@stream-io/node-sdk";


const apiKey = process.env.API_KEY;
const apiSecret = process.env.API_SECRET;

export const tokenProvider = async()=>{
    
    const cookieStore = cookies();
    const userCookie = (await cookieStore).get("user")?.value;

    if (!userCookie) {
        throw new Error("User not logged in (cookie missing)");
    }

    const user = JSON.parse(userCookie);
    if(!user?.id){
        throw new Error("user not logged in");
    }
    if(!apiKey){
        throw new Error("api key is missing");
    }
    if(!apiSecret){
        throw new Error("api secret is missing");
    }

    const client = new StreamClient(apiKey,apiSecret);
    const validity = 24*60*60;


    const token = client.generateUserToken({user_id:user.id,validity_in_seconds: validity});
    return token;
}
