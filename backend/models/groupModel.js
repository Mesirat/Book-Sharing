import mongoose from "mongoose";

const groupSchema = mongoose.Schema({
  groupName: { type: String, required: true },
  profilePic: { type: String, default: "default-aviator.jpg" },

  members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
  memberCount: { type: Number, default: 0 },
  cloudinaryPublicId:{type: String ,default:null},
}, {
  timestamps: true,  
});

export const Group = mongoose.model("Group", groupSchema);  
