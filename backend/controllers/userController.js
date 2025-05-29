import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ReadingProgress } from "../models/user/readingProgressModel.js";
import { News } from "../models/user/newsModel.js";

import crypto from "crypto";
import nodemailer from "nodemailer";
import { LikedBook } from "../models/user/likedBookModel.js";
import { LaterRead } from "../models/user/laterReadModel.js";
import { Group } from "../models/groupModel.js";
import { v2 as cloudinary } from "cloudinary";
import { generateToken, generateRefreshToken } from "../utils/generateToken.js";
import axios from "axios";
import {Report} from "../models/reportModel.js";
const validateFields = (fields) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      throw new Error(`${key} is required`);
    }
  }
};

export const logIn = asyncHandler(async (req, res) => {
  const { username, password, isAdmin } = req.body;

  try {
    validateFields({ username, password });

    const user = await User.findOne({ username });

    if (!user) {
     
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    if (isAdmin && user.role !== "admin") {
     
      return res
        .status(403)
        .json({ success: false, message: "Access denied" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.error("Login failed: Invalid Credentials ");
      return res
        .status(401)
        .json({ success: false, message: "Invalid credentials" });
    }

    const token = generateToken(res, user._id);
    const refreshToken = generateRefreshToken(res, user._id);

    user.lastLogin = new Date();
    user.refreshToken = refreshToken;
    await user.save();

    res.status(200).json({
      success: true,
      isLoggedIn: true,
      token,
      refreshToken,
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName:user.lastName,
        username:user.username,
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
        profileImage: user.profileImage,
        phone:user.phone,
      },
      mustChangePassword: user.mustChangePassword,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(400).json({ success: false, message: error.message });
  }
});

export const logOut = asyncHandler(async (req, res) => {
  try {
    if (req.user && req.user._id) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.refreshToken = null;
        await user.save();
        console.log("Logout successful for user:", req.user._id);
      } else {
        console.warn("User not found for ID:", req.user._id);
      }
    } else {
      console.warn(
        "No user in logout request, clearing cookies only. Headers:",
        req.headers,
        "Cookies:",
        req.cookies
      );
    }

    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res.status(200).json({ success: true, message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ success: false, message: "Failed to log out" });
  }
});

export const getAllProgress = asyncHandler(async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.user._id)) {
      console.error("Invalid user ID in getAllProgress:", req.user._id);
      return res
        .status(400)
        .json({ success: false, message: "Invalid user ID format" });
    }

    const progress = await ReadingProgress.find({ user: req.user._id })
      .populate("book")
      .lean();

    if (!progress || progress.length === 0) {
      return res.status(200).json({ success: true, progress: [] });
    }

    res.json({ success: true, progress });
  } catch (error) {
    console.error("Get all progress error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch reading progress" });
  }
});

export const getAllBlogs = asyncHandler(async (req, res) => {
  try {
    const blogs = await News.find().sort({ date: -1 });
    res.status(200).json({ success: true, blogs });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({ success: false, message: "Failed to fetch blogs" });
  }
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

export const updateProfile = async (req, res) => {
  const { firstName, lastName, phone, email } = req.body;
  const userId = req.user._id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (email && email !== user.email) {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res
          .status(400)
          .json({ success: false, message: "Email already in use." });
      }
    }

    const updateData = {};
    if (firstName && firstName.trim()) updateData.firstName = firstName.trim();
    if (lastName && lastName.trim()) updateData.lastName = lastName.trim();
    if (phone && phone.trim()) updateData.phone = phone.trim();
    if (email && email.trim()) updateData.email = email.trim();

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      user: {
        _id: updatedUser._id,
        firstName: updatedUser.firstName,
        lastName: updatedUser.lastName,
        email: updatedUser.email,
        phone: updatedUser.phone,
        country: updatedUser.country,
        role: updatedUser.role,
        profilePic: updatedUser.profileImage,
      },
      message: "Profile updated successfully!",
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: err.message,
    });
  }
};

export const refreshToken = asyncHandler(async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(403)
        .json({ success: false, message: "Refresh token is required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user || user.refreshToken !== refreshToken) {
      return res
        .status(403)
        .json({ success: false, message: "Invalid or expired refresh token" });
    }

    const accessToken = jwt.sign({ id: user._id }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const newRefreshToken = jwt.sign({ id: user._id }, JWT_REFRESH_SECRET, {
      expiresIn: REFRESH_TOKEN_EXPIRES_IN,
    });

    user.refreshToken = newRefreshToken;
    await user.save();

    res.json({
      success: true,
      token: accessToken,
      refreshToken: newRefreshToken,
      user: {
        _id: user._id,
        firstName: user.firstName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Error in refreshToken:", err);
    res.status(403).json({
      success: false,
      message: "Invalid or expired refresh token",
      error: err.message,
    });
  }
});
export const checkAuth = asyncHandler(async (req, res) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(decoded.id).select("-password");
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
});




export const updateProfilePicture = asyncHandler(async (req, res) => {
  const localFilePath = req.files?.thumbnail?.[0]?.path;

  if (!req.user || !req.user._id) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    if (user.cloudinaryPublicId) {
      await cloudinary.uploader.destroy(user.cloudinaryPublicId);
    }

    let uploaded = null;

    if (localFilePath) {
      uploaded = await cloudinary.uploader.upload(localFilePath, {
        folder: "profile_pics",
      });

      user.profileImage = uploaded.secure_url;
      user.cloudinaryPublicId = uploaded.public_id;
    }

    await user.save();

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      success: true,
      message: "Profile image updated successfully",
      profileImage: user.profileImage,
      user: userObj,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
});

export const updateProgress = asyncHandler(async (req, res) => {
  const { currentPage, totalPages } = req.body;
  const { bookId } = req.params;

  try {
    const updated = await ReadingProgress.findOneAndUpdate(
      { user: req.user._id, book: bookId },
      { currentPage, totalPages },
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, progress: updated });
  } catch (err) {
    console.error("Update progress error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to update progress" });
  }
});

export const getProgress = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  try {
    const progress = await ReadingProgress.findOne({
      user: req.user._id,
      book: bookId,
    }).lean();

    if (!progress) {
      return res
        .status(404)
        .json({ success: false, message: "Progress not found" });
    }

    res.json({ success: true, progress });
  } catch (error) {
    console.error("Get progress error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch reading progress" });
  }
});

export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Incorrect current password" });
    }

    user.password = newPassword;
    await user.save();
    user.mustChangePassword = false;
    await user.save();

    res
      .status(200)
      .json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to change password" });
  }
});

export const streamPDF = asyncHandler(async (req, res) => {
  const { publicId } = req.params;

  try {
    const cloudinaryURL = `https://res.cloudinary.com/${process.env.CLOUD_NAME}/raw/upload/${publicId}`;

    const response = await axios.get(cloudinaryURL, {
      responseType: "stream",
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `inline; filename=${publicId}.pdf`);
    res.setHeader("Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    response.data.pipe(res);
  } catch (err) {
    console.error("PDF stream error:", err);
    res.status(500).json({ success: false, message: "Error streaming PDF" });
  }
});

export const createProgress = asyncHandler(async (req, res) => {
  const { bookId, currentPage, totalPages } = req.body;

  try {
    const newProgress = new ReadingProgress({
      user: req.user._id,
      book: new mongoose.Types.ObjectId(bookId),
      currentPage,
      totalPages,
    });

    await newProgress.save();
    res.status(201).json({ success: true, progress: newProgress });
  } catch (err) {
    console.error("Create progress error:", err);
    res
      .status(500)
      .json({ success: false, message: "Error creating progress" });
  }
});

export const getUserStats = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "Not authorized, user not found" });
  }

  const userId = req.user._id;

  try {
    const liked = await LikedBook.findOne({ _id: userId });
    const likedBook = liked && liked.likedBooks ? liked.likedBooks.length : 0;

    const later = await LaterRead.findOne({ _id: userId });
    const laterRead = later && later.laterReads ? later.laterReads.length : 0;

    const groupsJoined = await Group.countDocuments({ members: userId });

    res.json({
      success: true,

      likedBook,
      groupsJoined,
      laterRead,
    });
  } catch (error) {
    console.error("Get user stats error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch user stats" });
  }
});

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user ID format" });
    }

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    res.status(200).json({ success: true, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Could not retrieve user." });
  }
};


export const submitReport = asyncHandler(async (req, res) => {
  if (!req.user || !req.user._id) {
    return res.status(401).json({ success: false, message: "Not authorized" });
  }

  const uploaded = req.files?.thumbnail?.[0]?.path || null;


  try {
    const newReport = await Report.create({
      user: req.user._id,
      type: req.body.type,
      description: req.body.description,
      screenshotUrl: uploaded,
     
    });

    res.status(201).json({
      success: true,
      message: "Report submitted successfully",
      report: newReport,
    });
  } catch (error) {
    console.error("Error submitting report:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error: " + error.message });
  }
});
export const getMyReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch reports." });
  }
};
