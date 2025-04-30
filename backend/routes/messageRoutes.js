import express from 'express';
import {
  getMessagesByGroup,
  createMessage,
  markMessageAsSeen,
} from '../controllers/messageController.js';
import { uploadBookAssets } from '../middleware/uploadMiddleware.js';

const router = express.Router();


router.get("/:groupName", getMessagesByGroup);


router.post("/send", uploadBookAssets.single("file"), createMessage);


router.put("/seen/:messageId", markMessageAsSeen);

export default router;
