// BossOffice.jsx
import { useState, useEffect } from "react";

export default function BossOffice() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    async function fetchChat() {
      const res = await fetch("/api/chat?office=boss");
      const data = await res.json();
      setMessages(data.messages || []);
    }
    fetchChat();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ office: "boss", content: input }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setMessages((prev) => [...prev, ...data.reply]);
    setInput("");
  };

  const uploadFiles = async (fileList) => {
    const formData = new FormData();
    Array.from(fileList).forEach((file) => formData.append("files", file));
    formData.append("office", "boss");
    await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = e.dataTransfer.files;
    setFiles(Array.from(droppedFiles));
    uploadFiles(droppedFiles);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">👔 Boss's Office – Executive Suite</h1>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-xl p-4 mb-4 text-center ${
          dragOver ? "border-blue-500 bg-blue-50" : "border-gray-300"
        }`}
      >
        {dragOver ? "Drop your files here..." : "Drag and drop executive documents (reports, contracts, strategic plans, etc.)"}
      </div>

      <div className="h-64 overflow-y-scroll border rounded-xl p-3 mb-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className="mb-2">
            <strong>{msg.role === "user" ? "You" : "Executive AI"}:</strong> {msg.content}
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 border p-2 rounded-xl"
          placeholder="Discuss strategy with Executive AI..."
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl"
        >
          Send
        </button>
      </div>
    </div>
  );
}