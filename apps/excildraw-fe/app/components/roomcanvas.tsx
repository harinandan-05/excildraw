import { useEffect, useState } from "react";
import { Canvas } from "./mainCanvas";
import { WS_BACKEND } from "../config";

type RoomCanvasProps = {
  roomid: string;
};

export default function RoomCanvas({ roomid }: RoomCanvasProps) {
  const [socket, setSocket] = useState<WebSocket>();

  useEffect(() => {
    const ws = new WebSocket(`${WS_BACKEND}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFiOTc4Yjk1LTIwMWEtNGFiNi1hZWZkLTBhNzhhYjM5NjM4YyIsImlhdCI6MTc1NTYxNzM3MX0.68q6UFCjmEOVDdp2for7tluD6OFsaLxhYOEyQcvviWU`); 
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
