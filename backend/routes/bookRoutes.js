import express from 'express';
import {
  getBooks,
  getBookById,
  updateBook,
  deleteBook,
  likeBook,
  laterRead,
  getLaterReads,
  getLikedBooks,
  bookSearch,
  ratingBooks,
  popularBooks,
  UploadBook,
} from '../controllers/bookController.js';
import { protect } from '../middleware/authMiddleware.js';
import { uploadBookAssets } from '../middleware/uploadMiddleware.js';

const router = express.Router();

router.get("/search", bookSearch);
router.post('/rate', ratingBooks);
router.get("/popularbooks", popularBooks);
router.put('/LikeBook', protect, likeBook);
router.put('/ReadLater', protect, laterRead);
router.get('/ReadLater', protect, getLaterReads);
router.get('/LikedBooks', protect, getLikedBooks);
router.post(
  "/upload",
  uploadBookAssets.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  UploadBook
);

export default router;
