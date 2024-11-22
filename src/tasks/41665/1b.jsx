import React, { useState, useEffect, useRef } from "react";

const WhiteboardApp = () => {
  const [canvas, setCanvas] = useState(null);
  const [ctx, setCtx] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    setCanvas(canvas);
    setCtx(context);
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const loadState = () => {
      const savedState = localStorage.getItem("whiteboardState");
      if (savedState) {
        const { paths, index } = JSON.parse(savedState);
        setHistory(paths);
        setHistoryIndex(index);
        redraw(paths);
      }
    };
    loadState();
  }, []);

  useEffect(() => {
    if (ctx) {
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
    }
  }, [ctx, color, lineWidth]);

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const endDrawing = () => {
    setIsDrawing(false);
    ctx.beginPath();
    setHistoryIndex((prev) => prev + 1);
    setHistory((prev) => [
      ...prev.slice(0, historyIndex + 1),
      { color, lineWidth, path: [] },
    ]);
    saveState();
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);

    const currentHistory = history.slice(0, historyIndex + 1);
    const currentPath = currentHistory[currentHistory.length - 1];
    currentPath.path.push({ x, y });
    setHistory([...currentHistory]);
    saveState();
  };

  const redraw = (paths) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    paths.forEach((item) => {
      ctx.beginPath();
      ctx.strokeStyle = item.color;
      ctx.lineWidth = item.lineWidth;
      item.path.forEach((point, idx) => {
        if (idx === 0) ctx.moveTo(point.x, point.y);
        else ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    });
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex((prev) => prev - 1);
      redraw(history.slice(0, historyIndex));
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex((prev) => prev + 1);
      redraw(history.slice(0, historyIndex + 1));
    }
  };

  const saveState = () => {
    localStorage.setItem(
      "whiteboardState",
      JSON.stringify({ paths: history, index: historyIndex })
    );
  };

  // Simplified real-time update simulation
  useEffect(() => {
    const interval = setInterval(() => {
      const simulatedState = localStorage.getItem("whiteboardState");
      if (simulatedState) {
        const { paths, index } = JSON.parse(simulatedState);
        if (index !== historyIndex) {
          setHistory(paths);
          setHistoryIndex(index);
          redraw(paths.slice(0, index + 1));
        }
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [historyIndex]);

  return (
    <div className="flex flex-col h-screen">
      <div className="flex-grow relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseUp={endDrawing}
          onMouseMove={draw}
          onMouseLeave={endDrawing}
          className="border border-gray-300 absolute inset-0"
        ></canvas>
      </div>
      <div className="p-4 bg-gray-200">
        <button
          onClick={undo}
          className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Undo
        </button>
        <button
          onClick={redo}
          className="mr-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Redo
        </button>
        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          className="mr-2"
        />
        <input
          type="range"
          min="1"
          max="20"
          value={lineWidth}
          onChange={(e) => setLineWidth(Number(e.target.value))}
          className="mr-2"
        />
      </div>
    </div>
  );
};

export default WhiteboardApp;
