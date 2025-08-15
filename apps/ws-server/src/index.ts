import { WebSocketServer, WebSocket } from "ws";
import jwt, { decode, JwtPayload } from "jsonwebtoken";
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
  if (!token) {
    return null;
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id?: string } | string;
    if (typeof decoded === "string" || !decoded.id) return null;
    return decoded.id;
  } catch (e) {
    console.log(e);
    return null;
  }
}

wss.on("connection", (ws, request) => {
  const url = request.url;
  if (!url) {
    return null;
  }

  const params = new URLSearchParams(request.url?.split("?")[1]);
  const token = params.get("token");
  const userId = checkUser(token);

  if (userId == null) {
    ws.close();
    return null;
  }

  ws.on("message", async function message(data) {
    let parsedData;
    if (typeof data !== "string") {
      parsedData = JSON.parse(data.toString());
    } else {
      parsedData = JSON.parse(data);
    }

    if (parsedData.type === "join_room") {
      const user = users.find((x) => x.ws === ws);
      user?.rooms.push(parsedData.roomId);
    }

    if (parsedData.type === "leave_room") {
      const user = users.find((x) => x.ws === ws);
      if (!user) {
        return;
      }
      user.rooms = user.rooms.filter((x) => x === parsedData.room);
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId;
      const message = parsedData.message;

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
              data: "chat",
              message,
              userId,
            })
          );
        }
      });
    }
  });
});
