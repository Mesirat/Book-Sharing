import express from 'express';
import {
  createMessage,
  getMessagesByGroup,
  
  markMessageAsSeen,
} from '../controllers/messageController.js';
import { uploadBookAssets } from '../middleware/uploadMiddleware.js';

const router = express.Router();


router.get("/:groupName", getMessagesByGroup);


router.post(
  "/send",
  uploadBookAssets.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "pdf", maxCount: 1 },
  ]),
  createMessage
);



router.put("/seen/:messageId", markMessageAsSeen);

export default router;
