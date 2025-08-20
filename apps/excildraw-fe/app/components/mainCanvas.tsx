"use client";

import initDraw from "@/app/draw";
import { use, useEffect, useRef, useState, } from "react";
import { useParams } from "next/navigation";
import { IconBtn } from "./inconButton";
import { BiPencil } from "react-icons/bi";
import { BsPencilFill } from "react-icons/bs";
import { PencilIcon, RectangleEllipsisIcon, RectangleHorizontal } from "lucide-react";


export default function MainCanvas({roomid,socket}:{
    roomid:string,
    socket:WebSocket
}) {
    const [tool ,setTool] = useState<"pen"|"rect">("rect")
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(() =>{
        const canvas = canvasRef.current
        if(!canvas){return}
        initDraw(canvas,tool,roomid,socket)
    
    },[tool])

  return (
    
    <div>
      <canvas ref={canvasRef}></canvas>
      <Topbar tool={tool} setTool={setTool} />
    </div>
  );
}


function Topbar({tool,setTool}:{
  tool:"pen" | "rect";
 setTool: React.Dispatch<React.SetStateAction<"pen" | "rect">>
}){
  return(
<div style={{
      height:"100vh",
      overflow:"hidden"
    }}>
        <div style={{
          position:"fixed",
          top:10,
          display:"flex",
          justifyContent:"center",
        }}>
          <IconBtn icon={<PencilIcon />} onClick={() => setTool("pen")}/>
          <IconBtn icon={<RectangleHorizontal/>} onClick={() => setTool("rect")}/>
    </div>
    </div>
  )
}