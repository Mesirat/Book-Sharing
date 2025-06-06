import mongoose from "mongoose";

const ratingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
});

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    authors: {
      type: [String],
      default: [],
    },
    publisher: {
      type: String,
      default: "Unknown Publisher",
    },
    publishedYear: {
      type: String,
      default: "N/A",
    },
    description: {
      type: String,
      default: "No description available.",
    },
    categories: {
      type: [String],
      default: [],
      index: true,
    },
    thumbnail: {
      type: String,
      default: "/assets/default-thumbnail.jpg",
    },
    cloudinaryPublicId: {
      type: String,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    ratings: [ratingSchema],
    readCount: {
      type: Number,
      default: 0,
    },
    pdfLink: {
      type: String,
    },


    embedding: {
      type: [Number],
      default: [],
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model("Book", bookSchema);
