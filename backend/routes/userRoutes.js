import express from "express";
import {
  logOut,
  getProfile,
  getUserById,
  verifyEmail,
  signUp,
  logIn,
  forgotPassword,
  resetPassword,
  checkAuth,
  refreshToken,
  updateProfile,
  Contact,
  updateProfilePicture,
  getProgress,
  updateProgress,
  getAllProgress,
} from "../controllers/userController.js";

import rateLimit from "express-rate-limit";
import { protect } from "../middleware/authMiddleware.js";
import  {uploadBookAssets}  from "../middleware/uploadMiddleware.js"; 

const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Please try again later.",
});

router.post("/signup", signUp);
router.post("/login", loginLimiter, logIn);
router.post("/logout", logOut);
router.post("/verifyEmail", verifyEmail);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);
router.get("/checkAuth", protect, checkAuth);
router.put("/updateProfile", protect, updateProfile);
router.post("/refreshToken", refreshToken);
router.get("/getProgress/:bookId", protect, getProgress);
router.post("/updateProgress/:bookId", protect, updateProgress);
router.get("/getAllProgress", protect, getAllProgress);
router.get("/:id", getUserById);
router.post("/contact", Contact);
router.put(
  "/updateProfilePicture",
  uploadBookAssets.single("userProfile"),
  updateProfilePicture
);

export default router;
