"use client";
import React, { useRef, useState } from "react";
import Board from "../components/Board";
import Menu from "../components/Menu";
import { onDownloadCanvas } from "../utils";
import { ColorEnum, ToolEnum } from "@/enums";

export default function Home() {
  const [size, setSize] = useState(3);
  const [color, setColor] = useState(ColorEnum.Black);
  const [tool, setTool] = useState(ToolEnum.Brush);

  const canvasApi = useRef(null);
  const canvasHistory = useRef([]);
  const historyPointer = useRef(-1);

  const getCanvasApi = (canvas) => {
    canvasApi.current = canvas;
  };

  const saveHistoryData = (context) => {
    const { width, height } = canvasApi.current;
    const data = context.getImageData(0, 0, width, height);
    canvasHistory.current.push(data);
    historyPointer.current = canvasHistory.current.length - 1;
  };

  const handleUndoRedoAction = (action) => {
    let allowAction = false;
    if (action === ToolEnum.Undo && historyPointer.current - 1 >= 0) {
      historyPointer.current--;
      allowAction = true;
    } else if (
      action === ToolEnum.Redo &&
      historyPointer.current + 1 < canvasHistory.current.length
    ) {
      historyPointer.current++;
      allowAction = true;
    }
    if (allowAction) {
      const canvasData = canvasHistory.current[historyPointer.current];
      const context = canvasApi.current.getContext("2d");
      context.putImageData(canvasData, 0, 0);
    }
  };

  const onClickToolMenu = (value) => {
    switch (value) {
      case ToolEnum.Brush:
        if (tool !== ToolEnum.Brush) {
          setColor(ColorEnum.Black);
        }
        setTool(value);
        break;
      case ToolEnum.Eraser:
        setColor(ColorEnum.White);
        setTool(value);
        break;
      case ToolEnum.Undo:
        handleUndoRedoAction(ToolEnum.Undo);
        break;
      case ToolEnum.Redo:
        handleUndoRedoAction(ToolEnum.Redo);
        break;
      case ToolEnum.Download:
        onDownloadCanvas(document, canvasApi.current);
        break;
    }
  };

  return (
    <>
      <Menu
        size={size}
        color={color}
        tool={tool}
        setColor={setColor}
        setSize={setSize}
        onClickToolMenu={onClickToolMenu}
      />
      <Board
        size={size}
        color={color}
        tool={tool}
        getCanvasApi={getCanvasApi}
        saveHistoryData={saveHistoryData}
      />
    </>
  );
}
