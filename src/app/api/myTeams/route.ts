import { connect } from "@/dbConfig/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/user";

export async function GET(request: NextRequest) {
    await connect();

    try {
        // Extract userId from query parameters
        const { searchParams } = new URL(request.url);
        const userId = searchParams.get("userId");

        if (!userId) {
            return NextResponse.json({ message: "User ID is required" }, { status: 400 });
        }

        const foundUser = await User.findById(userId).select("myTeams");

        if (!foundUser) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ myTeams: foundUser.myTeams }, { status: 200 });
    } catch (error) {
        console.log("Error in my teams:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
