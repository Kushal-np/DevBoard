"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteFromBookmarks = exports.getBookmarkPosts = exports.bookmarkPost = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bookmark_model_1 = __importDefault(require("../models/bookmark.model"));
const bookmarkPost = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }
        const id = req.params.id;
        if (typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid project id" });
            return;
        }
        const projectId = new mongoose_1.default.Types.ObjectId(id);
        const existing = await bookmark_model_1.default.findOne({ userId: req.user._id, projectId });
        if (existing) {
            await bookmark_model_1.default.findByIdAndDelete(existing._id);
            res.status(200).json({ success: true, bookmarked: false, message: "Removed from bookmarks" });
            return;
        }
        await bookmark_model_1.default.create({ userId: req.user._id, projectId });
        res.status(201).json({ success: true, bookmarked: true, message: "Bookmarked" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.bookmarkPost = bookmarkPost;
const getBookmarkPosts = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }
        const bookmarks = await bookmark_model_1.default.find({ userId: req.user._id })
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
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getBookmarkPosts = getBookmarkPosts;
const deleteFromBookmarks = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }
        const id = req.params.id;
        if (typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid project id" });
            return;
        }
        const projectId = new mongoose_1.default.Types.ObjectId(id);
        await bookmark_model_1.default.findOneAndDelete({ userId: req.user._id, projectId });
        res.status(200).json({ success: true, message: "Removed from bookmarks" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.deleteFromBookmarks = deleteFromBookmarks;
//# sourceMappingURL=bookmark.controller.js.map