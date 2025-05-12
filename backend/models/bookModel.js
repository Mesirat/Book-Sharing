import mongoose from "mongoose";

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
      type: String, // Store Cloudinary public ID for thumbnail image
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    readCount: {
      type: Number,
      default: 0,
    },
    pdfLink: {
      type: String,
    },
  },
  { timestamps: true }
);


export const Book = mongoose.model("Book", bookSchema);
