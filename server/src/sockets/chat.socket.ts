import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/message.model";
import Conversation from "../models/conversation.model";
import { IJWTPayload } from "../interfaces/Response/Jwt";
import { setIO } from "./socketRegistry";
import { createNotification } from "../services/notification.services";

export const initChatSocket = (server: HTTPServer) => {
  console.log("Socket initialized");
  //client origin
  const io = new SocketIOServer(server, {
    cors: { origin: "https://devboard-platform.vercel.app/", credentials: true },
  });

  setIO(io);

  io.use((socket: Socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie || "";
      const tokenMatch = cookieHeader.match(/token=([^;]+)/);
      if (!tokenMatch) return next(new Error("No token"));

      const token = tokenMatch[1]!;
      const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as unknown as IJWTPayload;
      socket.data.userId = decoded.userId;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket: Socket) => {
    const userId = socket.data.userId;

    // Personal room — lets any part of the backend push a notification
    // to this user directly, without needing to know which socket id
    // they're currently connected with (they may have multiple tabs open).
    socket.join(`user:${userId}`);

    console.log(`User ${userId} connected (${socket.id})`);

    socket.on("join-conversation", (conversationId: string) => {
      socket.join(conversationId);
    });

    socket.on("leave-conversation", (conversationId: string) => {
      socket.leave(conversationId);
    });

    socket.on(
      "send-message",
      async ({ conversationId, text }: { conversationId: string; text: string }) => {
        const senderId = socket.data.userId;

        const message = await Message.create({ conversationId, senderId, text });
        const populatedMessage = await message.populate(
          "senderId",
          "name username profile_url"
        );

        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: text,
          lastMessageAt: new Date(),
        });

        io.to(conversationId).emit("receive-message", populatedMessage);

        const conversation = await Conversation.findById(conversationId);
        if (conversation) {
          const recipients = conversation.participants.filter(
            (p) => p.toString() !== senderId
          );

          for (const recipientId of recipients) {
            await createNotification({
              recipientId: recipientId.toString(),
              senderId,
              type: "message",
              text: "sent you a message",
              conversationId,
            });
          }
        }
      }
    );

    socket.on("disconnect", () => {
      console.log(`User ${userId} disconnected (${socket.id})`);
    });
  });

  return io;
};