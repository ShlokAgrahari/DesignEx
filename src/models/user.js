import mongoose, { Schema, models } from "mongoose";



const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
    },
    verifyCode:{
        type:String,
        required:true,
    },
    verifyCodeExpiry:{
        type:Date,
        required:true,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
})


// Prevent re-compiling the model if it already exists
const User = models.User || mongoose.model("User", userSchema);

export default User;
