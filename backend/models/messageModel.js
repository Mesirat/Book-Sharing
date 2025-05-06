import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    group: { type: mongoose.Schema.Types.ObjectId, ref: "Group", required: true }, 
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String },
    status: {
      type: String,
      enum: ["sending", "sent", "delivered", "read"],
      default: "sending",
    },
    file: {
      url: { type: String },
      type: { type: String }, 
      name: { type: String },
    },
    seenBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true } 
);

export const Message = mongoose.model("Message", messageSchema);
