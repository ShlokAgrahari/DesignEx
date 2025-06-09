"use server"

import { cookies } from "next/headers";
import { StreamClient } from "@stream-io/node-sdk";


const apiKey = "agrqaxj4guaj";
const apiSecret = "fzmwezpz44qp3h73z6yfjev96h45xn2kzsz68epm7d282ufpgfewgt95x9d5r6t5";

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