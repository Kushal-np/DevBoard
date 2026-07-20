import { Request, Response } from "express";
import Bookmark from "../models/bookmark.model";

// POST /api/bookmark/:id  -> toggles bookmark on/off (same pattern as starPost)
export const bookmarkPost = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const { id } = req.params;
    const userId = req.user._id;

    const existing = await Bookmark.findOne({ userId, projectId: id });

    if (existing) {
      await existing.deleteOne();
      res.status(200).json({ success: true, bookmarked: false, message: "Removed from bookmarks" });
      return;
    }

    await Bookmark.create({ userId, projectId: id });
    res.status(201).json({ success: true, bookmarked: true, message: "Bookmarked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/bookmark
export const getBookmarkPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const bookmarks = await Bookmark.find({ userId: req.user._id })
      .populate({
        path: "projectId",
        populate: { path: "userId", select: "username name profile_url" },
      })
      .sort({ createdAt: -1 });

    const projects = bookmarks.map((b) => b.projectId);

    res.status(200).json({ success: true, projects, message: "Bookmarks fetched successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// DELETE /api/bookmark/:id
export const deleteFromBookmarks = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const { id } = req.params;
    await Bookmark.findOneAndDelete({ userId: req.user._id, projectId: id });

    res.status(200).json({ success: true, message: "Removed from bookmarks" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
