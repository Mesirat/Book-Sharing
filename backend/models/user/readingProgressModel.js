import mongoose from "mongoose";

const readingProgressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Book",
      required: true,
    },
    currentPage: {
      type: Number,
      default: 0,
    },
    totalPages: {
      type: Number,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

readingProgressSchema.index({ user: 1, book: 1 }, { unique: true });

readingProgressSchema.virtual("progressPercent").get(function () {
  if (!this.totalPages || this.totalPages === 0) return 0;
  return Math.round((this.currentPage / this.totalPages) * 100);
});

export const ReadingProgress = mongoose.model("ReadingProgress", readingProgressSchema);
