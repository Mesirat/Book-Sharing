import { Group } from "../models/groupModel.js";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { User } from "../models/userModel.js";
import createUpload from "../middleware/uploadMiddleware.js";
import { fileURLToPath } from "url";
import asyncHandler from "express-async-handler";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const upload = createUpload('group');

export const CreateGroup = asyncHandler(async (req, res) => {
  const io = req.io;

  // Multer middleware already processed the file, errors handled in the route
  const { groupName, description, creator } = req.body;

  if (!groupName || groupName.trim().length === 0) {
    return res
      .status(400)
      .json({ success: false, message: "Group name cannot be empty." });
  }

  if (!mongoose.Types.ObjectId.isValid(creator)) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid creator ID format." });
  }

  const creatorExists = await User.findById(creator);
  if (!creatorExists) {
    return res.status(400).json({ success: false, message: "Creator does not exist." });
  }

  try {
    const normalizedGroupName = groupName.trim().toLowerCase();
    const existingGroup = await Group.findOne({ name: normalizedGroupName });

    if (existingGroup) {
      return res
        .status(400)
        .json({ success: false, message: "Group already exists!" });
    }

    const profilePic = req.file ? `/uploads/groups/${req.file.filename}` : null;

    const newGroup = new Group({
      name: normalizedGroupName,
      description,
      profilePic,
      creator: new mongoose.Types.ObjectId(creator),
    });

    await newGroup.save();
    io.emit("newGroupAdded", newGroup);

    res.status(201).json({
      success: true,
      group: {
        id: newGroup._id,
        name: newGroup.name,
        profilePic: newGroup.profilePic,
      },
      message: "Group created successfully.",
    });
  } catch (error) {
    console.error("Error creating group:", error.message);
    res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later.",
    });
  }
});

export const GetGroups = async (req, res) => {
  const { page = 1, limit = 10, search = "" } = req.query;

  const pageNumber = Math.max(1, parseInt(page, 10));
  const pageSize = Math.max(1, parseInt(limit, 10));

  const searchFilter = search
    ? { name: { $regex: search.trim(), $options: "i" } }
    : {};

  try {
    const groups = await Group.find(searchFilter)
      .skip((pageNumber - 1) * pageSize)
      .limit(pageSize);

    const totalGroups = await Group.countDocuments();
    const totalPages = Math.ceil(totalGroups / pageSize);

    if (!groups.length) {
      return res.status(404).json({
        message: "No groups found for this page.",
      });
    }

    res.status(200).json({
      groups,
      totalGroups,
      totalPages,
      currentPage: pageNumber,
      perPage: pageSize,
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    res.status(500).json({
      message: "Error fetching groups",
      error: error.message,
    });
  }
};

export const JoinGroup = async (req, res) => {
  const io = req.io;
  const { groupId } = req.params;
  const { userId } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (
      group.members.some(
        (member) => member.userId.toString() === userId.toString()
      )
    ) {
      return res
        .status(400)
        .json({ message: "You are already a member of this group" });
    }

    group.members.push({
      userId: new mongoose.Types.ObjectId(userId),
      username: user.name,
    });

    group.memberCount = group.members.length;
    await group.save();

    io.emit("userJoinedGroup", {
      groupId,
      userId,
      memberCount: group.memberCount,
    });

    res.status(200).json({ message: "Successfully joined the group" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to join group" });
  }
};

export const LeaveGroup = async (req, res) => {
  const io = req.io;
  const { groupId } = req.params;
  const { userId } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const memberIndex = group.members.findIndex(
      (member) => member.userId.toString() === userId.toString()
    );
    if (memberIndex === -1) {
      return res
        .status(400)
        .json({ message: "You are not a member of this group" });
    }

    group.members.splice(memberIndex, 1);

    group.memberCount = group.members.length;
    await group.save();
    io.emit("userLeftGroup", {
      groupId,
      userId,
      memberCount: group.memberCount,
    });

    res.status(200).json({ message: "Successfully left the group" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to leave group" });
  }
};

export const getUsersInGroup = async (groupName) => {
  try {
    const normalizedGroupName = groupName.trim().toLowerCase();
    const group = await Group.findOne({ name: normalizedGroupName });

    if (!group) {
      throw new Error("Group not found");
    }

    const members = group.members || [];

    const formattedMembers = members.map((member) => ({
      userId: member.userId,
      username: member.username,
    }));

    return formattedMembers;
  } catch (error) {
    throw new Error("Error fetching users in group: " + error.message);
  }
};
export const GetGroupDetails = async (req, res) => {
  const { groupId, userId } = req.params;

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.some(
      (member) => member.userId.toString() === userId.toString()
    );

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "User is not a member of this group" });
    }

    const members = group.members.map((member) => ({
      userId: member.userId,
      username: member.username,
    }));

    res.status(200).json({
      group: { id: group._id, name: group.name, profilePic: group.profilePic },
      members,
    });
  } catch (error) {
    console.error("Error fetching group details:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const checkMembership = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isMember = group.members.some(
      (member) => member.userId.toString() === req.user._id.toString()
    );

    if (isMember) {
      return res.status(200).json({ canAccessChat: true });
    } else {
      return res
        .status(403)
        .json({ message: "You must join the group to access the chat" });
    }
  } catch (error) {
    console.error("Error checking membership:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
export const getMyGroups = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid user ID." });
  }

  if (!id) {
    return res.status(400).json({ message: "User ID is required." });
  }

  try {
    const userGroups = await Group.find({ "members.userId": id }).populate(
      "members.userId",
      "username"
    );

    if (userGroups.length === 0) {
      return res
        .status(404)
        .json({ message: "No groups found for this user." });
    }

    res.status(200).json(userGroups);
  } catch (error) {
    console.error("Error in getMyGroups:", error);
    res
      .status(500)
      .json({ message: "Error retrieving user groups", error: error.message });
  }
};




