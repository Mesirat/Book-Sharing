import mongoose from 'mongoose';
import { User } from './userModel.js';
const bookSchema = new mongoose.Schema(
  {
    bookId: {
      type: String,
      required: true,
      unique: true, 
      index: true,  // Index for fast lookups
    },
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
      default: 'Unknown Publisher',
    },
    publishedDate: {
      type: String, 
      default: 'N/A',
    },
    description: {
      type: String,
      default: 'No description available.',
    },
    pageCount: {
      type: Number,
      default: 0,
    },
    categories: {
      type: [String],
      default: [],
      index: true, // Index for fast lookups by categories
    },
    thumbnail: {
      type: String,
      default: '/assets/default-thumbnail.jpg',
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    ratingsCount: {
      type: Number,
      default: 0,
    },
    previewLink: {
      type: String,
      default: '',
    },
    isbn: {
      type: String,
      default: '',
      index: true, // Index for faster searches by ISBN
      match: /^(97(8|9))?\d{9}(\d|X)$/, // Basic ISBN validation
    },
  },
  { timestamps: true }
);

export const Book = mongoose.model('Book', bookSchema);
