import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";
import { User } from "../models/userModel.js";


export const protect = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "No token provided, access denied",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("JWT Error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired, please log in again",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Invalid token, please log in again",
      });
    }

    return res.status(401).json({
      success: false,
      message: "Token verification failed",
    });
  }
});

// Restrict to admin users only
export const adminOnly = (req, res, next) => {
  if (req.user?.role === "admin") {
    return next();
  }

  return res.status(403).json({
    success: false,
    message: "Access denied: Admins only",
  });
};
