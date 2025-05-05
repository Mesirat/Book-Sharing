import mongoose from "mongoose";

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
 
  },
  {
    timestamps: true,
  }
);

export const News = mongoose.model("News", NewsSchema);
