import { Message } from "../models/messageModel.js";
import { Group } from "../models/groupModel.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import mongoose from "mongoose";
import {uploadBookAssets} from "../middleware/uploadMiddleware.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);





export const createMessage = async (req, res) => {
  const { groupName, sender, text = "", status = "sending" } = req.body;
  const file = req.file;
  const io = req.app.get("io");

  console.log("Request Body:", req.body);
  console.log("File:", req.file);

  try {
    if (!text.trim() && !file) {
      return res.status(400).json({ message: "Text or file must be provided." });
    }

    
    const groupExists = await Group.findOne({ name: new RegExp(`^${groupName}$`, 'i') });
    if (!groupExists) {
      return res.status(404).json({ message: "Group not found." });
    }


    const senderId = mongoose.Types.ObjectId(sender);


    let fileUrl = null;
    let fileType = null;
    let fileName = null;

    if (file) {
      fileUrl = `/uploads/message/${file.filename}`; 
      fileType = file.mimetype;
      fileName = file.originalname;
    }

   
    const messageText = text.trim() || null;

    
    const newMessage = new Message({
      groupName,
      sender: senderId,
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

    
    return res.status(200).json(newMessage);
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({ message: "Error sending message", error: error.message });
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
