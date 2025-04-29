import express from 'express';
import { getMessagesByGroup,createMessage,markMessageAsSeen } from '../controllers/messageController.js';
import createUpload from '../middleware/uploadMiddleware.js';
const upload = createUpload("message");

const router = express.Router();
router.get("/:groupName",getMessagesByGroup);
router.post("/send:",upload.single("file"),createMessage);

export default router;