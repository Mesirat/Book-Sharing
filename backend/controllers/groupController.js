import { Group } from "../models/groupModel.js";
import mongoose from "mongoose";
import multer from "multer";
import path from "path";
import { User } from "../models/userModel.js";

import { fileURLToPath } from "url";
import asyncHandler from "express-async-handler";
import { v2 as cloudinary } from "cloudinary";
import { Message } from "../models/messageModel.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const CreateGroup = async (req, res) => {
  const io = req.app.get("io");
  const { groupName, creator } = req.body;

  if (!groupName || groupName.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Group name cannot be empty.",
    });
  }

  if (!mongoose.Types.ObjectId.isValid(creator)) {
    return res.status(400).json({
      success: false,
      message: "Invalid creator ID format.",
    });
  }

  const creatorExists = await User.findById(creator);
  if (!creatorExists) {
    return res.status(400).json({
      success: false,
      message: "Creator does not exist.",
    });
  }

  try {
    const normalizedGroupName = groupName.trim().toLowerCase();
    const existingGroup = await Group.findOne({
      groupName: normalizedGroupName,
    });

    if (existingGroup) {
      return res.status(400).json({
        success: false,
        message: "Group already exists!",
      });
    }

    const profilePic = req.file?.path || null;

    const newGroup = new Group({
      groupName: normalizedGroupName,
      profilePic,
      creator: new mongoose.Types.ObjectId(creator),
      members: [creator],
      memberCount: 1,
    });

    await newGroup.save();

    io.emit("newGroupAdded", newGroup);

    res.status(201).json({
      success: true,
      group: {
        id: newGroup._id,
        groupName: newGroup.groupName,
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
};

export const GetGroups = async (req, res) => {
  const { search } = req.query;

  const searchFilter = search
    ? { name: { $regex: search.trim(), $options: "i" } }
    : {};

  try {
    const groups = await Group.find(searchFilter);

    res.status(200).json({
      groups,
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
  const io = req.app.get("io");

  let { groupId } = req.params;
  const userId = req.user._id;

  if (!userId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  groupId = groupId.replace(/^:/, "");

  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    return res.status(400).json({ message: "Invalid group ID" });
  }

  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const isAlreadyMember = group.members.some(
      (memberId) => memberId.toString() === userId.toString()
    );
    if (isAlreadyMember) {
      return res
        .status(400)
        .json({ message: "You are already a member of this group" });
    }

    group.members.push(userId);
    group.memberCount = group.members.length;
    await group.save();

    io.emit("userJoinedGroup", {
      groupId,
      userId,
      memberCount: group.memberCount,
    });

    res.status(201).json({ message: "Successfully joined the group" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to join group" });
  }
};

export const LeaveGroup = async (req, res) => {
  const io = req.app.get("io");
  const { groupId } = req.params;
  const { userId } = req.body;
  try {
    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }
    const memberIndex = group.members.findIndex(
      (memberId) => memberId.toString() === userId.toString()
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
    const group = await Group.findById(groupId)
      .populate("members", "_id firstName  email profilePic")
      .populate("creator", "_id firstName email profilePic");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    const creator = group.creator
      ? {
          _id: group.creator._id,
          name: group.creator.firstNname,
          email: group.creator.email,
          profilePic: group.creator.profilePic,
        }
      : null;

    const isMember = group.members.some(
      (member) => member._id.toString() === userId.toString()
    );

    if (!isMember) {
      return res
        .status(403)
        .json({ message: "User is not a member of this group" });
    }

    const members = group.members.map((member) => ({
      _id: member._id,
      name: member.firstName,
      email: member.email,
      profilePic: member.profilePic,
    }));

    res.status(200).json({
      group: {
        id: group._id,
        name: group.groupName,
        description: group.description,
        profilePic: group.profilePic,
        memberCount: group.members.length,
        creator,
      },
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
  const { userId } = req.params;

  try {
    const userGroups = await Group.find({ members: userId })
      .select("groupName profilePic members")
      .populate("members", "name");

    res.status(200).json({ groups: userGroups || [] });
  } catch (error) {
    console.error("Error in getMyGroups:", error);
    res
      .status(500)
      .json({ message: "Error retrieving user groups", error: error.message });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const groupId = req.params.id;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ error: "Group not found" });
    }

    const updates = {};

    if (req.body.groupName) {
      updates.groupName = req.body.groupName;
    }


    if (req.file) {
     
      if (group.cloudinaryPublicId) {
        await cloudinary.uploader.destroy(group.cloudinaryPublicId);
      }

      const uploaded = await cloudinary.uploader.upload(req.file.path, {
        folder: "group_profiles",
      });

      updates.profilePic = uploaded.secure_url;
      updates.cloudinaryPublicId = uploaded.public_id;
    }

    const updatedGroup = await Group.findByIdAndUpdate(groupId, updates, {
      new: true,
    });

    res.status(200).json(updatedGroup);
  } catch (err) {
    console.error("Error updating group:", err);
    res.status(500).json({ error: "Failed to update group" });
  }
};


export const deleteGroup = async (req, res) => {
  try {
    const groupId = req.params.id;

    const deleted = await Group.findByIdAndDelete(groupId);

    if (!deleted) {
      return res.status(404).json({ error: "Group not found" });
    }

    res.status(200).json({ message: "Group deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete group" });
  }
};
