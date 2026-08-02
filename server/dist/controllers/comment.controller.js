"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.getComments = exports.createComment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const comment_model_1 = __importDefault(require("../models/comment.model"));
const project_model_1 = __importDefault(require("../models/project.model"));
const notification_services_1 = require("../services/notification.services");
const createComment = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }
        const projectId = req.params.projectId;
        const { text } = req.body;
        if (!projectId || !mongoose_1.default.Types.ObjectId.isValid(projectId)) {
            res.status(400).json({ success: false, message: "Invalid projectId" });
            return;
        }
        if (!text || !text.trim()) {
            res.status(400).json({ success: false, message: "Comment text is required" });
            return;
        }
        const project = await project_model_1.default.findById(projectId);
        if (!project) {
            res.status(404).json({ success: false, message: "Post not found" });
            return;
        }
        const comment = await comment_model_1.default.create({ projectId, userId, text: text.trim() });
        const populatedComment = await comment.populate("userId", "name username profile_url");
        await (0, notification_services_1.createNotification)({
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.createComment = createComment;
const getComments = async (req, res) => {
    try {
        const projectId = req.params.projectId;
        if (!projectId || !mongoose_1.default.Types.ObjectId.isValid(projectId)) {
            res.status(400).json({ success: false, message: "Invalid projectId" });
            return;
        }
        const comments = await comment_model_1.default.find({ projectId })
            .populate("userId", "name username profile_url")
            .sort({ createdAt: -1 });
        res.status(200).json({
            success: true,
            comments,
            message: "Comments fetched successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getComments = getComments;
const deleteComment = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }
        const id = req.params.id;
        if (!id || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid comment id" });
            return;
        }
        const comment = await comment_model_1.default.findById(id);
        if (!comment) {
            res.status(404).json({ success: false, message: "Comment not found" });
            return;
        }
        if (comment.userId.toString() !== userId.toString()) {
            res.status(403).json({ success: false, message: "You can only delete your own comments" });
            return;
        }
        await comment.deleteOne();
        res.status(200).json({ success: true, message: "Comment deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.deleteComment = deleteComment;
//# sourceMappingURL=comment.controller.js.map