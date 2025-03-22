import { connect } from "@/dbConfig/db";
import User from "@/models/user";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendVerificationEmail } from "@/helper/sendEmail";

export async function POST(request: NextRequest) {
  await connect();
  
  try {
    const reqBody = await request.json();
    const { username, email, password } = reqBody;
    const verifyCode = Math.floor(Math.random() * 900000 + 100000).toString();

    console.log("Received data:", reqBody);

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    let user = await User.findOne({ email });

    // If user exists and is verified
    if (user && user.isVerified) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Set verification expiry
    const expiryDate = new Date();
    expiryDate.setHours(expiryDate.getHours() + 1);

    if (!user) {
      // Create new user if they don't exist
      user = new User({
        username,
        email,
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry: expiryDate,
        isVerified: false,
      });

      await user.save();
    }

    // Send verification email
    const emailResponse = await sendVerificationEmail(email, verifyCode);
    if (!emailResponse.success) {
      return NextResponse.json(
        { success: false, message: "Something went wrong" },
        { status: 500 }
      );
    }

    // Generate JWT token
    const tokenData = {
      id: user._id,
      username: user.username,
      email: user.email,
    };

    const token = await jwt.sign(
      tokenData,
      process.env.NEXTAUTH_SECRET!,
      { expiresIn: "6d" }
    );

    console.log("User created successfully:", user);

    return NextResponse.json({
      message: "User created successfully",
      success: true,
      user,
      token,
    });

  } catch (error: any) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
