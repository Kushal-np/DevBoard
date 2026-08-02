import { Response, Request } from "express";
import Project from "../models/project.model";
import cloudinary from "../utils/cloudinary";
import mongoose, { Types } from "mongoose";
import { createNotification } from "../services/notification.services";

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    let { title, description, liveUrl, repoUrl, techStack, tags, status } = req.body;

    techStack = typeof techStack === "string" ? JSON.parse(techStack) : techStack;
    tags = typeof tags === "string" ? JSON.parse(tags) : tags;

    if (!title || !description) {
      res.status(400).json({ success: false, message: "Title and description are required." });
      return;
    }

    if (!Array.isArray(techStack)) {
      res.status(400).json({ success: false, message: "techStack must be an array." });
      return;
    }

    if (!Array.isArray(tags)) {
      res.status(400).json({ success: false, message: "tags must be an array." });
      return;
    }

    let thumbnailUrl: string | undefined = "";

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "projects/thumbnails",
      });
      thumbnailUrl = uploadResult.secure_url;
    }

    const project = await Project.create({
      userId,
      title,
      description,
      liveUrl,
      repoUrl,
      techStack,
      tags,
      thumbnailUrl,
      starCount: 0,
      viewCount: 0,
      featured: false,
      status: status || "draft",
    });

    res.status(201).json({
      success: true,
      message: "Project created successfully.",
      data: project,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const getPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, message: "User isn't authenticated" });
      return;
    }

    const projects = await Project.find()
      .populate({ path: "userId", select: "username name bio profile_url", model: "User" })
      .sort({ createdAt: -1 });

    const Projects = projects.map((project) => ({
      ...project.toObject(),
      isLiked: project.stars.some((id) => id.equals(userId)),
    }));

    res.status(200).json({
      success: true,
      Projects,
      message: "Projects fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getPostsById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, message: "User isn't authenticated" });
      return;
    }

    const { id } = req.params;

    const post = await Project.findById(id).populate("userId", "name username profile_url");

    if (!post) {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }

    // fire-and-forget view increment
    Project.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();

    res.status(200).json({
      success: true,
      post,
      message: "Post found successfully!",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updatePost = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    const id = req.params.id;
    const userId = String(req.user._id);

    if (typeof id !== "string" || !Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid project id",
      });
      return;
    }

    const project = await Project.findById(id);

    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    if (project.userId.toString() !== userId) {
      res.status(403).json({
        success: false,
        message: "You can only edit your own projects",
      });
      return;
    }

    const {
      title,
      description,
      liveUrl,
      repoUrl,
      techStack,
      tags,
      status,
    } = req.body;

    if (title !== undefined) project.title = title;
    if (description !== undefined) project.description = description;
    if (liveUrl !== undefined) project.liveUrl = liveUrl;
    if (repoUrl !== undefined) project.repoUrl = repoUrl;
    if (status !== undefined) project.status = status;

    if (techStack !== undefined) {
      project.techStack =
        typeof techStack === "string"
          ? JSON.parse(techStack)
          : techStack;
    }

    if (tags !== undefined) {
      project.tags =
        typeof tags === "string"
          ? JSON.parse(tags)
          : tags;
    }

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "projects/thumbnails",
      });

      project.thumbnailUrl = uploadResult.secure_url;
    }

    await project.save();

    res.status(200).json({
      success: true,
      project,
      message: "Project updated successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const deleteProject = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
      return;
    }

    const id = req.params.id as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({
        success: false,
        message: "Invalid project id",
      });
      return;
    }

    const project = await Project.findById(id);

    if (!project) {
      res.status(404).json({
        success: false,
        message: "Project not found",
      });
      return;
    }

    if (project.userId.toString() !== req.user._id.toString()) {
      res.status(403).json({
        success: false,
        message: "You can only delete your own projects",
      });
      return;
    }

    await project.deleteOne();

    res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getFeed = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const limit = Number(req.query.limit) || 30;
    const feedUserIds = [...req.user?.following, req.user?._id];

    const latestProject = await Project.findOne({
      userId: { $in: feedUserIds },
      status: "published",
    })
      .sort({ createdAt: -1 })
      .populate("userId", "name username profile_url");

    const poolSize = Math.max(limit * 4, 60);

    const randomProjects = await Project.aggregate([
      {
        $match: {
          userId: { $in: feedUserIds },
          status: "published",
          ...(latestProject ? { _id: { $ne: latestProject._id } } : {}),
        },
      },
      { $sort: { createdAt: -1 } },
      { $limit: poolSize },
      { $sample: { size: Math.max(limit - (latestProject ? 1 : 0), 0) } },
    ]);

    const populatedRandom = await Project.populate(randomProjects, {
      path: "userId",
      select: "name username profile_url",
    });

    const projects = latestProject ? [latestProject, ...populatedRandom] : populatedRandom;

    res.status(200).json({
      success: true,
      projects,
      message: "Feed fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const starPost = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const { id } = req.params;

    const currentPost = await Project.findById(id);

    if (!currentPost) {
      res.status(404).json({ success: false, message: "Couldn't find the project" });
      return;
    }

    const userObjectId = new Types.ObjectId(req.user._id);

    const alreadyStarred = currentPost.stars.some((i) => i.equals(userObjectId));

    if (alreadyStarred) {
      currentPost.stars = currentPost.stars.filter((i) => !i.equals(userObjectId));
      currentPost.starCount--;
    } else {
      currentPost.stars.push(userObjectId);
      currentPost.starCount++;
    }

    await currentPost.save();

    if (!alreadyStarred) {
      await createNotification({
        recipientId: currentPost.userId.toString(),
        senderId: req.user._id,
        type: "like",
        text: "liked your post",
        postId: currentPost._id.toString(),
      });
    }

    res.status(200).json({
      success: true,
      starred: !alreadyStarred,
      starCount: currentPost.starCount,
      message: alreadyStarred ? "Post unstarred successfully." : "Post starred successfully.",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getStarredPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const projects = await Project.find({ stars: userId })
      .populate({ path: "userId", select: "username name bio profile_url", model: "User" })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      projects,
      message: "Starred posts fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getProjectsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;

    if (!userId || !Types.ObjectId.isValid(userId)) {
      res.status(400).json({ success: false, message: "Invalid userId" });
      return;
    }

    const projects = await Project.find({ userId, status: "published" })
      .populate("userId", "name username profile_url")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      projects,
      message: "User projects fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getFeaturedPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "User isn't authenticated" });
      return;
    }

    const projects = await Project.find({ featured: true, status: "published" })
      .populate("userId", "name username profile_url")
      .sort({ createdAt: -1 })
      .limit(20);

    res.status(200).json({
      success: true,
      projects,
      message: "Featured projects fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getExplorePosts = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "User isn't authenticated" });
      return;
    }

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const excludeIds = [...(req.user.following || []), req.user._id];

    const projects = await Project.find({
      status: "published",
      userId: { $nin: excludeIds },
    })
      .populate("userId", "name username profile_url")
      .sort({ starCount: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      success: true,
      projects,
      message: "Explore projects fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
