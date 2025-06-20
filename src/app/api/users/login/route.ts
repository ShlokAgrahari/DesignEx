import { connect } from "@/dbConfig/db";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(request: NextRequest) {
  try {
    await connect();

    const reqBody = await request.json();
    const { email, password } = reqBody;
    console.log("user on backend signin",reqBody);
    if (!email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
   
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const token = jwt.sign(
      { id: user._id.toString(), email: user.email },
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: "6d" }
    );

    const response = NextResponse.json({
      message: "Login successful",
      success: true,
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.username,
      },
    });

    // Set HTTP-only cookie for token, accessible in middleware
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 6 * 24 * 60 * 60, // 6 days in seconds
      path: "/",
      sameSite: "lax",
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
