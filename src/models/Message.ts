import mongoose, { Schema, Document } from "mongoose";

export interface IMessage extends Document {
  senderId: string;
  senderName?: string;
  receiverId?: string;
  roomId?: string;
  content?: string;
  imageUrl?: string;
  timestamp: Date;
}

const MessageSchema = new Schema<IMessage>({
  senderId: { type: String, required: true },
  senderName: { type: String },
  receiverId: { type: String },
  roomId: { type: String },
  content: { type: String },
  imageUrl: { type: String },
  timestamp: { type: Date, default: Date.now },
});

const Message =
  mongoose.models.Message || mongoose.model("Message", MessageSchema);
export default Message;
