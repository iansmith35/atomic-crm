// LogisticsOffice.jsx
import { useState, useEffect } from "react";

export default function LogisticsOffice() {
  const [tasks, setTasks] = useState([]);
  const [input, setInput] = useState("");
  const [directives, setDirectives] = useState("");
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch("/api/tasks?office=logistics")
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks || []));

    fetch("/api/chat?office=logistics")
      .then((res) => res.json())
      .then((data) => setMessages(data.messages || []));

    fetch("/api/directives?office=logistics")
      .then((res) => res.json())
      .then((data) => setDirectives(data.directives || ""));
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ office: "logistics", content: input }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setMessages((prev) => [...prev, ...data.reply]);
    setInput("");
  };

  const updateDirectives = async () => {
    await fetch("/api/directives", {
      method: "POST",
      body: JSON.stringify({ office: "logistics", content: directives }),
      headers: { "Content-Type": "application/json" },
    });
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">🚚 Logistics Office</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">📅 Calendar View</h2>
        <iframe
          src="https://calendar.google.com/calendar/embed?src=your_calendar_id&ctz=Europe%2FLondon"
          style={{ border: 0 }}
          width="100%"
          height="600"
          frameBorder="0"
          scrolling="no"
        ></iframe>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">🗺️ Route Planner (Google Maps)</h2>
        <iframe
          width="100%"
          height="450"
          style={{ border: 0 }}
          loading="lazy"
          allowFullScreen
          src="https://www.google.com/maps/embed/v1/view?key=YOUR_API_KEY&center=51.5074,-0.1278&zoom=10"
        ></iframe>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">📋 Taskbar – Logistics Tasks</h2>
        <ul className="space-y-2">
          {tasks.map((task, idx) => (
            <li key={idx} className="bg-white p-4 shadow rounded">
              <strong>{task.title}</strong><br />
              Status: {task.status}<br />
              Created: {task.created} | Updated: {task.updated}
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">🧠 Ellie – Logistics AI Assistant</h2>
        <div className="h-60 overflow-y-auto bg-gray-50 p-3 rounded border mb-3">
          {messages.map((msg, i) => (
            <div key={i} className="mb-2">
              <strong>{msg.role === "user" ? "You" : "Ellie"}:</strong> {msg.content}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 border p-2 rounded"
            placeholder="Ask Ellie something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="bg-green-600 text-white px-4 rounded"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">📝 Directive Configuration</h2>
        <textarea
          className="w-full p-2 border rounded"
          rows="6"
          value={directives}
          onChange={(e) => setDirectives(e.target.value)}
        ></textarea>
        <button
          className="mt-2 bg-blue-600 text-white px-4 py-2 rounded"
          onClick={updateDirectives}
        >
          Save Directives
        </button>
      </section>
    </div>
  );
}