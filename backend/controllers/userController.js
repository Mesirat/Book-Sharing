import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import mongoose from "mongoose";
import { ReadingProgress } from "../models/user/readingProgressModel.js";
import bcrypt from "bcryptjs";
import cookieParser from "cookie-parser";
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
import axios from "axios";  
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

export const createUser = async ({ name, email, password ,mustChangePassword}) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return { exists: true };
  }

  const user = new User({ name, email, password ,mustChangePassword});
  await user.save();

  return { exists: false };
};


export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const user = await createUser({ name, email, password });
    generateToken(res, user);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
    });
  } catch (error) {
    res.status(400).json({ message: "User registration failed.", error });
  }
};

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
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      lastLogin: user.lastLogin,
      
    },
    token,
    refreshToken,
    mustChangePassword: user.mustChangePassword,
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

// export const updateProfilePicture = [
//   upload.single("profileImage"),
//   asyncHandler(async (req, res) => {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const filePath = `/uploads/${req.file.filename}`;

//     try {
//       const user = await User.findById(req.user._id);
//       if (!user) {
//         return res.status(404).json({ message: "User not found" });
//       }

//       if (user.profileImage) {
//         const oldImagePath = path.join(__dirname, "..", user.profileImage);
//         if (fs.existsSync(oldImagePath)) {
//           fs.unlinkSync(oldImagePath);
//         }
//       }

//       user.profileImage = filePath;
//       await user.save();

//       res.json({
//         message: "Profile image updated successfully",
//         profileImage: filePath,
//         user: {
//           ...user._doc,
//           password: undefined,
//         },
//       });
//     } catch (error) {
//       console.error("Error updating profile picture:", error);
//       res.status(500).json({ message: "Server error: " + error.message });
//     }
//   }),
// ];

export const updateProgress = asyncHandler( async (req, res) => {
  const { currentPage, totalPages } = req.body;
  const { bookId } = req.params;

  try {
    const updated = await ReadingProgress.findOneAndUpdate(
      { user: req.user._id, book: bookId },
      { currentPage, totalPages },
      { new: true, upsert: true }
    );
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update progress" });
  }
});

export const getProgress = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  try {
    const progress = await ReadingProgress.findOne({
      user: req.user._id,
      book: bookId
    }).lean();

    if (!progress) {
      return res.status(404).json({ message: "Progress not found" });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reading progress" });
  }
});
export const getAllProgress = asyncHandler(async (req, res) => {
  try {
    const progress = await ReadingProgress.find({ user: req.user._id })
      .populate("book")
      .lean();

    if (!progress) {
      return res.status(404).json({ message: "No progress found" });
    }

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch reading progress" });
  }
});
export const changePassword = async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(userId);
  if (!user) return res.status(404).json({ message: "User not found" });

  const isMatch = await user.matchPassword(currentPassword);
  if (!isMatch) return res.status(401).json({ message: "Incorrect current password" });

  user.password = newPassword; 
  user.mustChangePassword = false;
  await user.save();

  res.status(200).json({ message: "Password changed successfully" });
};
export const streamPDF = async (req, res) => {
  const { publicId } = req.params;

  try {
    const cloudinaryURL = `https://res.cloudinary.com/${process.env.CLOUD_NAME}/raw/upload/${publicId}`;

    const response = await axios.get(cloudinaryURL, {
      responseType: "stream",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", "inline; filename=" + publicId + ".pdf");

    response.data.pipe(res);
  } catch (err) {
    console.error("PDF stream error", err);
    res.status(500).send("Error streaming PDF");
  }
};
