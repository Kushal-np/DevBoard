"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchByTag = exports.searchPosts = exports.searchUsers = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const project_model_1 = __importDefault(require("../models/project.model"));
const searchUsers = async (req, res) => {
    try {
        const q = req.query.q || "";
        if (!q.trim()) {
            res.status(200).json({ success: true, users: [] });
            return;
        }
        const users = await user_model_1.default.find({
            $or: [
                { username: { $regex: q, $options: "i" } },
                { name: { $regex: q, $options: "i" } },
            ],
        })
            .select("name username profile_url bio")
            .limit(20);
        res.status(200).json({ success: true, users, message: "Users fetched" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.searchUsers = searchUsers;
const searchPosts = async (req, res) => {
    try {
        const q = req.query.q || "";
        if (!q.trim()) {
            res.status(200).json({ success: true, projects: [] });
            return;
        }
        const projects = await project_model_1.default.find({
            status: "published",
            $or: [
                { title: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } },
            ],
        })
            .populate("userId", "name username profile_url")
            .limit(20);
        res.status(200).json({ success: true, projects, message: "Posts fetched" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.searchPosts = searchPosts;
const searchByTag = async (req, res) => {
    try {
        const tag = req.query.tag || "";
        if (!tag.trim()) {
            res.status(200).json({ success: true, projects: [] });
            return;
        }
        const projects = await project_model_1.default.find({
            status: "published",
            "tags.name": { $regex: tag, $options: "i" },
        })
            .populate("userId", "name username profile_url")
            .limit(20);
        res.status(200).json({ success: true, projects, message: "Posts fetched by tag" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.searchByTag = searchByTag;
//# sourceMappingURL=search.controller.js.map