import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import {
  getDashboardStats,
  getAllUsers,
  changeUserRole,
  deleteBook,
  getAllReports,
  respondToReport,
  uploadUsers,
  UploadBook,
  getAllBooks,
} from "../controllers/adminController.js";
import { uploadBookAssets } from "../middleware/uploadMiddleware.js";
import {uploadCSV}  from "../middleware/localUpload.js";

const router = express.Router();

// Apply protect and adminOnly to all admin routes
router.use(protect, adminOnly);

// Admin Routes
router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);
router.put("/users/:id/role", changeUserRole);
router.delete("/books/:id", deleteBook);
router.get("/books", getAllBooks);  
// router.get("/books/:id", getBookById);
// router.put("/books/:id", updateBook);
router.get("/reports", getAllReports);
router.put("/reports/:id/respond", respondToReport);
router.post("/uploadUsers", uploadCSV.single("csv"), uploadUsers);

router.post(
    "/uploadBooks",
    uploadBookAssets.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "pdf", maxCount: 1 },
    ]),
    UploadBook
  );
export default router;
