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
  likeBook,
  laterRead,
  getLaterReads,
  getLikedBooks,
} from "../controllers/userController.js";

import rateLimit from "express-rate-limit";
import {protect} from '../middleware/authMiddleware.js'
import  createUpload  from "../middleware/uploadMiddleware.js";
const router = express.Router();

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: "Too many login attempts. Please try again later.",
});
const upload = createUpload('profile')
router.post("/signup", signUp);
router.post("/login", loginLimiter, logIn);
router.post("/logout", logOut);
router.post("/verifyEmail", verifyEmail);
router.post("/forgotPassword", forgotPassword);
router.post("/resetPassword/:token", resetPassword);
router.get("/checkAuth", protect, checkAuth);
router.put("/updateProfile", protect, updateProfile);
router.post("/refreshToken", refreshToken);
router.put('/likeBook',protect, likeBook);
router.put('/laterRead',protect,laterRead);
router.get("/:id", getUserById);
router.post("/contact", Contact);
router.get('/laterReads', protect, getLaterReads);
router.get('/likedBooks',protect,getLikedBooks)
router.put("/updateProfilePicture", upload.single('profilePic'), updateProfilePicture);

export default router;
