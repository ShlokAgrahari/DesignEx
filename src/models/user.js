import mongoose from "mongoose";

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
    isVerified:{
        type:Boolean,
        default:false,
    },
})

const User=mongoose.model("Users",userSchema);

export default User;