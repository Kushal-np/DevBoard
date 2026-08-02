"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getConversationById = exports.getMessages = exports.getOrCreateConversation = exports.getConversations = void 0;
const conversation_model_1 = __importDefault(require("../models/conversation.model"));
const message_model_1 = __importDefault(require("../models/message.model"));
const mongoose_1 = __importDefault(require("mongoose"));
const getConversations = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }
        const conversations = await conversation_model_1.default.find({ participants: userId })
            .populate("participants", "name username profile_url")
            .sort({ lastMessageAt: -1 });
        res.status(200).json({ success: true, conversations });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getConversations = getConversations;
const getOrCreateConversation = async (req, res) => {
    try {
        const userId = req.user?._id;
        const { recipientId } = req.body;
        if (!userId) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }
        if (!recipientId) {
            res.status(400).json({ success: false, message: "recipientId is required" });
            return;
        }
        let conversation = await conversation_model_1.default.findOne({
            participants: { $all: [userId, recipientId], $size: 2 },
        }).populate("participants", "name username profile_url");
        if (!conversation) {
            conversation = await conversation_model_1.default.create({ participants: [userId, recipientId] });
            conversation = await conversation.populate("participants", "name username profile_url");
        }
        res.status(200).json({ success: true, conversation });
    }
    catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getOrCreateConversation = getOrCreateConversation;
const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        if (!conversationId ||
            Array.isArray(conversationId) ||
            !mongoose_1.default.Types.ObjectId.isValid(conversationId)) {
            res.status(400).json({ success: false, message: "Invalid conversationId" });
            return;
        }
        const conversation = await conversation_model_1.default.findById(conversationId);
        if (!conversation) {
            res.status(404).json({ success: false, message: "Conversation not found" });
            return;
        }
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }
        const isParticipant = conversation.participants.some((participant) => participant.toString() === userId.toString());
        if (!isParticipant) {
            res.status(403).json({ success: false, message: "You are not a participant in this conversation" });
            return;
        }
        const messages = await message_model_1.default.find({
            conversationId: new mongoose_1.default.Types.ObjectId(conversationId),
        })
            .populate("senderId", "name username profile_url")
            .sort({ createdAt: 1 });
        res.status(200).json({ success: true, messages });
    }
    catch (error) {
        console.error("Get messages error:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getMessages = getMessages;
const getConversationById = async (req, res) => {
    try {
        const userId = req.user?._id;
        if (!userId) {
            res.status(401).json({ success: false, message: "Not authenticated" });
            return;
        }
        const conversationId = Array.isArray(req.params.conversationId)
            ? req.params.conversationId[0]
            : req.params.conversationId;
        if (!conversationId || !mongoose_1.default.Types.ObjectId.isValid(conversationId)) {
            res.status(400).json({ success: false, message: "Invalid conversationId" });
            return;
        }
        const conversation = await conversation_model_1.default.findById(conversationId).populate("participants", "name username profile_url");
        if (!conversation) {
            res.status(404).json({ success: false, message: "Conversation not found" });
            return;
        }
        const isParticipant = conversation.participants.some((participant) => {
            return participant._id.toString() === userId.toString();
        });
        if (!isParticipant) {
            res.status(403).json({ success: false, message: "Not a participant" });
            return;
        }
        res.status(200).json({ success: true, conversation });
    }
    catch (error) {
        console.error("Error fetching conversation:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};
exports.getConversationById = getConversationById;
//# sourceMappingURL=message.controller.js.map