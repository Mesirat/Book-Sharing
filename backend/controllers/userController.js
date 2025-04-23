import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import generateVerificationToken from "../utils/generateVerificationToken.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { catchError } from "rxjs";
import nodemailer from "nodemailer";
import path from "path";
import multer from "multer";
import fs from "fs";
const validateFields = (fields) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      throw new Error(`${key} is required`);
    }
  }
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = "uploads";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }

    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, `${req.user._id}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedExtensions = /png|jpg|jpeg/;
  const extname = allowedExtensions.test(
    path.extname(file.originalname).toLowerCase()
  ); // Check file extension

  if (extname) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only PNG, JPG, and JPEG files are allowed."
      ),
      false
    ); // Reject the file
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
const JWT_SECRET = process.env.JWT_SECRET;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET;
const JWT_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    if (!id) {
      return res.status(404).json({ message: "User ID is not found" });
    }
    const user = await User.findById(id);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Could not retrieve user." });
  }
};


export const signUp = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: "User already exists" });
  }


  const user = await User.create({
    name,
    email,
    password
  });

 
  const userWithoutPassword = { ...user._doc, password: undefined };

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user: userWithoutPassword,
  });
});


export const verifyEmail = asyncHandler(async (req, res) => {
  try {
    const { code } = req.body;
    validateFields({ code });

    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid verification token" });
    }
    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiresAt = undefined;
    await user.save();

    await sendWelcomeEmail(user.email, user.name);

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export const logIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
 
  if (!user) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
   if (!isValidPassword) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  const token = generateToken(res, user._id);
  const refreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });

  user.lastLogin = new Date();
  user.refreshToken = refreshToken;
  await user.save();

  res.status(200).json({
    success: true,
    isLoggedIn: true,
    user: { ...user._doc, password: undefined },
    token,
    refreshToken,
  });
});


export const getProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  res.status(200).json({ user });
});

export const updateProfile = async (req, res) => {
  const { userId, name, lastName, phone, email, country } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ message: "Email already in use." });
      }
      user.email = email;
    }

    if (name && name.trim()) user.name = name.trim();
    if (lastName && lastName.trim()) user.LastName = lastName.trim();
    if (phone && phone.trim()) user.phone = phone.trim();
    if (country && country.trim()) user.country = country.trim();

    await user.save();

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        lastName: user.LastName,
        email: user.email,
        phone: user.phone,
        country: user.country,
      },
      message: "Profile updated successfully!",
    });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ message: "Failed to update profile", error: err.message });
  }
};

export const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(403)
        .json({ success: false, message: "Refresh token is required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }

    const user = await User.findById(decoded.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }

    const accessToken = jwt.sign({ id: decoded.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const newRefreshToken = jwt.sign(
      { id: decoded.id },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      success: true,
      message: "Tokens refreshed successfully",
      accessToken,
      refreshToken: newRefreshToken,
    });
  } catch (err) {
    console.error("Error in refreshToken:", err);
    res.status(403).json({
      success: false,
      message: "Invalid or expired refresh token",
      error: err.message,
    });
  }
};

export const logOut = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (refreshToken) {
      await invalidateToken(refreshToken);
    }

    res.clearCookie("refreshToken");
    res.json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ success: false, message: "Failed to log out" });
  }
};

export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }
  try {
    const resetToken = crypto.randomBytes(20).toString("hex");

    const resetTokenExpiresAt = Date.now() + 15 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save({ validateBeforeSave: false });

    await sendPasswordResetEmail(
      user.email,
      `http://localhost:3000/resetPassword/${resetToken}`
    );

    res.status(200).json({ success: true, message: "Email sent to user" });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save({ validateBeforeSave: false });
    res.status(400).json({ success: false, message: error.message });
  }
});

export const resetPassword = asyncHandler(async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpiresAt: { $gt: Date.now() },
    });
    if (!user) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid or expired reset token" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpiresAt = undefined;
    await user.save();
    await sendResetSuccessEmail(user.email);
    res
      .status(200)
      .json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export const checkAuth = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error("Error in checkAuth:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
};

export const Contact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: email,
      to: process.env.EMAIL_RECEIVER,
      subject: `Contact Form Submission from ${name}`,
      text: message,
    });

    res.status(200).json({ message: "Message sent successfully!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to send message", error: error.message });
  }
});

export const updateProfilePicture = [
  upload.single("profileImage"),
  asyncHandler(async (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const filePath = `/uploads/${req.file.filename}`;

    try {
      const user = await User.findById(req.user._id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      if (user.profileImage) {
        const oldImagePath = path.join(__dirname, "..", user.profileImage);
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
        }
      }

      user.profileImage = filePath;
      await user.save();

      // Send updated profile image URL as response
      res.json({
        message: "Profile image updated successfully",
        profileImage: filePath,
        user: {
          ...user._doc,
          password: undefined, // Exclude password from the response
        },
      });
    } catch (error) {
      console.error("Error updating profile picture:", error);
      res.status(500).json({ message: "Server error: " + error.message });
    }
  }),
];
export const getLaterReads = asyncHandler(async (req, res) => {
  try {
    const userId = req.user?._id;
    console.log("User ID in Request:", userId); // Log the user ID to check if it's valid

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid or missing user ID" });
    }

    console.log(`Fetching Later Reads for User ID: ${userId}`);

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User fetched from DB:", user); // Log the user object to verify

    // Return laterReads or an empty array if it's undefined
    res.status(200).json({ laterReads: user.laterReads || [] });
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

    console.log("User ID from Token:", userId); // Log the user ID

    // Check if userId exists and is valid
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: "Invalid User ID format" });
    }

    console.log("Fetching Liked Books for User ID:", userId); // Log the user ID for debugging

    const user = await User.findById(userId).select("likedBooks");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    console.log("User Found:", user); // Log the user object for debugging

    res.status(200).json({ likedBooks: user.likedBooks || [] });
  } catch (error) {
    console.error("Error fetching Liked Books:", error); // Log detailed error message
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
    const userId = req.user._id; // This will no longer throw an error

    if (!bookId || !title || !author || !thumbnail) {
      return res.status(400).json({ message: "Missing book details" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Proceed with the like/unlike logic...
  } catch (error) {
    console.error("Error in likeBook:", error);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});

export const laterRead = asyncHandler(async (req, res) => {
  try {
    const { bookId, title, author, thumbnail } = req.body;
    const userId = req.user._id;

    if (!bookId || !title || !author || !thumbnail) {
      return res.status(400).json({ message: "Missing book details" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the book already exists in the laterReads list
    const existingIndex = user.laterReads.findIndex(
      (book) => book.bookId.toString() === bookId
    );

    if (existingIndex !== -1) {
      // Remove the book from the laterReads list
      user.laterReads.splice(existingIndex, 1);
      await user.save();

      return res.status(200).json({
        message: "Book removed from Later Reads",
        laterReads: user.laterReads,
      });
    }

    // Add the book to the laterReads list
    user.laterReads.push({ bookId, title, author, thumbnail });
    await user.save();

    res.status(200).json({
      message: "Book added to Later Reads",
      laterReads: user.laterReads,
    });
  } catch (error) {
    console.error("Error in laterRead:", error.message);
    res.status(500).json({ message: "Server error: " + error.message });
  }
});
