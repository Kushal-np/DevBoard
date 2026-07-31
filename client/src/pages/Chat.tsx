import { useEffect } from "react";
import { io } from "socket.io-client";

export default function SocketTest() {
  useEffect(() => {
    const socket = io("http://localhost:8000", {
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("✅ Connected");
      console.log("Socket ID:", socket.id);
    });

    socket.on("connect_error", (err) => {
      console.log("❌ Connection Error:", err.message);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  return <h1>Socket Test</h1>;
}