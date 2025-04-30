import express from "express";
import {
  CreateGroup,
  GetGroups,
  JoinGroup,
  LeaveGroup,
  getMyGroups,
  getUsersInGroup,
} from "../controllers/groupController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadBookAssets } from "../middleware/uploadMiddleware.js"; // ✅ new unified middleware

const router = express.Router();

router.get("/", protect, GetGroups);

router.post(
  "/createGroup",
  protect,
  uploadBookAssets.single("groupProfile"), // ✅ updated here
  CreateGroup
);

router.post("/join/:groupId", protect, JoinGroup);
router.delete("/leave/:groupId", protect, LeaveGroup);
router.get("/:id/members", protect, getUsersInGroup);
router.get("/mygroups/:userId", protect, getMyGroups);

export default router;
