import { connect } from "@/dbConfig/db";
import { NextRequest, NextResponse } from "next/server";
import Room from "@/models/room";

export async function GET(request:NextRequest){
    await connect();
    try {
        const {searchParams} = new URL(request.url);
        const userId = searchParams.get("user");
        const q = searchParams.get("search");

        if(!q && !userId){
            return NextResponse.json({message:"q or id is missing"},{status:400});
        }

        const data = await Room.find({
            title:{$regex:q,$options:"i"},
        });
        console.log("Data is",data);
        return NextResponse.json({Roomdata:data},{status:200});
    } catch (error) {
        console.log("searcing api error",error);
    }
}