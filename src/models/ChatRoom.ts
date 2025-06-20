import mongoose, { Schema, Document } from "mongoose";

export interface IChatRoom extends Document {
  name: string;
  members: string[]; // array of user ids
}

const ChatRoomSchema = new Schema<IChatRoom>({
  name: { type: String, required: true },
  members: [{ type: String, required: true }],
});

const ChatRoom =
  mongoose.models.ChatRoom || mongoose.model("ChatRoom", ChatRoomSchema);
export default ChatRoom;
