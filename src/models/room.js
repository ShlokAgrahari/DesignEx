import mongoose from "mongoose";

const { Schema, model, models, Types } = mongoose;

const roomSchema = new Schema(
  {
    ownerId: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      default: "Untitled",
    },
    roomInvites: [
      {
        type: Types.ObjectId,
        ref: "RoomInvite",
      },
    ],
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: false },
  }
);


const Room = models.Room || model("Room", roomSchema);

export default Room;
