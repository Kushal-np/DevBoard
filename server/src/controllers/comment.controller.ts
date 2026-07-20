import { Request, Response } from "express";
import Comment from "../models/comment.model";

// POST /api/comment/:projectId
export const addComment = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const { projectId } = req.params;
    const { text } = req.body;

    if (!text || !text.trim()) {
      res.status(400).json({ success: false, message: "Comment text is required" });
      return;
    }

    const comment = await Comment.create({ userId: req.user._id, projectId, text });
    const populated = await comment.populate("userId", "name username profile_url");

    res.status(201).json({ success: true, comment: populated, message: "Comment added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/comment/:projectId
export const getComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { projectId } = req.params;

    const comments = await Comment.find({ projectId })
      .populate("userId", "name username profile_url")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, comments, message: "Comments fetched" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE /api/comment/:id
export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      res.status(404).json({ success: false, message: "Comment not found" });
      return;
    }

    if (!comment.userId.equals(req.user._id)) {
      res.status(403).json({ success: false, message: "Not allowed to delete this comment" });
      return;
    }

    await comment.deleteOne();
    res.status(200).json({ success: true, message: "Comment deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
