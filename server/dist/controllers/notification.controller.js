"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllAsRead = exports.markAsRead = exports.getNotifications = void 0;
const notification_model_1 = __importDefault(require("../models/notification.model"));
const getNotifications = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }
        const notifications = await notification_model_1.default.find({ recipientId: userId })
            .populate("senderId", "name username profile_url")
            .sort({ createdAt: -1 })
            .limit(50);
        const unreadCount = await notification_model_1.default.countDocuments({ recipientId: userId, read: false });
        res.status(200).json({ success: true, notifications, unreadCount });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getNotifications = getNotifications;
const markAsRead = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }
        const id = req.params.id;
        if (!id) {
            res.status(400).json({ success: false, message: "Notification id is required" });
            return;
        }
        await notification_model_1.default.findOneAndUpdate({ _id: id, recipientId: userId }, { read: true });
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }
        await notification_model_1.default.updateMany({ recipientId: userId, read: false }, { read: true });
        res.status(200).json({ success: true });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.markAllAsRead = markAllAsRead;
//# sourceMappingURL=notification.controller.js.map