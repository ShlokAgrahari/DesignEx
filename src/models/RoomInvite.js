import mongoose from "mongoose";

const { Schema, model, models, Types } = mongoose;
const roomInviteSchema = new mongoose.Schema(
  {
    roomId: { type: mongoose.Types.ObjectId, ref: "Room", required: true },
    userId: { type: mongoose.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
// ✅ Fix
const RoomInvite = mongoose.models.RoomInvite || mongoose.model("RoomInvite", roomInviteSchema);
export default RoomInvite;
