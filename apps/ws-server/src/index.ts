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

  ws.on("message", async function message(data){
    let parsedData: any;
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
      console.log(parsedData)
    } else {
      parsedData = JSON.parse(data); // {type: "join-room", roomId: 1}
    }

    if (parsedData.type === "join_room") {
      newUser.rooms.push(parsedData.roomid);
      console.log(`User ${userId} joined room ${parsedData.roomId}`);
    }

    if (parsedData.type === "leave_room") {
      newUser.rooms = newUser.rooms.filter((r) => r !== parsedData.roomId);
      console.log(`User ${userId} left room ${parsedData.roomId}`);
    }


    if (parsedData.type === "chat") {
      const { roomid, message } = parsedData;
      const roomIdInt = Number(roomid);

      if (isNaN(roomIdInt)) {
      console.error("Invalid roomid:", roomid);
      return;
      }

      await prismaClient.chat.create({
        data: {
          roomid: roomIdInt,
          message,
          userId,
        },
      });
            
      users.forEach((user) => {


        if (user.rooms.includes(roomid)) {
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
