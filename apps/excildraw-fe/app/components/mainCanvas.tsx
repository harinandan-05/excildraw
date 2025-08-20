"use client";

import initDraw from "@/app/draw";
import { use, useEffect, useRef, useState, } from "react";
import { useParams } from "next/navigation";


export default function MainCanvas({roomid,socket}:{
    roomid:string,
    socket:WebSocket
}) {
    const [tool ,setTool] = useState<"pen"|"rect">()
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() =>{
        const canvas = canvasRef.current
        if(!canvas){return}
        initDraw(canvas,tool,roomid,socket)
    
    },[tool])

  return (
    <div>
        <canvas ref={canvasRef}></canvas>
        <button onClick={() =>setTool("pen")}>pen</button><br />
        <button onClick={() => setTool("rect")}>rectangle</button>
    </div>
  );
}
