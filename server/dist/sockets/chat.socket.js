"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initChatSocket = void 0;
const socket_io_1 = require("socket.io");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const message_model_1 = __importDefault(require("../models/message.model"));
const conversation_model_1 = __importDefault(require("../models/conversation.model"));
const socketRegistry_1 = require("./socketRegistry");
const notification_services_1 = require("../services/notification.services");
const initChatSocket = (server) => {
    console.log("Socket initialized");
    const io = new socket_io_1.Server(server, {
        cors: { origin: "http://localhost:5173", credentials: true },
    });
    (0, socketRegistry_1.setIO)(io);
    io.use((socket, next) => {
        try {
            const cookieHeader = socket.handshake.headers.cookie || "";
            const tokenMatch = cookieHeader.match(/token=([^;]+)/);
            if (!tokenMatch)
                return next(new Error("No token"));
            const token = tokenMatch[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET_KEY);
            socket.data.userId = decoded.userId;
            next();
        }
        catch {
            next(new Error("Unauthorized"));
        }
    });
    io.on("connection", (socket) => {
        const userId = socket.data.userId;
        // Personal room — lets any part of the backend push a notification
        // to this user directly, without needing to know which socket id
        // they're currently connected with (they may have multiple tabs open).
        socket.join(`user:${userId}`);
        console.log(`User ${userId} connected (${socket.id})`);
        socket.on("join-conversation", (conversationId) => {
            socket.join(conversationId);
        });
        socket.on("leave-conversation", (conversationId) => {
            socket.leave(conversationId);
        });
        socket.on("send-message", async ({ conversationId, text }) => {
            const senderId = socket.data.userId;
            const message = await message_model_1.default.create({ conversationId, senderId, text });
            const populatedMessage = await message.populate("senderId", "name username profile_url");
            await conversation_model_1.default.findByIdAndUpdate(conversationId, {
                lastMessage: text,
                lastMessageAt: new Date(),
            });
            io.to(conversationId).emit("receive-message", populatedMessage);
            const conversation = await conversation_model_1.default.findById(conversationId);
            if (conversation) {
                const recipients = conversation.participants.filter((p) => p.toString() !== senderId);
                for (const recipientId of recipients) {
                    await (0, notification_services_1.createNotification)({
                        recipientId: recipientId.toString(),
                        senderId,
                        type: "message",
                        text: "sent you a message",
                        conversationId,
                    });
                }
            }
        });
        socket.on("disconnect", () => {
            console.log(`User ${userId} disconnected (${socket.id})`);
        });
    });
    return io;
};
exports.initChatSocket = initChatSocket;
//# sourceMappingURL=chat.socket.js.map