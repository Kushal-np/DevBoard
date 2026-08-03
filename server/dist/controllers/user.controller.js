"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRecommendations = exports.getFollowData = exports.unfollowUser = exports.followUser = exports.getMe = exports.logout = exports.login = exports.register = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_model_1 = __importDefault(require("../models/user.model"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const notification_services_1 = require("../services/notification.services");
function isPasswordStrong(password) {
    if (typeof password !== "string") {
        return { valid: false, message: "Password is required." };
    }
    if (password.length < 8) {
        return { valid: false, message: "Password must be at least 8 characters long." };
    }
    if (password.length > 128) {
        return { valid: false, message: "Password must be less than 128 characters long." };
    }
    if (!/[a-z]/.test(password)) {
        return { valid: false, message: "Password must contain at least one lowercase letter." };
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: "Password must contain at least one uppercase letter." };
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: "Password must contain at least one number." };
    }
    if (!/[^a-zA-Z0-9]/.test(password)) {
        return { valid: false, message: "Password must contain at least one special character." };
    }
    const commonPasswords = [
        "password", "12345678", "qwerty123", "letmein", "iloveyou",
        "admin123", "welcome1", "password1", "123456789", "abc12345",
    ];
    if (commonPasswords.includes(password.toLowerCase())) {
        return { valid: false, message: "This password is too common. Please choose a stronger one." };
    }
    return { valid: true, message: "Password is strong." };
}
const register = async (req, res) => {
    try {
        console.log("Hitted");
        const { name, email, username, passwordHash } = req.body;
        if (!name || !email || !username || !passwordHash) {
            res.status(400).json({
                success: false,
                message: "Please provide name, email, username, and password.",
            });
            return;
        }
        const existingUser = await user_model_1.default.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: existingUser.email === email
                    ? "User with this email already exists."
                    : "Username is already taken.",
            });
            return;
        }
        const passwordCheck = isPasswordStrong(passwordHash);
        if (!passwordCheck.valid) {
            res.status(400).json({
                success: false,
                message: passwordCheck.message,
            });
            return;
        }
        const hashedPassword = await bcrypt_1.default.hash(passwordHash, 10);
        const user = await user_model_1.default.create({
            name,
            email,
            username,
            passwordHash: hashedPassword,
        });
        const userResponse = {
            username: user.username,
            email: user.email,
            name: user.name,
            followerCount: user.followerCount,
            followingCount: user.followingCount,
            followers: user.followers,
            following: user.following,
            bio: user.bio,
            profile_url: user.profile_url,
            cover_url: user.cover_url,
        };
        const token = (0, generateToken_1.default)({ userId: user._id.toString() });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        const response = {
            success: true,
            message: "User registered successfully!",
            user: userResponse,
        };
        res.status(201).json(response);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { username, passwordHash } = req.body;
        if (!username || !passwordHash) {
            res.status(400).json({ success: false, message: "Please provide username and password" });
            return;
        }
        const user = await user_model_1.default.findOne({ username }).select("+passwordHash");
        if (!user) {
            res.status(401).json({ success: false, message: "Invalid username or password" });
            return;
        }
        const isPasswordValid = await bcrypt_1.default.compare(passwordHash, user.passwordHash);
        if (!isPasswordValid) {
            res.status(401).json({ success: false, message: "Invalid username or password" });
            return;
        }
        const token = (0, generateToken_1.default)({ userId: user._id.toString() });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        const userResponse = {
            username: user.username,
            email: user.email,
            name: user.name,
            followerCount: user.followerCount,
            followingCount: user.followingCount,
            followers: user.followers,
            following: user.following,
            bio: user.bio,
            profile_url: user.profile_url,
            cover_url: user.cover_url,
        };
        const response = {
            success: true,
            user: userResponse,
            message: "User logged in successfully",
        };
        res.status(200).json(response);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal error" });
    }
};
exports.login = login;
const logout = async (req, res) => {
    try {
        res.cookie("token", "", {
            httpOnly: true,
            secure: false,
            sameSite: "strict",
            maxAge: 0,
        });
        res.json({ success: true, message: "Logged out successfully" });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "server error" });
    }
};
exports.logout = logout;
const getMe = async (req, res) => {
    try {
        const userId = req.user?._id;
        const user = await user_model_1.default.findById(userId);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        res.status(200).json({ success: true, user });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Error occured" });
    }
};
exports.getMe = getMe;
const followUser = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
            return;
        }
        const id = req.params.id;
        if (typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({
                success: false,
                message: "Invalid user id",
            });
            return;
        }
        const currentUser = await user_model_1.default.findById(req.user._id);
        const userToFollow = await user_model_1.default.findById(id);
        if (!currentUser || !userToFollow) {
            res.status(404).json({
                success: false,
                message: "User not found",
            });
            return;
        }
        if (currentUser._id.equals(userToFollow._id)) {
            res.status(400).json({
                success: false,
                message: "You cannot follow yourself",
            });
            return;
        }
        if (currentUser.following.includes(userToFollow._id)) {
            res.status(400).json({
                success: false,
                message: "Already following this user",
            });
            return;
        }
        currentUser.following.push(userToFollow._id);
        currentUser.followingCount++;
        userToFollow.followers.push(currentUser._id);
        userToFollow.followerCount++;
        await currentUser.save();
        await userToFollow.save();
        await (0, notification_services_1.createNotification)({
            recipientId: userToFollow._id.toString(),
            senderId: currentUser._id.toString(),
            type: "follow",
            text: "started following you",
        });
        res.status(200).json({
            success: true,
            message: "User followed successfully!",
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
exports.followUser = followUser;
const unfollowUser = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }
        const { id } = req.params;
        if (!mongoose_1.default.Types.ObjectId.isValid(id)) {
            res.status(400).json({ success: false, message: "Invalid user id" });
            return;
        }
        const userToUnfollow = await user_model_1.default.findById(id);
        if (!userToUnfollow) {
            res.status(404).json({ success: false, message: "User not found." });
            return;
        }
        const isFollowing = await user_model_1.default.exists({ _id: req.user._id, following: id });
        if (!isFollowing) {
            res.status(400).json({ success: false, message: "You are not following this user." });
            return;
        }
        await user_model_1.default.findByIdAndUpdate(req.user._id, {
            $pull: { following: id },
            $inc: { followingCount: -1 },
        });
        await user_model_1.default.findByIdAndUpdate(id, {
            $pull: { followers: req.user._id },
            $inc: { followerCount: -1 },
        });
        res.status(200).json({ success: true, message: "User unfollowed successfully." });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};
exports.unfollowUser = unfollowUser;
const getFollowData = async (req, res) => {
    try {
        const id = req.params.id;
        if (typeof id !== "string" || !mongoose_1.default.Types.ObjectId.isValid(id)) {
            return res.status(400).json({
                success: false,
                message: "Valid user id required",
            });
        }
        const user = await user_model_1.default.findById(id)
            .select("followers following")
            .populate("followers", "name username profile_url")
            .populate("following", "name username profile_url")
            .lean();
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }
        return res.status(200).json({
            success: true,
            following: user.following,
            followers: user.followers,
        });
    }
    catch (error) {
        console.error("Get follow data error", error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};
exports.getFollowData = getFollowData;
const getRecommendations = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "Unauthorized" });
            return;
        }
        const excludeIds = [...(req.user.following || []), req.user._id];
        const users = await user_model_1.default.find({ _id: { $nin: excludeIds } })
            .select("name username profile_url bio followerCount")
            .sort({ followerCount: -1 })
            .limit(10);
        res.status(200).json({
            success: true,
            users,
            message: "Recommendations fetched successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getRecommendations = getRecommendations;
//# sourceMappingURL=user.controller.js.map