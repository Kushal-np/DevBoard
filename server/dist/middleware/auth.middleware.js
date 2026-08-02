"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const user_model_1 = __importDefault(require("../models/user.model"));
const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        res.status(401).json({ message: "No token" });
        return;
    }
    const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
    const user = await user_model_1.default.findById(decoded.userId);
    if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
    }
    req.user = {
        _id: user._id.toString(),
        username: user.username,
        email: user.email,
        name: user.name,
        passwordHash: user.passwordHash,
        followerCount: user.followerCount,
        followingCount: user.followingCount,
        followers: user.followers,
        following: user.following,
        bio: user.bio,
        profile_url: user.profile_url,
        cover_url: user.cover_url,
    };
    next();
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=auth.middleware.js.map