import { Message } from "../models/messageModel.js";
import { Group } from "../models/GroupModel.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import mongoose from "mongoose";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only images and PDFs are allowed!"));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

export const uploadFile = upload.single("file");

export const createMessage = async (req, res) => {
  const { groupName, sender, text = "", status = "sending" } = req.body;
  const file = req.file;
  const io = req.io;

  try {
    if (!file && !text.trim()) {
      return res.status(400).json({ message: "Text or file must be provided." });
    }

    const groupExists = await Group.findOne({ name: groupName });
    if (!groupExists) {
      return res.status(404).json({ message: "Group not found." });
    }

    let fileUrl = null;
    let fileType = null;
    let fileName = null;

    if (file) {
      fileUrl = `/uploads/${file.filename}`;
      fileType = file.mimetype;
      fileName = file.originalname;
    }

    const messageText = text.trim() || null;
    const newMessage = new Message({
      groupName,
      sender,
      text: messageText,
      status,
      fileUrl,
      fileType,
      fileName,
    });

    await newMessage.save();

    newMessage.status = "sent";
    await newMessage.save();

    if (io) {
      io.to(groupName).emit("receiveMessage", newMessage);
    } else {
      console.error("Socket.io not initialized.");
    }

    return res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error sending message", error: error.message });
  }
};

export const getMessagesByGroup = async (req, res) => {
  const { groupName } = req.params;
  const { page = 1, limit = 20 } = req.query;

  try {
    const messages = await Message.find({ groupName })
      .sort({ createdAt: 1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.status(200).json({ success: true, messages });
  } catch (error) {
    res.status(500).json({ message: "Error retrieving messages", error: error.message });
  }
};

export const markMessageAsSeen = async (req, res) => {
  const { messageId } = req.params;
  const { userId } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(messageId)) {
      return res.status(400).json({ message: "Invalid message ID" });
    }

    const message = await Message.findById(messageId);
    if (!message) {
      return res.status(404).json({ message: "Message not found" });
    }

    if (!message.seenBy.includes(userId)) {
      message.seenBy.push(userId);
      await message.save();
      req.io.to(message.groupName).emit("messageSeen", { messageId, userId });
    }

    res.status(200).json({ success: true, message });
  } catch (error) {
    res.status(500).json({ message: "Error updating seen status", error: error.message });
  }
};
