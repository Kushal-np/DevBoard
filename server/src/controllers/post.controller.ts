import { Request, Response } from "express";
import mongoose from "mongoose";
import Post from "../models/post.model";
import cloudinary from "../utils/cloudinary";
import { createNotification } from "../services/notification.services";

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const { text } = req.body;

    if (!text || !text.trim()) {
      res.status(400).json({ success: false, message: "Post text is required" });
      return;
    }

    let imageUrl: string | undefined;
    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, {
        folder: "posts/images",
      });
      imageUrl = uploadResult.secure_url;
    }

    const post = await Post.create({
      userId,
      text: text.trim(),
      ...(imageUrl ? { imageUrl } : {}),
    });

    const populated = await post.populate("userId", "name username profile_url");

    res.status(201).json({
      success: true,
      post: populated,
      message: "Post created successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getPostsFeed = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "Unauthorized" });
      return;
    }

    const limit = Number(req.query.limit) || 15;

    const latestPost = await Post.findOne()
      .sort({ createdAt: -1 })
      .populate("userId", "name username profile_url");

    const poolSize = Math.max(limit * 4, 60);

    const randomPosts = await Post.aggregate([
      ...(latestPost ? [{ $match: { _id: { $ne: latestPost._id } } }] : []),
      { $sort: { createdAt: -1 } },
      { $limit: poolSize },
      { $sample: { size: Math.max(limit - (latestPost ? 1 : 0), 0) } },
    ]);

    const populatedRandom = await Post.populate(randomPosts, {
      path: "userId",
      select: "name username profile_url",
    });

    const posts = latestPost ? [latestPost, ...populatedRandom] : populatedRandom;

    res.status(200).json({
      success: true,
      posts,
      message: "Posts feed fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const getPostsByUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;

    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(400).json({ success: false, message: "Invalid userId" });
      return;
    }

    const posts = await Post.find({ userId })
      .populate("userId", "name username profile_url")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
      message: "User posts fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// GET /api/posts/liked — text posts the current user has liked.
export const getLikedPosts = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const posts = await Post.find({ likes: userId })
      .populate("userId", "name username profile_url")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      posts,
      message: "Liked posts fetched successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const likePost = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid post id" });
      return;
    }

    const post = await Post.findById(id);

    if (!post) {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(req.user._id);
    const alreadyLiked = post.likes.some((i) => i.equals(userObjectId));

    if (alreadyLiked) {
      post.likes = post.likes.filter((i) => !i.equals(userObjectId));
      post.likeCount = Math.max(0, post.likeCount - 1);
    } else {
      post.likes.push(userObjectId);
      post.likeCount++;
    }

    await post.save();

    if (!alreadyLiked) {
      await createNotification({
        recipientId: post.userId.toString(),
        senderId: req.user._id,
        type: "like",
        text: "liked your post",
        postId: post._id.toString(),
      });
    }

    res.status(200).json({
      success: true,
      liked: !alreadyLiked,
      likeCount: post.likeCount,
      message: alreadyLiked ? "Post unliked" : "Post liked",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: "User not authenticated" });
      return;
    }

    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ success: false, message: "Invalid post id" });
      return;
    }

    const post = await Post.findById(id);

    if (!post) {
      res.status(404).json({ success: false, message: "Post not found" });
      return;
    }

    if (post.userId.toString() !== req.user._id.toString()) {
      res.status(403).json({ success: false, message: "You can only delete your own posts" });
      return;
    }

    await post.deleteOne();

    res.status(200).json({ success: true, message: "Post deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
