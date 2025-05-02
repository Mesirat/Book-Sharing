import { Book } from '../models/bookModel.js';
import asyncHandler from 'express-async-handler';
import dotenv from 'dotenv';
dotenv.config();
import axios from "axios"
import mongoose from 'mongoose';
import {LikedBook} from '../models/user/likedBookModel.js';
import {LaterRead} from '../models/user/laterReadModel.js';
const GOOGLE_BOOKS_API_URL = 'https://www.googleapis.com/books/v1/volumes';


export const getBooks = asyncHandler(async (req, res) => {
  const { title, author } = req.query;

  try {
    let query = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' }; 
    }

    if (author) {
      query.authors = { $in: [author] }; 
    }

    const books = await Book.find(query);

    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});


export const getBookById = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await Book.findOne({ bookId });

    if (!book) {
      return res.status(404).json({ message: 'Book not found!' });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});


export const updateBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const { title, authors, publisher, publishedDate, description, pageCount, categories, thumbnail, previewLink, isbn } = req.body;

  try {
    const book = await Book.findOne({ bookId });

    if (!book) {
      return res.status(404).json({ message: 'Book not found!' });
    }

    // Update the book fields
    book.title = title || book.title;
    book.authors = authors || book.authors;
    book.publisher = publisher || book.publisher;
    book.publishedDate = publishedDate || book.publishedDate;
    book.description = description || book.description;
    book.pageCount = pageCount || book.pageCount;
    book.categories = categories || book.categories;
    book.thumbnail = thumbnail || book.thumbnail;
    book.previewLink = previewLink || book.previewLink;
    book.isbn = isbn || book.isbn;

    await book.save();

    res.status(200).json({ message: 'Book updated successfully!', book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});


export const deleteBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await Book.findOne({ bookId });

    if (!book) {
      return res.status(404).json({ message: 'Book not found!' });
    }

    await book.remove();

    res.status(200).json({ message: 'Book deleted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});


export const getUserRating = asyncHandler(async (req, res) => {
  const { volumeId } = req.params;

  try {
    const ratings = await Book.find({ bookId: volumeId });

    if (!ratings.length) {
      return res.status(404).json({ averageRating: 0, reviewCount: 0 });
    }

    const totalRating = ratings.reduce((sum, r) => sum + r.rating, 0);
    const averageRating = totalRating / ratings.length;

    res.status(200).json({
      averageRating,
      reviewCount: ratings.length,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});


export const ratingBooks = asyncHandler(async (req, res) => {
  const { volumeId, userId, rating } = req.body;

  try {
    let userRating = await Book.findOne({ volumeId, userId });

    if (userRating) {
      userRating.rating = rating;
      await userRating.save();
      return res.status(200).json({ message: 'Rating updated successfully!' });
    }

    userRating = new Book({ volumeId, userId, rating });
    await userRating.save();

    res.status(201).json({ message: 'Rating submitted successfully!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

export const bookSearch = asyncHandler(async (req, res) => {
  const { query } = req.query;

  if (!query) {
    return res.status(400).json({ error: "Query parameter is required." });
  }

  try {
    
    const response = await axios.get("https://www.googleapis.com/books/v1/volumes", {
      params: {
        q: query,
        maxResults: 10,
        key: process.env.GOOGLE_BOOKS_API_KEY, 
      },
    });

    if (response.data.items) {
      res.json(response.data); 
    } else {
      res.status(404).json({ error: "No books found for the given query." });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch books from Google Books API." });
  }
})

export const popularBooks = asyncHandler(async (req, res) => {
  try {
    
    const query = 'bestseller'; 

    const response = await axios.get(GOOGLE_BOOKS_API_URL, {
      params: {
        q: query, 
        maxResults: 12, 
      }
    });

    const books = response.data.items.map(item => ({
      id: item.id,
      title: item.volumeInfo.title,
      author: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Unknown Author',
      thumbnail: item.volumeInfo.imageLinks?.thumbnail || '/fallback-image.jpg', // Fallback if no thumbnail is found
    }));

    res.json({ books });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Failed to fetch popular books' });
  }
});

export const getLaterReads = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    console.log("User ID from Token:", userId);

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }

    const laterReadDoc = await LaterRead.findById(userId).select("laterReads");

    if (!laterReadDoc) {
      return res.status(200).json({ laterReads: [] }); // Return empty array if not found
    }

    res.status(200).json({ laterReads: laterReadDoc.laterReads });
  } catch (error) {
    console.error("Error fetching Later Reads:", error);
    res
      .status(500)
      .json({ message: "An error occurred while fetching Later Reads." });
  }
});

export const getLikedBooks = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;

    console.log("User ID from Token:", userId);

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    const likedDoc = await LikedBook.findById(userId).select("likedBooks");

    if (!likedDoc) {
      return res.status(200).json({ likedBooks: [] }); // Return empty if none
    }

    res.status(200).json({ likedBooks: likedDoc.likedBooks });
  } catch (error) {
    console.error("Error fetching Liked Books:", error);
    res.status(500).json({
      message: error.message || "An error occurred while fetching liked books.",
    });
  }
});


export const likeBook = asyncHandler(async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const { bookId, title, author, thumbnail } = req.body;
    const userId = req.user._id;

    if (!bookId || !title || !author || !thumbnail) {
      return res.status(400).json({ message: "Missing book details" });
    }

    let likedDoc = await LikedBook.findById(userId);

    if (!likedDoc) {
      likedDoc = new LikedBook({ _id: userId, likedBooks: [] });
    }

    const existingIndex = likedDoc.likedBooks.findIndex(
      (book) => book.bookId === bookId
    );

    if (existingIndex !== -1) {
      likedDoc.likedBooks.splice(existingIndex, 1); // Remove if already liked
      await likedDoc.save();

      return res.status(200).json({
        message: "Book removed from Liked Books",
        likedBooks: likedDoc.likedBooks,
      });
    }

    likedDoc.likedBooks.push({ bookId, title, author, thumbnail });
    await likedDoc.save();

    res.status(200).json({
      message: "Book added to Liked Books",
      likedBooks: likedDoc.likedBooks,
    });
  } catch (error) {
    console.error("Error in likeBook:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});


export const laterRead = asyncHandler(async (req, res) => {
  try {
    const { bookId, title, author, thumbnail } = req.body;
    const userId = req.user._id;

    if (!bookId) {
      return res.status(400).json({ message: "Missing bookId" });
    }

    let laterReadDoc = await LaterRead.findById(userId);

    if (!laterReadDoc) {
      laterReadDoc = new LaterRead({ _id: userId, laterReads: [] });
    }

    const existingIndex = laterReadDoc.laterReads.findIndex(
      (book) => book.bookId === bookId
    );

    if (existingIndex !== -1) {
      // If the book is already in the list, remove it (toggle remove)
      laterReadDoc.laterReads.splice(existingIndex, 1);
      await laterReadDoc.save();
      return res.status(200).json({
        message: "Book removed from Later Reads",
        laterReads: laterReadDoc.laterReads,
      });
    } else {
      // If the book is not in the list, add it (toggle add)
      laterReadDoc.laterReads.push({ bookId, title, author, thumbnail });
      await laterReadDoc.save();
      return res.status(200).json({
        message: "Book added to Later Reads",
        laterReads: laterReadDoc.laterReads,
      });
    }
  } catch (error) {
    console.error("Error in laterRead:", error.message);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});


