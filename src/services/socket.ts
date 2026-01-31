import io, { Socket } from "socket.io-client";

let socket: Socket | null = null;

export const initializeSocket = (): Socket => {
  if (socket) {
    console.log("✅ Socket already initialized, reusing connection");
    return socket;
  }

  console.log("🔌 Initializing socket connection...");
  socket = io(import.meta.env.VITE_SOCKET_URL || import.meta.env.VITE_BACKEND_URL || "http://localhost:3000", {
    withCredentials: true,
    reconnection: true,
    reconnectionDelay: 2000,
    reconnectionDelayMax: 10000,
    reconnectionAttempts: 5,
    autoConnect: true,
  });

  socket.on("connect", () => {
    console.log("✅ Socket connected:", socket?.id);
  });

  socket.on("disconnect", () => {
    console.log("👋 Socket disconnected");
  });

  socket.on("connect_error", (error: any) => {
    console.error("❌ Socket connection error:", error.message);
    if (error?.message?.includes("401") || error?.message?.includes("Unauthorized")) {
      console.log("Session expired - socket auth failed");
    }
  });

  return socket;
};

export const getSocket = (): Socket | null => {
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
