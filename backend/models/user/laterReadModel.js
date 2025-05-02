import mongoose from "mongoose";

const laterReadSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId, // User ID
    ref: "User",
    required: true,
  },
  laterReads: [
    {
      bookId: { type: String, required: true },
      title: { type: String, required: true },
      author: { type: String, required: true },
      thumbnail: { type: String, required: true },
      addedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
});

export const LaterRead = mongoose.model("LaterRead", laterReadSchema);
