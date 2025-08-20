import { HTTP_BACKEND } from "../config";
import axios from "axios";

type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "pen";
      x: number;
      y: number;
    };

export default async function initDraw(
  canvas: HTMLCanvasElement,
  tool: "pen" | "rect" | undefined,
  roomid: string,
  socket: WebSocket
) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const existingShapes: Shape[] = await getShapes(roomid);
  console.log("initial shapes:", existingShapes);

  socket.addEventListener("message", (ev) => {
  const data = JSON.parse(ev.data);
  if (data.type === "chat") {
    const parsedData = JSON.parse(data.message);
    if (parsedData.shape) {
      existingShapes.push(parsedData.shape);
      reDraw(ctx, canvas, existingShapes);
    }
  }
});


  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "white";
  ctx.lineWidth = 1;

  let drawing = false;
  let startX = 0;
  let startY = 0;

  const handleMousedown = (e: MouseEvent) => {
    drawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
  };

  const handleMouseup = (e: MouseEvent) => {
    drawing = false;
    const currentX = e.offsetX;
    const currentY = e.offsetY;

    if (tool === "rect") {
      const rect: Shape = {
        type: "rect",
        x: startX,
        y: startY,
        width: currentX - startX,
        height: currentY - startY,
      };
      existingShapes.push(rect);

      socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify({
            shape: rect, 
          }),
          roomid,
        })
      );
    }

    if (tool === "pen") {
      const pen: Shape = {
        type: "pen",
        x: currentX,
        y: currentY,
      };
      existingShapes.push(pen);

      socket.send(
        JSON.stringify({
          type: "chat",
          message: JSON.stringify({
            shape: pen,
          }),
          roomid,
        })
      );
    }

    reDraw(ctx, canvas, existingShapes);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!drawing) return;

    const currentX = e.offsetX;
    const currentY = e.offsetY;

    if (tool === "pen") {
      ctx.lineTo(currentX, currentY);
      ctx.stroke();
    }

    if (tool === "rect") {
      reDraw(ctx, canvas, existingShapes);

      ctx.strokeStyle = "white";
      ctx.strokeRect(startX, startY, currentX - startX, currentY - startY);
    }
  };

  canvas.addEventListener("mousedown", handleMousedown);
  canvas.addEventListener("mouseup", handleMouseup);
  canvas.addEventListener("mousemove", handleMouseMove);

  return () => {
    canvas.removeEventListener("mousedown", handleMousedown);
    canvas.removeEventListener("mouseup", handleMouseup);
    canvas.removeEventListener("mousemove", handleMouseMove);
  };
}

export function reDraw(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  shapes: Shape[]
) {
  ctx.fillStyle = "#1e1e1e";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = "white";

  for (let i = 0; i < shapes.length; i++) {
    let shape = shapes[i];
    if (!shape) continue;

    if (shape.type === "rect") {
      ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
    }
    if (shape.type === "pen") {
      ctx.beginPath();
      ctx.moveTo(shape.x, shape.y);
      ctx.lineTo(shape.x, shape.y);
      ctx.stroke();
    }
  }
}

export async function getShapes(roomid: string) {
  const response = await axios.get(
    `http://localhost:3001/api/v1/chats/${roomid}`
  );
  const messages = response.data.messages;

  const shapes: Shape[] = messages.map((x: { message: string }) =>
    JSON.parse(x.message).shape 
  );

  return shapes;
}
