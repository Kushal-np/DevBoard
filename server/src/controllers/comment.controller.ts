import { Request, Response } from "express";
import mongoose from "mongoose";
import Comment from "../models/comment.model";
import Project from "../models/project.model";
import { createNotification } from "../services/notification.services";

export const createComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const projectId = req.params.projectId as string;
    const { text } = req.body;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ success: false, message: "Invalid projectId" });
      return;
    }

    if (!text || !text.trim()) {
      res.status(400).json({ success: false, message: "Comment text is required" });
      return;
    }

    const project = await Project.findById(projectId);

    if (!project) {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }

    const comment = await Comment.create({
      projectId,
      userId,
      text: text.trim(),
    });

    const populatedComment = await comment.populate("userId", "name username profile_url");

    await createNotification({
      recipientId: project.userId.toString(),
      senderId: userId,
      type: "comment",
      text: "commented on your post",
      postId: project._id.toString(),
    });

    res.status(201).json({
      success: true,
      comment: populatedComment,
      message: "Comment posted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const projectId = req.params.projectId as string;

    if (!projectId || !mongoose.Types.ObjectId.isValid(projectId)) {
      res.status(400).json({ success: false, message: "Invalid projectId" });
      return;
    }

    const comments = await Comment.find({ projectId })
      .populate("userId", "name username profile_url")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      comments,
      message: "Comments fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const id = req.params.id as string;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid comment id" });
      return;
    }

    const comment = await Comment.findById(id);

    if (!comment) {
      res.status(404).json({ success: false, message: "Comment not found" });
      return;
    }

    if (comment.userId.toString() !== userId.toString()) {
      res.status(403).json({ success: false, message: "You can only delete your own comments" });
      return;
    }

    await comment.deleteOne();

    res.status(200).json({
      success: true,
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};