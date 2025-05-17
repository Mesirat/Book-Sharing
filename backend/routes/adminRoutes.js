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
  suspendUser,
  deleteUser,
  updateBook,
  uploadBlog,
  getAdminStats,
  resetPassword,
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
router.put("/books/:id",uploadBookAssets.fields([
  { name: "thumbnail", maxCount: 1 },
  { name: "pdf", maxCount: 1 },
]), updateBook);
router.get("/books", getAllBooks);  
// router.get("/books/:id", getBookById);

router.get("/reports", getAllReports);
router.put("/reports/:id/respond", respondToReport);
router.post("/uploadUsers", uploadCSV.single("csv"), uploadUsers);
router.put("/suspend/:id", suspendUser);
router.delete("/users/:id", deleteUser);
router.get("/stats",getAdminStats)
router.post(
    "/uploadBooks",
    uploadBookAssets.fields([
      { name: "thumbnail", maxCount: 1 },
      { name: "pdf", maxCount: 1 },
    ]),
    UploadBook
  );
router.post("/uploadBlog",uploadBookAssets.fields([{name:"thumbnail",maxCount:1}]),uploadBlog);
router.put('/users/:id/resetPassword',resetPassword);
export default router;
