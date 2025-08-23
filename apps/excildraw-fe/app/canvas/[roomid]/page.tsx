"use client";
import RoomCanvas from "@/app/components/roomcanvas";
import { useParams } from "next/navigation";

export default function Canvaspage(){
  const params = useParams<{roomid:string}>()
  const roomid  = params.roomid
  console.log(roomid,"canvas room")

  return <RoomCanvas roomid={Number(roomid)} />

}
