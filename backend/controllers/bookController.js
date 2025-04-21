import { Book } from '../models/bookModel';
import asyncHandler from 'express-async-handler';

// Create a new book
export const createBook = asyncHandler(async (req, res) => {
  const { bookId, title, authors, publisher, publishedDate, description, pageCount, categories, thumbnail, previewLink, isbn } = req.body;

  try {
    const existingBook = await Book.findOne({ bookId });

    if (existingBook) {
      return res.status(400).json({ message: 'Book already exists!' });
    }

    const book = new Book({
      bookId,
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
    });

    await book.save();

    res.status(201).json({ message: 'Book created successfully!', book });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get all books (with optional search/filtering by title or author)
export const getBooks = asyncHandler(async (req, res) => {
  const { title, author } = req.query;

  try {
    let query = {};

    if (title) {
      query.title = { $regex: title, $options: 'i' }; // Case-insensitive search by title
    }

    if (author) {
      query.authors = { $in: [author] }; // Filter by author
    }

    const books = await Book.find(query);

    res.status(200).json(books);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
});

// Get a single book by bookId
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

// Update a book's information
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

// Delete a book by bookId
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

// Get user rating for a book (from your existing function)
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

// Rate a book (from your existing function)
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
