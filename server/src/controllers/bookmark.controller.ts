import { Request, Response } from "express";
import mongoose from "mongoose";
import Bookmark from "../models/bookmark.model";

export const bookmarkPost = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const id = req.params.id;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid project id" });
      return;
    }

    const projectId = new mongoose.Types.ObjectId(id);

    const existing = await Bookmark.findOne({ userId: req.user._id, projectId });

    if (existing) {
      await Bookmark.findByIdAndDelete(existing._id);
      res.status(200).json({ success: true, bookmarked: false, message: "Removed from bookmarks" });
      return;
    }

    await Bookmark.create({ userId: req.user._id, projectId });

    res.status(201).json({ success: true, bookmarked: true, message: "Bookmarked" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

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

    const projects = bookmarks
      .map((bookmark) => bookmark.projectId)
      .filter((p) => p !== null);

    res.status(200).json({
      success: true,
      projects,
      message: "Bookmarks fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deleteFromBookmarks = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const id = req.params.id;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid project id" });
      return;
    }

    const projectId = new mongoose.Types.ObjectId(id);

    await Bookmark.findOneAndDelete({ userId: req.user._id, projectId });

    res.status(200).json({ success: true, message: "Removed from bookmarks" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
