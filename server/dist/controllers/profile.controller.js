"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAccount = exports.changePassword = exports.editProfile = exports.getUserProfile = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const user_model_1 = __importDefault(require("../models/user.model"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const getUserProfile = async (req, res) => {
    const { username } = req.params;
    if (!req.user) {
        res.status(401).json({ success: false, message: "Unauthorized" });
        return;
    }
    const user = await user_model_1.default.findOne({ username }).select("-passwordHash");
    if (!user) {
        res.status(404).json({ success: false, message: "User not found" });
        return;
    }
    res.status(200).json({ success: true, user });
};
exports.getUserProfile = getUserProfile;
const editProfile = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }
        const { name, username, bio } = req.body;
        let { socialMedia } = req.body;
        const user = await user_model_1.default.findById(req.user._id);
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        if (username && username !== user.username) {
            const existing = await user_model_1.default.findOne({ username });
            if (existing) {
                res.status(409).json({ success: false, message: "Username is already taken" });
                return;
            }
            user.username = username;
        }
        if (typeof name === "string" && name.trim())
            user.name = name.trim();
        if (typeof bio === "string")
            user.bio = bio;
        if (socialMedia) {
            socialMedia = typeof socialMedia === "string" ? JSON.parse(socialMedia) : socialMedia;
            user.socialMedia = { ...(user.socialMedia ?? {}), ...socialMedia };
        }
        const files = req.files;
        const profileFile = files?.profile_image?.[0];
        const coverFile = files?.cover_image?.[0];
        if (profileFile) {
            const uploadResult = await cloudinary_1.default.uploader.upload(profileFile.path, {
                folder: "users/avatars",
            });
            user.profile_url = uploadResult.secure_url;
        }
        if (coverFile) {
            const uploadResult = await cloudinary_1.default.uploader.upload(coverFile.path, {
                folder: "users/covers",
            });
            user.cover_url = uploadResult.secure_url;
        }
        await user.save();
        const safeUser = user.toObject();
        delete safeUser.passwordHash;
        res.status(200).json({
            success: true,
            user: safeUser,
            message: "Profile updated successfully",
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.editProfile = editProfile;
const changePassword = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            res.status(400).json({
                success: false,
                message: "Current and new password are required",
            });
            return;
        }
        if (String(newPassword).length < 6) {
            res.status(400).json({
                success: false,
                message: "New password must be at least 6 characters",
            });
            return;
        }
        const user = await user_model_1.default.findById(req.user._id).select("+passwordHash");
        if (!user) {
            res.status(404).json({ success: false, message: "User not found" });
            return;
        }
        const isValid = await bcrypt_1.default.compare(currentPassword, user.passwordHash);
        if (!isValid) {
            res.status(401).json({ success: false, message: "Current password is incorrect" });
            return;
        }
        user.passwordHash = await bcrypt_1.default.hash(newPassword, 10);
        await user.save();
        res.status(200).json({ success: true, message: "Password updated successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.changePassword = changePassword;
const deleteAccount = async (req, res) => {
    try {
        if (!req.user) {
            res.status(401).json({ success: false, message: "User not authenticated" });
            return;
        }
        await user_model_1.default.findByIdAndDelete(req.user._id);
res.cookie("token", token, {
  httpOnly: true,
  secure: true,
  sameSite: "none",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});
        res.status(200).json({ success: true, message: "Account deleted successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.deleteAccount = deleteAccount;
//# sourceMappingURL=profile.controller.js.map