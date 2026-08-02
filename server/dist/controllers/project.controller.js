"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExplorePosts = exports.getFeaturedPosts = exports.getProjectsByUser = exports.getStarredPost = exports.starPost = exports.getFeed = exports.deleteProject = exports.updatePost = exports.getPostsById = exports.getPosts = exports.createPost = void 0;
const project_model_1 = __importDefault(require("../models/project.model"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const mongoose_1 = __importStar(require("mongoose"));
const notification_services_1 = require("../services/notification.services");
const createPost = async (req, res) => {
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
        let thumbnailUrl = "";
        if (req.file) {
            const uploadResult = await cloudinary_1.default.uploader.upload(req.file.path, {
                folder: "projects/thumbnails",
            });
            thumbnailUrl = uploadResult.secure_url;
        }
        const project = await project_model_1.default.create({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};
exports.createPost = createPost;
const getPosts = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ success: false, message: "User isn't authenticated" });
            return;
        }
        const projects = await project_model_1.default.find()
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getPosts = getPosts;
const getPostsById = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ success: false, message: "User isn't authenticated" });
            return;
        }
        const { id } = req.params;
        const post = await project_model_1.default.findById(id).populate("userId", "name username profile_url");
        if (!post) {
            res.status(404).json({ success: false, message: "Post not found" });
            return;
        }
        // fire-and-forget view increment
        project_model_1.default.findByIdAndUpdate(id, { $inc: { viewCount: 1 } }).exec();
        res.status(200).json({
            success: true,
            post,
            message: "Post found successfully!",
        });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getPostsById = getPostsById;
const updatePost = async (req, res) => {
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
        if (typeof id !== "string" || !mongoose_1.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid project id",
            });
            return;
        }
        const project = await project_model_1.default.findById(id);
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
        const { title, description, liveUrl, repoUrl, techStack, tags, status, } = req.body;
        if (title !== undefined)
            project.title = title;
        if (description !== undefined)
            project.description = description;
        if (liveUrl !== undefined)
            project.liveUrl = liveUrl;
        if (repoUrl !== undefined)
            project.repoUrl = repoUrl;
        if (status !== undefined)
            project.status = status;
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
            const uploadResult = await cloudinary_1.default.uploader.upload(req.file.path, {
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.updatePost = updatePost;
const deleteProject = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "User not authenticated",
            });
            return;
        }
        const id = req.params.id;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid project id",
            });
            return;
        }
        const project = await project_model_1.default.findById(id);
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.deleteProject = deleteProject;
const getFeed = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const limit = Number(req.query.limit) || 30;
        const feedUserIds = [...req.user?.following, req.user?._id];
        const latestProject = await project_model_1.default.findOne({
            userId: { $in: feedUserIds },
            status: "published",
        })
            .sort({ createdAt: -1 })
            .populate("userId", "name username profile_url");
        const poolSize = Math.max(limit * 4, 60);
        const randomProjects = await project_model_1.default.aggregate([
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
        const populatedRandom = await project_model_1.default.populate(randomProjects, {
            path: "userId",
            select: "name username profile_url",
        });
        const projects = latestProject ? [latestProject, ...populatedRandom] : populatedRandom;
        res.status(200).json({
            success: true,
            projects,
            message: "Feed fetched successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getFeed = getFeed;
const starPost = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }
        const { id } = req.params;
        const currentPost = await project_model_1.default.findById(id);
        if (!currentPost) {
            res.status(404).json({ success: false, message: "Couldn't find the project" });
            return;
        }
        const userObjectId = new mongoose_1.Types.ObjectId(req.user._id);
        const alreadyStarred = currentPost.stars.some((i) => i.equals(userObjectId));
        if (alreadyStarred) {
            currentPost.stars = currentPost.stars.filter((i) => !i.equals(userObjectId));
            currentPost.starCount--;
        }
        else {
            currentPost.stars.push(userObjectId);
            currentPost.starCount++;
        }
        await currentPost.save();
        if (!alreadyStarred) {
            await (0, notification_services_1.createNotification)({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.starPost = starPost;
const getStarredPost = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const projects = await project_model_1.default.find({ stars: userId })
            .populate({ path: "userId", select: "username name bio profile_url", model: "User" })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);
        res.status(200).json({
            success: true,
            projects,
            message: "Starred posts fetched successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getStarredPost = getStarredPost;
const getProjectsByUser = async (req, res) => {
    try {
        const userId = Array.isArray(req.params.userId) ? req.params.userId[0] : req.params.userId;
        if (!userId || !mongoose_1.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ success: false, message: "Invalid userId" });
            return;
        }
        const projects = await project_model_1.default.find({ userId, status: "published" })
            .populate("userId", "name username profile_url")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            projects,
            message: "User projects fetched successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getProjectsByUser = getProjectsByUser;
const getFeaturedPosts = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "User isn't authenticated" });
            return;
        }
        const projects = await project_model_1.default.find({ featured: true, status: "published" })
            .populate("userId", "name username profile_url")
            .sort({ createdAt: -1 })
            .limit(20);
        res.status(200).json({
            success: true,
            projects,
            message: "Featured projects fetched successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getFeaturedPosts = getFeaturedPosts;
const getExplorePosts = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "User isn't authenticated" });
            return;
        }
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 12;
        const skip = (page - 1) * limit;
        const excludeIds = [...(req.user.following || []), req.user._id];
        const projects = await project_model_1.default.find({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getExplorePosts = getExplorePosts;
//# sourceMappingURL=project.controller.js.map