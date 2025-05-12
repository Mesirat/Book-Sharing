import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
import { Report } from "../models/reportModel.js";
import { Book } from "../models/bookModel.js";
import { News } from "../models/user/newsModel.js";
import dotenv from "dotenv";
import csv from "csv-parser";
import fs from "fs";
import { createUser, registerUser } from "./userController.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import path from "path";
import { Group } from "../models/groupModel.js";
import cloudinary from 'cloudinary'; 

dotenv.config();

function generatePassword(length = 8) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += characters.charAt(
      Math.floor(Math.random() * characters.length)
    );
  }
  return password;
}

export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalBooks = await Book.countDocuments();
  res.json({ totalUsers, totalBooks });
});

export const changeUserRole = asyncHandler(async (req, res) => {
  const { role } = req.body;

  if (!["user", "admin"].includes(role)) {
    return res.status(400).json({ message: "Invalid role" });
  }

  const user = await User.findById(req.params.id);
  if (!user) throw new Error("User not found");

  user.role = role;
  await user.save();

  res.json({ message: "User role updated", user });
});
export const deleteBook = asyncHandler(async (req, res) => {
  await Book.findByIdAndDelete(req.params.id);
  res.json({ message: "Book deleted" });
});


export const updateBook = asyncHandler(async (req, res) => {
  try {
    const { title, description, publisher, publishedYear } = req.body;

    // Parse authors and categories if they exist in the body
    const authors = req.body.authors ? req.body.authors.split(",").map(s => s.trim()) : undefined;
    const categories = req.body.categories ? req.body.categories.split(",").map(s => s.trim()) : undefined;

    // Find the existing book to update
    const book = await Book.findById(req.params.id);
    if (!book) return res.status(404).json({ message: "Book not found" });

    const updates = {};

    // Apply updates from the body to the updates object
    if (title) updates.title = title;
    if (authors) updates.authors = authors;
    if (description) updates.description = description;
    if (publisher) updates.publisher = publisher;
    if (publishedYear) updates.publishedYear = publishedYear;
    if (categories) updates.categories = categories;

    // Handle thumbnail update (if a new one is uploaded)
    if (req.files?.thumbnail) {
      // If the book already has a cloudinary public ID, delete the old thumbnail
      if (book.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(book.cloudinaryPublicId);
      }

      // Upload the new thumbnail to Cloudinary
      const uploadedThumbnail = await cloudinary.uploader.upload(req.files.thumbnail[0].path, {
        folder: "book_thumbnails",
      });

      // Update the thumbnail and cloudinary public ID
      updates.thumbnail = uploadedThumbnail.secure_url;
      updates.cloudinaryPublicId = uploadedThumbnail.public_id;
    }

    // Handle PDF update (if a new one is uploaded)
    if (req.files?.pdfLink) {
      const pdfFile = req.files.pdfLink[0];

      // Validate PDF file type
      if (pdfFile.mimetype !== "application/pdf") {
        return res.status(400).json({ message: "Invalid file format for PDF. Only .pdf files allowed." });
      }

      // Update the PDF link (can store the file path or cloud storage URL)
      updates.pdfLink = pdfFile.path;
    }

    // Update the book document in the database
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, updates, { new: true });

    // Return the updated book
    res.status(200).json(updatedBook);
  } catch (err) {
    console.error("Update Book Error:", err);
    res.status(500).json({ message: "Internal server error. Could not update the book." });
  }
});



export const getAllReports = asyncHandler(async (req, res) => {
  const reports = await Report.find().populate("user", "firstName email");
  res.json(reports);
});
export const respondToReport = asyncHandler(async (req, res) => {
  const { response } = req.body;
  const report = await Report.findById(req.params.id);

  if (!report) {
    return res.status(404).json({ message: "Report not found" });
  }

  report.response = response;
  report.respondedAt = new Date();
  await report.save();

  res.json({ message: "Response submitted", report });
});

export const uploadUsers = asyncHandler(async (req, res) => {
  const users = [];
  const results = [];

  try {
    await new Promise((resolve, reject) => {
      fs.createReadStream(req.file.path)
        .pipe(csv())
        .on("data", (row) => users.push(row))
        .on("end", resolve)
        .on("error", reject);
    });

    for (const user of users) {
      const password = generatePassword();
      const [firstName, ...rest] = user.name.trim().split(" ");
      const lastName = rest.join(" ") || "";

      const result = await createUser({
        firstName: firstName,
        lastName: lastName,
        email: user.email,
        password,
        mustChangePassword: true,
      });

      if (result.exists) {
        results.push({
          firstName,
          lastName,
          email: user.email,
          password: "skipped (already exists)",
        });
      } else {
        results.push({
          firstName,
          lastName,
          email: user.email,
          password,
        });
      }
    }

    fs.unlinkSync(req.file.path);

    res.status(200).json({
      message: "Users uploaded successfully.",
      users: results,
    });
  } catch (error) {
    console.error("Upload failed:", error);
    res.status(500).json({ message: "User upload failed.", error });
  }
});
export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, "firstName email role isSuspended");
  res.json(users);
});
export const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.status(200).json(books);
});
export const UploadBook = asyncHandler(async (req, res) => {
  try {
    const {
      title,
      authors,
      publisher,
      publishedYear,
      description,
      categories,
    } = req.body;

    const authorsArray = authors?.split(",").map((a) => a.trim()) || [];
    const categoriesArray = categories?.split(",").map((c) => c.trim()) || [];

    const existingBook = await Book.findOne({
      title: title.trim(),
      authors: { $all: authorsArray },
    });

    if (existingBook) {
      return res.status(400).json({
        message: "Book already exists in the system.",
      });
    }

    const thumbnailPath = req.files?.thumbnail?.[0]?.path;
    const pdfFile = req.files?.pdf?.[0];

    const pdfPublicId = pdfFile?.filename;

    const book = new Book({
      title: title.trim(),
      authors: authorsArray,
      publisher,
      publishedYear,
      description,
      categories: categoriesArray,
      thumbnail: thumbnailPath,
      pdfLink: pdfPublicId,
    });

    await book.save();

    res.status(201).json({
      message: "Book uploaded",
      book,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Upload failed",
    });
  }
});
export const suspendUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isSuspended } = req.body;
  try {
    const user = await User.findByIdAndUpdate(
      id,
      { isSuspended },
      { new: true }
    );
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: "Unable to suspend user." });
  }
});
export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "User deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Unable to delete user." });
  }
});
export const uploadBlog = asyncHandler(async (req, res) => {
  try {
    const { title, description } = req.body;

    const thumbnailFile = req.files?.thumbnail?.[0];

    if (!thumbnailFile) {
      return res.status(400).json({ error: "Thumbnail is required." });
    }

    const newBlog = new News({
      title,
      description,
      thumbnail: thumbnailFile.path,
      date: new Date(),
    });

    await newBlog.save();

    res.status(201).json({ message: "Blog uploaded successfully." });
  } catch (error) {
    console.error("Error uploading blog:", error);
    res.status(500).json({ error: "Failed to upload blog" });
  }
});
export const getAdminStats = asyncHandler(async (req, res) => {
  try {
    const users = await User.countDocuments();
    const books = await Book.countDocuments();
    const groups = await Group.countDocuments();

    const topBooks = await Book.find().sort({ readCount: -1 }).limit(5);
    const topGroups = await Group.find().sort({ memberCount: -1 }).limit(5);

    res.json({
      users,
      books,
      groups,
      topBooks: topBooks.map((book) => ({
        title: book.title,
        readers: book.readCount,
        profilePic:book.thumbnail,
      })),
      topGroups: topGroups.map((group) => ({
        name: group.groupName,
        members: group.memberCount,
        profilePic:group.profilePic,
      })),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});
