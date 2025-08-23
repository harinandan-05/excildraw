import { useEffect, useState } from "react";
import { Canvas } from "./mainCanvas";
import { WS_BACKEND } from "../config";

type RoomCanvasProps = {
  roomid: number;
};

export default function RoomCanvas({ roomid }: RoomCanvasProps) {
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {

    const token = localStorage.getItem('token')
    if(!token){
      return;
    }

    const ws = new WebSocket(`${WS_BACKEND}?token=${token}`); 
    setSocket(ws);

    ws.onopen = () => {
      const data = JSON.stringify({
        type: "join_room",
        roomid,
      });
      ws.send(data); 
    };

    return () => {
      ws.close(); 
    };
  }, [roomid]);

  
  if(!socket){
    return <div>
        loading.......
    </div>
  }
  return <Canvas roomid={roomid} socket={socket}/>;
}
