import { initDraw } from "../draw";
import { useEffect, useRef, useState } from "react";
import { IconBtn } from "./iconButton";
import { Circle, Pencil, RectangleHorizontalIcon } from "lucide-react";
import { Game } from "../draw/game";

export type Tool = "circle" | "rect" | "pencil";

export function Canvas({
    roomid,
    socket
}: {
    socket: WebSocket;
    roomid:number;
}) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [game, setGame] = useState<Game>();
    const [selectedTool, setSelectedTool] = useState<Tool>("circle")

    useEffect(() => {
        game?.setTool(selectedTool);
    }, [selectedTool, game]);

    useEffect(() => {

        if (canvasRef.current) {
            const g = new Game(canvasRef.current, roomid, socket);
            setGame(g);

            return () => {
                g.destroy();
            }
        }


    }, [canvasRef]);

    return <div style={{
        height: "100vh",
        overflow: "hidden"
    }}>
        <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight}></canvas>
        <Topbar setSelectedTool={setSelectedTool} selectedTool={selectedTool} />
    </div>
}

function Topbar({selectedTool, setSelectedTool}: {
    selectedTool: Tool,
    setSelectedTool: (s: Tool) => void
}) {
    return <div style={{
            position: "fixed",
            top: 10,
            left: 10
        }}>
            <div className="flex gap-t">
                <IconBtn 
                    onClick={() => {
                        setSelectedTool("pencil")
                    }}
                    activated={selectedTool === "pencil"}
                    icon={<Pencil />}
                />
                <IconBtn onClick={() => {
                    setSelectedTool("rect")
                }} activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon />} ></IconBtn>
                <IconBtn onClick={() => {
                    setSelectedTool("circle")
                }} activated={selectedTool === "circle"} icon={<Circle />}></IconBtn>
            </div>
        </div>
}