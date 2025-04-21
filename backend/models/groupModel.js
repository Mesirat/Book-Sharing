import mongoose from "mongoose";

const groupSchema = mongoose.Schema({
  groupName: { type: String, required: true },
  discription: { type: String, required: true },
  ProfilePicture: { type: String, default: "default-aviator.jpg" },
  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

export const Group = mongoose.model("group", groupSchema);
