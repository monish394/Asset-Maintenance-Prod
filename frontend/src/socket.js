import { io } from "socket.io-client";

// In development, connect to localhost:5000.
// In production (Vercel + Render), VITE_API_URL = https://your-app.onrender.com
const SOCKET_URL = import.meta.env.DEV
    ? "http://localhost:5000"
    : (import.meta.env.VITE_API_URL?.replace("/api", "") || window.location.origin);

export const socket = io(SOCKET_URL, {
    autoConnect: false,
});
