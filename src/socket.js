import { io } from "socket.io-client";

const isProduction = process.env.NODE_ENV === "production";
const url = isProduction
  ? "https://whiteboard-server-7vme.onrender.com"
  : "http://localhost:4000";
export const socket = io(url);
