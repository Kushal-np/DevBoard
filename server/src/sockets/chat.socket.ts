import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import Message from "../models/message.model";
import Conversation from "../models/conversation.model";
import { IJWTPayload } from "../interfaces/Response/Jwt";

// Very small skeleton: auth via the same cookie-based JWT, one room per
// conversationId, broadcast "receive-message" to everyone in that room.
export const initChatSocket = (server: HTTPServer) => {
  const io = new SocketIOServer(server, {
    cors: { origin: "http://localhost:5173", credentials: true },
  });

  io.use((socket: Socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie || "";
      const tokenMatch = cookieHeader.match(/token=([^;]+)/);
      if (!tokenMatch) return next(new Error("No token"));

      const decoded = jwt.verify(tokenMatch[1], process.env.JWT_SECRET_KEY!) as IJWTPayload;
      socket.data.userId = decoded.userId;
      next();
    } catch {
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket: Socket) => {
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
        await Conversation.findByIdAndUpdate(conversationId, {
          lastMessage: text,
          lastMessageAt: new Date(),
        });

        io.to(conversationId).emit("receive-message", message);
      }
    );

    socket.on("disconnect", () => {
      // no-op for now; add presence tracking here later
    });
  });

  return io;
};
