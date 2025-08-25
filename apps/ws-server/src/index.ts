import { WebSocketServer, WebSocket } from "ws";
import * as jwt from "jsonwebtoken"
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

  ws.on("message", async function message(data) {
    let parsedData: { type: string; roomid?: string; message?: string };

    try {
      parsedData =
        typeof data === "string" ? JSON.parse(data) : JSON.parse(data.toString());
    } catch (err) {
      console.error("Invalid JSON", err);
      return;
    }

    if (parsedData.type === "join_room" && parsedData.roomid) {
      newUser.rooms.push(parsedData.roomid);
      console.log(`User ${userId} joined room ${parsedData.roomid}`);
    }

    if (parsedData.type === "leave_room" && parsedData.roomid) {
      newUser.rooms = newUser.rooms.filter((r) => r !== parsedData.roomid);
      console.log(`User ${userId} left room ${parsedData.roomid}`);
    }

    if (parsedData.type === "chat" && parsedData.roomid && parsedData.message) {
      const roomIdInt = Number(parsedData.roomid);

      if (isNaN(roomIdInt)) {
        console.error("Invalid roomid:", parsedData.roomid);
        return;
      }

      try {
        await prismaClient.chat.create({
          data: {
            roomid: roomIdInt,
            message: parsedData.message,
            userId,
          },
        });
      } catch (err) {
        console.error("Failed to save chat:", err);
      }

      users.forEach((user) => {
        if (user.rooms.includes(parsedData.roomid!)) {
          user.ws.send(
            JSON.stringify({
              type: "chat",
              message: parsedData.message,
              userId,
            })
          );
        }
      });
    }
  });

  ws.on("close", () => {
    console.log(`User ${userId} disconnected. Total: ${users.length}`);
  });
});
