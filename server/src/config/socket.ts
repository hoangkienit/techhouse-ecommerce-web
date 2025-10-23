import { Server } from "socket.io";
import jwt from "jsonwebtoken";
import logger from "../config/logger";
import { AuthenticatedSocket } from "../interfaces/socket.interface";
import { IUserPayload } from "../interfaces/jwt.interface";

let io: Server;

export const initializeSocket = (server: any) => {
  io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST"],
      credentials: true,
    },
    path: "/ws/socket.io",
  });

  console.log("🟢 Socket.io server initialized");

  io.use((socket: AuthenticatedSocket, next) => {
    const token = socket.handshake.auth?.token;
    if (token) {
      try {
        const user = jwt.verify(token, process.env.JWT_SECRET as string) as IUserPayload;
        socket.user = user;
      } catch (err) {
        socket.user = null;
        logger.warn("⚠️ Invalid token provided, continuing as guest");
      }
    } else {
      socket.user = null;
    }
    next();
  });

  io.on("connection", (socket: AuthenticatedSocket) => {
    console.log(`🔌 Client connected: ${socket.id} (${socket.user ? socket.user.fullname : "Guest"})`);

    // Join product room (each product has its own room)
    socket.on("join_product", (productId: string) => {
      socket.join(productId);
      console.log(`📦 Socket ${socket.id} joined room: ${productId}`);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket.io not initialized!");
  return io;
};
