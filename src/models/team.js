import mongoose, { Schema, models } from "mongoose";
import { type } from "os";

const teamSchema = new Schema({
    teamId: {
        type: String,
        unique: true,
        required: true
    },
    teamName: {
        type: String,
        required: true
    },
    projectName:{
        type:String,
        required:true
    },
    leaderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
    },
    leaderName: {
            type: String,
            required: true
    },
    members: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        name: {
            type: String,
            required: true
        }
    }]
});


const Team = models.Team || mongoose.model("Team", teamSchema);

export default Team;
