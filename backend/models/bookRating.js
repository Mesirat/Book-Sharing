import mongoose from "mongoose";
const BookRatingSchema = new mongoose.Schema({
  volumeId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
});

export const BookRating = mongoose.model('BookRating', BookRatingSchema);