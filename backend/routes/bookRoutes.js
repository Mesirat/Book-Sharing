import express from 'express';
import {
  createBook,
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
} from '../controllers/bookController.js';
import {protect} from '../middleware/authMiddleware.js'
const router = express.Router();

router.get("/search",bookSearch);
router.post('/rate', ratingBooks);
router.get("/popularbooks", popularBooks);
router.put('/LikeBook',protect, likeBook);
router.put('/ReadLater',protect,laterRead);
router.get('/ReadLater', protect, getLaterReads);
router.get('/LikedBooks',protect,getLikedBooks)
// router.post("/ReadLater",protect, laterRead);
// router.post('/Likebook',protect, likeBook);
export default router;