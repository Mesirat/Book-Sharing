
import mongoose  from 'mongoose';

const bookReadSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
}, { timestamps: true });

bookReadSchema.index({ userId: 1, bookId: 1 }, { unique: true });

export const BookRead = mongoose.model('BookRead', bookReadSchema);
