import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    type: {
      type: String,
      enum: ["bug", "content", "feedback"],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    screenshotUrl: String,
    cloudinaryPublicId: String,
    response:{
      type:String,
      default:null
    },
  },
  { timestamps: true }
);

export const Report = mongoose.model("Report", reportSchema);
