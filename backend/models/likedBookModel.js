import mongoose from "mongoose";

const likedBookSchema = new mongoose.Schema({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likedBooks: [
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

export const LikedBook = mongoose.model("LikedBook", likedBookSchema);
