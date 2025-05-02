import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  subject: String,
  message: String,
  response: String,
  respondedAt: Date,
}, { timestamps: true });

export const Report= mongoose.model("Report", reportSchema);
