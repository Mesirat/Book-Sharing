import { Book } from "../models/bookModel.js";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import mongoose from "mongoose";
import { LikedBook } from "../models/user/likedBookModel.js";
import { LaterRead } from "../models/user/laterReadModel.js";
import { BookRead } from "../models/bookReadModel.js";

const GOOGLE_BOOKS_API_URL = "https://www.googleapis.com/books/v1/volumes";

export const getBooks = asyncHandler(async (req, res) => {
  const { title, author } = req.query;

  try {
    let query = {};

    if (title) {
      query.title = { $regex: title, $options: "i" };
    }

    if (author) {
      query.authors = { $in: [author] };
    }

    const books = await Book.find(query);

    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

export const getBookById = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  try {
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID" });
    }

    const book = await Book.findById(bookId);

    if (!book) {
      return res.status(404).json({ message: "Book not found!" });
    }

    res.status(200).json(book);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

export const updateBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const {
    title,
    authors,
    publisher,
    publishedDate,
    description,
    pageCount,
    categories,
    thumbnail,
    previewLink,
    isbn,
  } = req.body;

  try {
    const book = await Book.findOne({ bookId });

    if (!book) {
      return res.status(404).json({ message: "Book not found!" });
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

    res.status(200).json({ message: "Book updated successfully!", book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

export const deleteBook = asyncHandler(async (req, res) => {
  const { bookId } = req.params;

  try {
    const book = await Book.findOne({ bookId });

    if (!book) {
      return res.status(404).json({ message: "Book not found!" });
    }

    await book.remove();

    res.status(200).json({ message: "Book deleted successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
});

export const getBookRating = asyncHandler(async (req, res) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return res.status(404).json({ message: "Book not found" });

    res.status(200).json({
      averageRating: book.averageRating,
      ratingsCount: book.ratingsCount,
    });
  } catch (err) {
    console.error("Error getting rating:", err);
    res.status(500).json({ message: "Server error", error: err });
  }
});

export const ratingBooks = asyncHandler(async (req, res) => {
  const { bookId, userId, rating } = req.body;

  const book = await Book.findById(bookId);
  if (!book) return res.status(404).json({ message: "Book not found" });

  const existingRating = book.ratings.find(
    (r) => r.userId.toString() === userId
  );

  if (existingRating) {
    existingRating.rating = rating;
  } else {
    book.ratings.push({ userId, rating });
  }

  // Recalculate averageRating and ratingsCount
  const totalRatings = book.ratings.length;
  const sumRatings = book.ratings.reduce((acc, curr) => acc + curr.rating, 0);

  book.averageRating = sumRatings / totalRatings;
  book.ratingsCount = totalRatings;

  await book.save();

  res.status(200).json({
    message: existingRating
      ? "Rating updated successfully!"
      : "Rating submitted successfully!",
    averageRating: book.averageRating,
    ratingsCount: book.ratingsCount,
  });
});

export const bookSearch = asyncHandler(async (req, res) => {
  try {
    const { query, category, page = 1, limit = 6 } = req.query;

    const searchFilter = {};

    if (query) {
      searchFilter.$or = [
        { title: { $regex: query, $options: "i" } },
        { authors: { $regex: query, $options: "i" } },
        { categories: { $regex: query, $options: "i" } },
      ];
    }

    if (category) {
      const parts = category.split(",").map((p) => p.trim());
      searchFilter.categories = { $all: parts };
    }

    const totalCount = await Book.countDocuments(searchFilter);
    const books = await Book.find(searchFilter)
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.json({
      books,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: Number(page),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch books" });
  }
});

export const getLaterReads = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }

    const laterReadDoc = await LaterRead.findById(userId).select("laterReads");

    if (!laterReadDoc) {
      return res.status(200).json({ laterReads: [], totalPages: 0 });
    }
    const totalBooks = laterReadDoc.laterReads.length;
    const paginatedBooks = laterReadDoc.laterReads.slice(skip, skip + limit);
    res.status(200).json({
      laterReads: paginatedBooks,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: page,
    });
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
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 8;
    const skip = (page - 1) * limit;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    const likedDoc = await LikedBook.findById(userId).select("likedBooks");

    if (!likedDoc || !likedDoc.likedBooks) {
      return res.status(200).json({ likedBooks: [], totalPages: 0 });
    }

    const totalBooks = likedDoc.likedBooks.length;
    const paginatedBooks = likedDoc.likedBooks.slice(skip, skip + limit);

    res.status(200).json({
      likedBooks: paginatedBooks,
      totalPages: Math.ceil(totalBooks / limit),
      currentPage: page,
    });
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

    const { bookId, title, authors, thumbnail, description } = req.body;
    const userId = req.user._id;

    if (!bookId || !title || !authors || !thumbnail) {
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
      likedDoc.likedBooks.splice(existingIndex, 1);
      await likedDoc.save();

      return res.status(200).json({
        message: "Book removed from Liked Books",
        likedBooks: likedDoc.likedBooks,
      });
    }

    likedDoc.likedBooks.push({
      bookId,
      title,
      authors,
      thumbnail,
      description,
    });
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
    const { bookId, title, authors, thumbnail, description } = req.body;
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
      laterReadDoc.laterReads.splice(existingIndex, 1);
      await laterReadDoc.save();
      return res.status(200).json({
        message: "Book removed from Later Reads",
        laterReads: laterReadDoc.laterReads,
      });
    } else {
      laterReadDoc.laterReads.push({
        bookId,
        title,
        authors,
        thumbnail,
        description,
      });
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
export const markBookAsRead = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  const userId = req.user._id;

  try {
    const alreadyRead = await BookRead.findOne({ userId, bookId });

    if (!alreadyRead) {
      await Book.findByIdAndUpdate(bookId, { $inc: { readCount: 1 } });

      await BookRead.create({ userId, bookId });
    }

    res.status(200).json({ message: "Marked as read (if not already)" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to mark as read", error: error.message });
  }
});
export const getTopRead = asyncHandler(async (req, res) => {
  try {
    const topBooks = await Book.find().sort({ readCount: -1 }).limit(4);

    res.json(topBooks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch Top Reads" });
  }
});

export const getMostLikedBooks = asyncHandler(async (req, res) => {
  try {
    const result = await LikedBook.aggregate([
      { $unwind: "$likedBooks" },
      {
        $group: {
          _id: "$likedBooks.bookId",
          title: { $first: "$likedBooks.title" },
          authors: { $first: "$likedBooks.authors" },
          thumbnail: { $first: "$likedBooks.thumbnail" },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 8 },
    ]);

    res.status(200).json(result);
  } catch (error) {
    console.error("Failed to fetch most liked book:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});
