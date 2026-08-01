import { Server as HTTPServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";
import jwt, { JwtPayload } from "jsonwebtoken";

import Message from "../models/message.model";
import Conversation from "../models/conversation.model";
import { IJWTPayload } from "../interfaces/Response/Jwt";

export const initChatSocket = (server: HTTPServer) => {
  console.log("Socket initialized");

  const io = new SocketIOServer(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true,
    },
  });

  io.use((socket: Socket, next) => {
    try {
      const cookieHeader = socket.handshake.headers.cookie ?? "";

      const token = cookieHeader.match(/token=([^;]+)/)?.[1];

      if (!token) {
        return next(new Error("No token provided"));
      }

      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET_KEY as string
      ) as JwtPayload & IJWTPayload;

      if (!decoded.userId) {
        return next(new Error("Invalid token"));
      }

      socket.data.userId = decoded.userId;

      next();
    } catch (error) {
      console.error("Socket authentication failed:", error);
      next(new Error("Unauthorized"));
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log(
      `User ${socket.data.userId} connected (${socket.id})`
    );

    socket.on("join-conversation", (conversationId: string) => {
      console.log(
        `${socket.data.userId} joined conversation ${conversationId}`
      );

      socket.join(conversationId);
    });

    socket.on("leave-conversation", (conversationId: string) => {
      console.log(
        `${socket.data.userId} left conversation ${conversationId}`
      );

      socket.leave(conversationId);
    });

    socket.on(
      "send-message",
      async ({
        conversationId,
        text,
      }: {
        conversationId: string;
        text: string;
      }) => {
        try {
          const senderId = socket.data.userId;

          const message = await Message.create({
            conversationId,
            senderId,
            text,
          });

          await Conversation.findByIdAndUpdate(conversationId, {
            lastMessage: text,
            lastMessageAt: new Date(),
          });

          console.log(
            `Message sent in ${conversationId}: ${text}`
          );

          io.to(conversationId).emit("receive-message", message);
        } catch (error) {
          console.error("Error sending message:", error);

          socket.emit("message-error", {
            message: "Failed to send message.",
          });
        }
      }
    );

    socket.on("disconnect", (reason) => {
      console.log(
        `User ${socket.data.userId} disconnected (${reason})`
      );
    });
  });

  return io;
};