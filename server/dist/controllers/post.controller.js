"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.likePost = exports.getLikedPosts = exports.getPostsByUser = exports.getPostsFeed = exports.createPost = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const post_model_1 = __importDefault(require("../models/post.model"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const notification_services_1 = require("../services/notification.services");
const createPost = async (req, res) => {
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
        let imageUrl;
        if (req.file) {
            const uploadResult = await cloudinary_1.default.uploader.upload(req.file.path, {
                folder: "posts/images",
            });
            imageUrl = uploadResult.secure_url;
        }
        const post = await post_model_1.default.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.createPost = createPost;
const getPostsFeed = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const limit = Number(req.query.limit) || 15;
        const latestPost = await post_model_1.default.findOne()
            .sort({ createdAt: -1 })
            .populate("userId", "name username profile_url");
        const poolSize = Math.max(limit * 4, 60);
        const randomPosts = await post_model_1.default.aggregate([
            ...(latestPost ? [{ $match: { _id: { $ne: latestPost._id } } }] : []),
            { $sort: { createdAt: -1 } },
            { $limit: poolSize },
            { $sample: { size: Math.max(limit - (latestPost ? 1 : 0), 0) } },
        ]);
        const populatedRandom = await post_model_1.default.populate(randomPosts, {
            path: "userId",
            select: "name username profile_url",
        });
        const posts = latestPost ? [latestPost, ...populatedRandom] : populatedRandom;
        res.status(200).json({
            success: true,
            posts,
            message: "Posts feed fetched successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getPostsFeed = getPostsFeed;
const getPostsByUser = async (req, res) => {
    try {
        const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
        if (!userId || !mongoose_1.default.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ success: false, message: "Invalid userId" });
            return;
        }
        const posts = await post_model_1.default.find({ userId })
            .populate("userId", "name username profile_url")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            posts,
            message: "User posts fetched successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getPostsByUser = getPostsByUser;
// GET /api/posts/liked — text posts the current user has liked.
const getLikedPosts = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }
        const posts = await post_model_1.default.find({ likes: userId })
            .populate("userId", "name username profile_url")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            posts,
            message: "Liked posts fetched successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getLikedPosts = getLikedPosts;
const likePost = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid post id" });
            return;
        }
        const post = await post_model_1.default.findById(id);
        if (!post) {
            res.status(404).json({ success: false, message: "Post not found" });
            return;
        }
        const userObjectId = new mongoose_1.default.Types.ObjectId(req.user._id);
        const alreadyLiked = post.likes.some((i) => i.equals(userObjectId));
        if (alreadyLiked) {
            post.likes = post.likes.filter((i) => !i.equals(userObjectId));
            post.likeCount = Math.max(0, post.likeCount - 1);
        }
        else {
            post.likes.push(userObjectId);
            post.likeCount++;
        }
        await post.save();
        if (!alreadyLiked) {
            await (0, notification_services_1.createNotification)({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.likePost = likePost;
const deletePost = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }
        const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid post id" });
            return;
        }
        const post = await post_model_1.default.findById(id);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.deletePost = deletePost;
//# sourceMappingURL=post.controller.js.map