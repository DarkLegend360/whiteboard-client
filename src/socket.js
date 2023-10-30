import { io } from "socket.io-client";

const isProduction = process.env.NODE_ENV === "production";

export const socket = io(
  isProduction
    ? "https://whiteboard-server-7vme.onrender.com"
    : "http://localhost:4000"
);
