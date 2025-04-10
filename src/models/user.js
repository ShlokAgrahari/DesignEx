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
        
    },
    verifyCodeExpiry:{
        type:Date,
        
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
    myTeams: [
        {
            teamId: {
                type: String,
                required: true
            },
            teamName: {
                type: String,
                required: true
            },
            projectName:{
                type:String,
                required:true
            }
        }
    ]
})


const User = models.User || mongoose.model("User", userSchema);

export default User;
