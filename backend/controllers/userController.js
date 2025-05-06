import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { ReadingProgress } from "../models/user/readingProgressModel.js";
import { News } from "../models/user/newsModel.js";
import {
  sendPasswordResetEmail,
  sendResetSuccessEmail,
  sendVerificationEmail,
  sendWelcomeEmail,
} from "../mailtrap/emails.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { LikedBook } from "../models/user/likedBookModel.js";
import { LaterRead } from "../models/user/laterReadModel.js";
import { Group } from "../models/groupModel.js";
import {v2 as cloudinary} from "cloudinary";
import { generateToken,generateRefreshToken } from "../utils/generateToken.js";
import axios from "axios";
const validateFields = (fields) => {
  for (const [key, value] of Object.entries(fields)) {
    if (!value) {
      throw new Error(`${key} is required`);
    }
  }
};


export const registerUser = async (req, res) => {
  const { firstName,lastName, email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const user = new User({ firstName,lastName, email, password });
    await user.save();

    const token = generateToken(res, user._id);
    const refreshToken = generateRefreshToken(res, user._id);

    user.refreshToken = refreshToken;
    await user.save();

    res.status(201).json({
      success: true,
      user: {
        _id: user._id,
        name: user.firstName,
        email: user.email,
        role: user.role,
      },
      token,
      refreshToken,
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(400).json({ success: false, message: "User registration failed.", error: error.message });
  }
};

export const logIn = asyncHandler(async (req, res) => {
  const { email, password, isAdmin } = req.body;

  try {
    validateFields({ email, password });

    const user = await User.findOne({ email });

    if (!user) {
      console.error("Login failed: User not found for email:", email);
      return res.status(401).json({ success: false, message: "Invalid credentials" });
    }

    if (isAdmin && user.role !== "admin") {
      console.error("Login failed: User is not an admin:", email);
      return res.status(403).json({ success: false, message: "Access denied: Admins only" });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      console.error("Login failed: Invalid password for email:", email);
      return res.status(401).json({ success: false, message: "Invalid credentials" });
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
        email: user.email,
        role: user.role,
        lastLogin: user.lastLogin,
        profileImage: user.profileImage,
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
      console.warn("No user in logout request, clearing cookies only. Headers:", req.headers, "Cookies:", req.cookies);
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
      return res.status(400).json({ success: false, message: "Invalid user ID format" });
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
    res.status(500).json({ success: false, message: "Failed to fetch reading progress" });
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



export const getProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
    role: req.user.role,
    profilePic: req.user.profileImage,
  };
  res.status(200).json({ success: true, user });
});

export const updateProfile = async (req, res) => {
  const { userId, name, lastName, phone, email } = req.body;

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
      user.email = email;
    }

    if (name && name.trim()) user.name = name.trim();
    if (lastName && lastName.trim()) user.LastName = lastName.trim();
    if (phone && phone.trim()) user.phone = phone.trim();
    if (country && country.trim()) user.country = country.trim();

    await user.save();

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        lastName: user.LastName,
        email: user.email,
        phone: user.phone,
        country: user.country,
        role: user.role,
      },
      message: "Profile updated successfully!",
    });
  } catch (err) {
    console.error("Update profile error:", err);
    res
      .status(500)
      .json({
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
   
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    
    const decoded = jwt.verify(token, JWT_SECRET);
    if (!decoded || !decoded.id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const user = await User.findById(decoded.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
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




export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetTokenExpiresAt = Date.now() + 15 * 60 * 1000;
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpiresAt = resetTokenExpiresAt;

    await user.save({ validateBeforeSave: false });

    await sendPasswordResetEmail(
      user.email,
      `http://localhost:3000/resetPassword/${resetToken}`
    );

    res
      .status(200)
      .json({ success: true, message: "Password reset email sent" });
  } catch (error) {
    console.error("Forgot password error:", error);
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
    console.error("Reset password error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});


export const Contact = asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
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

    res
      .status(200)
      .json({ success: true, message: "Message sent successfully!" });
  } catch (error) {
    console.error("Contact error:", error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to send message",
        error: error.message,
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

    user.password = await bcrypt.hash(newPassword, 10);
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

export const createUser = async ({
  firstName,
  lastName,
  email,
  password,
  mustChangePassword,
}) => {
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return { exists: true };
  }

  const user = new User({ firstName, lastName, email, password, mustChangePassword });
  await user.save();

  return { exists: false, user };
};