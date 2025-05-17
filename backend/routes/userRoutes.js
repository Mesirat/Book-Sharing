import express from "express";
import {
  logOut,

  getUserById,
  verifyEmail,
  logIn,

  checkAuth,
  refreshToken,
  updateProfile,

  getProgress,
  updateProgress,
  getAllProgress,
  changePassword,
  streamPDF,
  createProgress,
  getAllBlogs,
  getUserStats,
  updateProfilePicture,
  submitReport,
} from "../controllers/userController.js";

import rateLimit from "express-rate-limit";
import { protect } from "../middleware/authMiddleware.js";
import { uploadBookAssets } from "../middleware/uploadMiddleware.js";
import { create } from "domain";

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Too many login attempts. Please try again later.",
});

router.post("/login", loginLimiter, logIn);
router.post("/logout", logOut);
router.get("/check-auth", checkAuth);

router.put("/updateProfile", protect, updateProfile);
router.put(
  "/updateProfilePicture",
  protect,
  uploadBookAssets.fields([{ name: "thumbnail", maxCount: 1 }]),
  updateProfilePicture
);
router.post("/refreshToken", refreshToken);
router.get("/getBlogs", getAllBlogs);

router.get("/userStats", protect, getUserStats);
router.post("/createProgress", protect, createProgress);
router.get("/getProgress/:bookId", protect, getProgress);
router.put("/updateProgress/:bookId", protect, updateProgress);
router.get("/getAllProgress", protect, getAllProgress);
router.post("/report", uploadBookAssets.fields([{ name: "thumbnail", maxCount: 1 }]), protect,submitReport )

router.get("/:id", protect, getUserById);

router.put("/changePassword", protect, changePassword);
router.get("/pdf/:publicId(*)", streamPDF);

router.post("/verifyEmail", verifyEmail);

export default router;
