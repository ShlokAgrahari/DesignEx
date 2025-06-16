import mongoose, { Schema, models } from "mongoose";

// Define the schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
  },
  verifyCode: {
    type: String,
  },
  verifyCodeExpiry: {
    type: Date,
  },
  isVerified: {
    type: Boolean,
    default: false,
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
      projectName: {
        type: String,
        required: true
      }
    }
  ]
});

// Create model
const User = models.User || mongoose.model("User", userSchema);

// ✅ Export both model and type
export default User;
export type UserType = mongoose.InferSchemaType<typeof userSchema>;
