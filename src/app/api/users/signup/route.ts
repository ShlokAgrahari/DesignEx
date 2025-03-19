import {connect} from "@/dbConfig/db"
import User from "@/models/user"
import { NextRequest,NextResponse } from "next/server"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
connect()


export async function  POST(request:NextRequest) {
    try {
        const reqBody=await request.json()
        const {username,email,password}=reqBody

        console.log(reqBody)

        //if user exists
       const user= await User.findOne({email})

       if(user){
        return NextResponse.json({error:"User already exists"},{status:400})
       }

       //hash
       const salt=await bcrypt.genSalt(10)
       const hashedPassword=await bcrypt.hash(password,salt)

       const newUser=new User({
        username,
        email,
        password:hashedPassword
       })

       const savedUser=await newUser.save()
       console.log(savedUser);


       const tokenData={
        id:savedUser._id,
        username:savedUser.username,
        email:savedUser.email
       }
       const token=await jwt.sign(tokenData,process.env.NEXTAUTH_SECRET!,{expiresIn:"6d"})
       const response= NextResponse.json({message:"User created successfully",success:true,user: savedUser})

       response.cookies.set("token",token,{
        httpOnly:true
       })

       return response
    } catch (error:any) {
        return NextResponse.json({error:error.message},{status:500})
    }
}