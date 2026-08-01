import { Server as SocketIOServer } from "socket.io";

let ioInstance: SocketIOServer | null = null;

export const setIO = (io: SocketIOServer) => {
  ioInstance = io;
};

export const emitToUser = (userId: string, event: string, payload: unknown) => {
  if (!ioInstance) return;
  ioInstance.to(`user:${userId}`).emit(event, payload);
};