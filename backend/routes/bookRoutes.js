import express from "express";
import {
  getBookById,
  likeBook,
  laterRead,
  getLaterReads,
  getLikedBooks,
  bookSearch,
  ratingBooks,
  markBookAsRead,
  getTopRead,
  getMostLikedBooks,
  getBookRating,
} from "../controllers/bookController.js";
import { protect } from "../middleware/authMiddleware.js";


const router = express.Router();

router.get("/search",protect, bookSearch);
router.post("/rate",protect, ratingBooks);

router.put("/LikeBook", protect, likeBook);
router.put("/ReadLater", protect, laterRead);
router.get("/ReadLater", protect, getLaterReads);
router.get("/LikedBooks", protect, getLikedBooks);
router.get("/topRead", protect, getTopRead);
router.get("/mostLiked", protect, getMostLikedBooks);
router.get("/:bookId/read", protect, markBookAsRead);
router.get("/rate/:bookId",protect,getBookRating);
router.get("/:bookId", protect, getBookById);


export default router;
