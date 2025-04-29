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
import createUpload from "../middleware/uploadMiddleware.js";

const router = express.Router();
const upload = createUpload("group");

router.get("/", protect, GetGroups);

router.post("/createGroup", protect, upload.single("profilePic"), CreateGroup);

router.post("/join/:groupId", protect, JoinGroup);

router.delete("/leave/:groupId", protect, LeaveGroup);

router.get("/:id/members", protect, getUsersInGroup);

router.get("/mygroups/:userId", protect, getMyGroups);

export default router;
