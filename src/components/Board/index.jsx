"use client";
import { ColorEnum } from "@/enums";
import { drawLine, startDraw, changeSettings } from "../../utils";
import { useEffect, useRef } from "react";
import { socket } from "../../socket";

function Board(props) {
  const { color, size, getCanvasApi, saveHistoryData } = props;
  const canvasRef = useRef();
  const drawAllowed = useRef(false);
  const currentSettings = useRef({});

  useEffect(() => {
    currentSettings.current = { color, size };
  }, [color, size]);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    getCanvasApi(canvasRef.current);
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;

    const context = canvasRef.current.getContext("2d");

    context.fillStyle = ColorEnum.White;
    context.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    saveHistoryData(context);

    const handleMouseDown = (e) => {
      drawAllowed.current = true;
      changeSettings(
        context,
        currentSettings.current.color,
        currentSettings.current.size
      );
      startDraw(context, e.clientX, e.clientY);
      socket.emit("startDraw", {
        x: e.clientX,
        y: e.clientY,
        ...currentSettings.current,
      });
    };
    const handleMouseMove = (e) => {
      if (!drawAllowed.current) {
        return;
      }
      drawLine(context, e.clientX, e.clientY);
      socket.emit("drawLine", { x: e.clientX, y: e.clientY });
    };
    const handleMouseUp = () => {
      drawAllowed.current = false;
      saveHistoryData(context);
      socket.emit("drawEnd");
    };

    const handleSocketStartDraw = (data) => {
      const { x, y, color, size } = data;
      changeSettings(context, color, size);
      startDraw(context, x, y);
    };
    const handleSocketDrawLine = (data) => {
      const { x, y } = data;
      drawLine(context, x, y);
    };

    canvasRef.current.addEventListener("mousedown", handleMouseDown);
    canvasRef.current.addEventListener("mousemove", handleMouseMove);
    canvasRef.current.addEventListener("mouseup", handleMouseUp);

    socket.on("startDraw", handleSocketStartDraw);
    socket.on("drawLine", handleSocketDrawLine);
    return () => {
      canvasRef.current.removeEventListener("mousedown", handleMouseDown);
      canvasRef.current.removeEventListener("mousemove", handleMouseMove);
      canvasRef.current.removeEventListener("mouseup", handleMouseUp);

      socket.off("startDraw", handleSocketStartDraw);
      socket.off("drawLine", handleSocketDrawLine);
    };
  }, []);

  return <canvas style={{ border: "1px solid red" }} ref={canvasRef}></canvas>;
}

export default Board;
