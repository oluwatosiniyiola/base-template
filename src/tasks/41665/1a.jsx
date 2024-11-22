import React, { useState, useEffect, useRef } from "react";

const CollaborativeWhiteboard = () => {
  const [tool, setTool] = useState("pen");
  const [color, setColor] = useState("#000000");
  const [lineWidth, setLineWidth] = useState(2);
  const [isDrawing, setIsDrawing] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [notes, setNotes] = useState([]);
  const [users, setUsers] = useState([
    { id: 1, name: "User 1", avatar: "👤" },
    { id: 2, name: "User 2", avatar: "👩" },
    { id: 3, name: "User 3", avatar: "👨" },
  ]);
  const [currentUser, setCurrentUser] = useState(users[0]);

  const canvasRef = useRef(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth * 0.8;
    canvas.height = window.innerHeight * 0.8;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctxRef.current = ctx;
  }, []);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = lineWidth;
    }
  }, [color, lineWidth]);

  const startDrawing = (e) => {
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    setIsDrawing(true);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    ctxRef.current.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    ctxRef.current.stroke();
  };

  const stopDrawing = () => {
    ctxRef.current.closePath();
    setIsDrawing(false);
    saveToHistory();
  };

  const saveToHistory = () => {
    const canvas = canvasRef.current;
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(canvas.toDataURL());
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      loadFromHistory(historyIndex - 1);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      loadFromHistory(historyIndex + 1);
    }
  };

  const loadFromHistory = (index) => {
    const img = new Image();
    img.src = history[index];
    img.onload = () => {
      ctxRef.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
      ctxRef.current.drawImage(img, 0, 0);
    };
  };

  const addNote = () => {
    const newNote = {
      id: Date.now(),
      text: "New note",
      x: 50,
      y: 50,
      width: 150,
      height: 100,
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (id, newText) => {
    setNotes(
      notes.map((note) => (note.id === id ? { ...note, text: newText } : note))
    );
  };

  const moveNote = (id, x, y) => {
    setNotes(notes.map((note) => (note.id === id ? { ...note, x, y } : note)));
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-between items-center p-4 bg-gray-200">
        <div className="flex space-x-2">
          <button
            className={`px-2 py-1 rounded ${
              tool === "pen" ? "bg-blue-500 text-white" : "bg-white"
            }`}
            onClick={() => setTool("pen")}
          >
            Pen
          </button>
          <button
            className={`px-2 py-1 rounded ${
              tool === "eraser" ? "bg-blue-500 text-white" : "bg-white"
            }`}
            onClick={() => setTool("eraser")}
          >
            Eraser
          </button>
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-8 h-8"
          />
          <input
            type="range"
            min="1"
            max="20"
            value={lineWidth}
            onChange={(e) => setLineWidth(parseInt(e.target.value))}
            className="w-32"
          />
        </div>
        <div className="flex space-x-2">
          <button onClick={undo} className="px-2 py-1 bg-white rounded">
            Undo
          </button>
          <button onClick={redo} className="px-2 py-1 bg-white rounded">
            Redo
          </button>
          <button onClick={addNote} className="px-2 py-1 bg-white rounded">
            Add Note
          </button>
        </div>
        <div className="flex space-x-2">
          {users.map((user) => (
            <button
              key={user.id}
              className={`text-2xl ${
                currentUser.id === user.id ? "border-2 border-blue-500" : ""
              }`}
              onClick={() => setCurrentUser(user)}
            >
              {user.avatar}
            </button>
          ))}
        </div>
      </div>
      <div className="flex-grow relative">
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          className="border border-gray-300"
        />
        {notes.map((note) => (
          <div
            key={note.id}
            style={{
              position: "absolute",
              left: note.x,
              top: note.y,
              width: note.width,
              height: note.height,
              backgroundColor: "yellow",
              padding: "8px",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              cursor: "move",
            }}
            draggable
            onDragEnd={(e) => moveNote(note.id, e.clientX, e.clientY)}
          >
            <textarea
              value={note.text}
              onChange={(e) => updateNote(note.id, e.target.value)}
              className="w-full h-full resize-none bg-transparent border-none focus:outline-none"
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollaborativeWhiteboard;
