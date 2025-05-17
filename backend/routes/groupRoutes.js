import express from "express";
import {
  CreateGroup,
  GetGroupDetails,
  GetGroups,
  JoinGroup,
  LeaveGroup,
  deleteGroup,
  
  getMyGroups,
  getUsersInGroup,
  updateGroup,
} from "../controllers/groupController.js";
import { protect } from "../middleware/authMiddleware.js";
import { uploadBookAssets } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/", protect, GetGroups);

router.post(
  "/createGroup",
  protect,
  uploadBookAssets.single("thumbnail"), 
  CreateGroup
);

router.post("/join/:groupId", protect, JoinGroup);
router.delete("/leave/:groupId", protect, LeaveGroup);
router.get("/mygroups/:userId", protect, getMyGroups);
router.get("/:id/members", protect, getUsersInGroup);

router.get("/:groupId/:userId", protect, GetGroupDetails)


router.put("/:id", protect, uploadBookAssets.single("thumbnail"),  updateGroup);
router.delete("/:id", protect, deleteGroup);
export default router;
