import { WebSocketServer, WebSocket } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "@repo/backend-envs/config";
import { prismaClient } from "@repo/database/client";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  userId: string;
  ws: WebSocket;
  rooms: string[];
}

const users: User[] = [];

function checkUser(token: string | null): string | null {
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id?: string } | string;
    if (typeof decoded === "string" || !decoded.id) return null;
    return decoded.id;
  } catch (e) {
    console.error("JWT verification failed:", e);
    return null;
  }
}

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) {
    ws.close();
    return;
  }

  const params = new URLSearchParams(url.split("?")[1]);
  const token = params.get("token");
  const userId = checkUser(token);

  if (!userId) {
    ws.close();
    return;
  }

  const newUser: User = { userId, ws, rooms: [] };
  users.push(newUser);

  console.log(`User ${userId} connected. Total: ${users.length}`);

  ws.on("message", async (rawData) => {
    let parsedData: any;
    try {
      parsedData = JSON.parse(
        typeof rawData === "string" ? rawData : rawData.toString()
      );
    } catch (err) {
      console.error("Invalid JSON:", err);
      return;
    }

    if (parsedData.type === "join_room") {
      newUser.rooms.push(parsedData.roomId);
      console.log(`User ${userId} joined room ${parsedData.roomId}`);
    }

    if (parsedData.type === "leave_room") {
      newUser.rooms = newUser.rooms.filter((r) => r !== parsedData.roomId);
      console.log(`User ${userId} left room ${parsedData.roomId}`);
    }


    if (parsedData.type === "chat") {
      const { roomId, message } = parsedData;

      await prismaClient.chat.create({
        data: {
          roomid: roomId,
          message,
          userId,
        },
      });
      
      users.forEach((user) => {
        if (user.rooms.includes(roomId)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message,
              userId,
            })
          );
        }
      });
    }
  });

  ws.on("close", () => {
    const index = users.findIndex((u) => u.ws === ws);
    if (index !== -1) users.splice(index, 1);
    console.log(`User ${userId} disconnected. Total: ${users.length}`);
  });
});
