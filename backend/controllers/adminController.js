import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
import { Report } from "../models/reportModel.js";
import { Book } from "../models/bookModel.js";
import dotenv from "dotenv";
import csv from "csv-parser";
import fs from "fs";
import { createUser, registerUser } from "./userController.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { v2 as cloudinary } from "cloudinary";

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

      const result = await createUser({
        name: user.name,
        email: user.email,
        password,
        mustChangePassword: true,
      });

      if (result.exists) {
        results.push({
          name: user.name,
          email: user.email,
          password: "skipped (already exists)",
        });
      } else {
        results.push({
          name: user.name,
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

export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalBooks = await Book.countDocuments();
  res.json({ totalUsers, totalBooks });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}, "name email role");
  res.json(users);
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
export const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.status(200).json(books);
});

export const updateBook = asyncHandler(async (req, res) => {
  const { title, author, description } = req.body;

  const book = await Book.findById(req.params.id);
  if (!book) return res.status(404).json({ message: "Book not found" });

  book.title = title || book.title;
  book.author = author || book.author;
  book.description = description || book.description;

  const updatedBook = await book.save();
  res.json(updatedBook);
});
export const getBookById = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate(
    "uploadedBy",
    "name email"
  );
  if (!book) return res.status(404).json({ message: "Book not found" });
  res.json(book);
});
export const getAllReports = asyncHandler(async (req, res) => {
  const reports = await Report.find().populate("user", "name email");
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
      pdfLink:pdfPublicId,
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