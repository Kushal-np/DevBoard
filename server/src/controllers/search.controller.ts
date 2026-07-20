import { Request, Response } from "express";
import User from "../models/user.model";
import Project from "../models/project.model";

// GET /api/search/users?q=...
export const searchUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = (req.query.q as string) || "";
    if (!q.trim()) {
      res.status(200).json({ success: true, users: [] });
      return;
    }

    const users = await User.find({
      $or: [
        { username: { $regex: q, $options: "i" } },
        { name: { $regex: q, $options: "i" } },
      ],
    })
      .select("name username profile_url bio")
      .limit(20);

    res.status(200).json({ success: true, users, message: "Users fetched" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/search/posts?q=...  (matches title/description)
export const searchPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const q = (req.query.q as string) || "";
    if (!q.trim()) {
      res.status(200).json({ success: true, projects: [] });
      return;
    }

    const projects = await Project.find({
      status: "published",
      $or: [
        { title: { $regex: q, $options: "i" } },
        { description: { $regex: q, $options: "i" } },
      ],
    })
      .populate("userId", "name username profile_url")
      .limit(20);

    res.status(200).json({ success: true, projects, message: "Posts fetched" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/search/tags?tag=React
export const searchByTag = async (req: Request, res: Response): Promise<void> => {
  try {
    const tag = (req.query.tag as string) || "";
    if (!tag.trim()) {
      res.status(200).json({ success: true, projects: [] });
      return;
    }

    const projects = await Project.find({
      status: "published",
      "tags.name": { $regex: tag, $options: "i" },
    })
      .populate("userId", "name username profile_url")
      .limit(20);

    res.status(200).json({ success: true, projects, message: "Posts fetched by tag" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
