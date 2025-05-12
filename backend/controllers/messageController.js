import { Message } from "../models/messageModel.js";
import { Group } from "../models/groupModel.js";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import mongoose from "mongoose";
import { uploadBookAssets } from "../middleware/uploadMiddleware.js";
import { User } from "../models/userModel.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const createMessage = async (req, res) => {
  try {
    const { groupName, sender, text = "", status = "sending" } = req.body;
    const thumbnailUrl = req.files?.thumbnail?.[0]?.path || null;
    const pdfUrl = req.files?.pdf?.[0]?.path || null;

    const senderUser = await User.findById(sender);
    if (!senderUser) {
      return res
        .status(400)
        .json({ success: false, message: "Sender not found." });
    }

    const group = await Group.findOne({ groupName });
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    const newMessage = new Message({
      group: group._id,
      sender: senderUser._id,
      text: text.trim() || null,
      status: "sent",
      file: {
        url: thumbnailUrl || pdfUrl || null,
        type: thumbnailUrl ? "image" : pdfUrl ? "pdf" : null,
        name:
          req.files?.thumbnail?.[0]?.originalname ||
          req.files?.pdf?.[0]?.originalname ||
          null,
      },
    });

    await newMessage.save();

    newMessage.status = "sent";
    await newMessage.save();

    const io = req.app.get("io");
    if (io) {
      io.to(groupName).emit("receiveMessage", newMessage);
    } else {
      console.error("Socket.io not initialized.");
    }

    return res.status(200).json({ success: true, message: newMessage });
  } catch (error) {
    console.error("Error sending message:", error);
    return res.status(500).json({
      success: false,
      message: "Error sending message",
      error: error.message,
    });
  }
};

export const getMessagesByGroup = async (req, res) => {
  const { groupName } = req.params;

  try {
    const group = await Group.findOne({ groupName });
    if (!group) {
      return res
        .status(404)
        .json({ success: false, message: "Group not found" });
    }

    // Get all messages for the group (as plain JS objects)
    const messages = await Message.find({ group: group._id })
      .sort({ createdAt: 1 })
      .lean();

    // Extract unique sender IDs
    const senderIds = [
      ...new Set(messages.map((msg) => msg.sender.toString())),
    ];

    // Fetch all senders in one query
    const senders = await User.find({ _id: { $in: senderIds } }).lean();

    // Create a map for quick lookup
    const senderMap = Object.fromEntries(
      senders.map((sender) => [
        sender._id.toString(),
        { _id: sender._id, firstName: sender.firstName },
      ])
    );

    // Attach sender info to messages
    const updatedMessages = messages.map((msg) => ({
      ...msg,
      sender: senderMap[msg.sender.toString()] || {
        _id: null,
        firstName: "Unknown",
      },
    }));

    res.status(200).json({ success: true, messages: updatedMessages });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error retrieving messages", error: error.message });
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
    res
      .status(500)
      .json({ message: "Error updating seen status", error: error.message });
  }
};
