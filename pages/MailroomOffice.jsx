// MailroomOffice.jsx
import { useState, useEffect } from "react";
import { getUnreadEmails, sendEmail } from "../modules/emailHelpers.js";

export default function MailroomOffice() {
  const [emails, setEmails] = useState([]);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [directives, setDirectives] = useState("");
  
  // Email form fields
  const [toField, setToField] = useState("");
  const [subjectField, setSubjectField] = useState("");
  const [bodyField, setBodyField] = useState("");

  useEffect(() => {
    fetch("/api/tasks?office=mailroom")
      .then((res) => res.json())
      .then((data) => setTasks(data.tasks || []));

    getUnreadEmails()
      .then(msgs => setEmails(msgs))
      .catch(err => console.error('Error fetching emails:', err));

    fetch("/api/chat?office=mailroom")
      .then((res) => res.json())
      .then((data) => setMessages(data.messages || []));

    fetch("/api/directives?office=mailroom")
      .then((res) => res.json())
      .then((data) => setDirectives(data.directives || ""));
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ office: "mailroom", content: input }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    setMessages((prev) => [...prev, ...data.reply]);
    setInput("");
  };

  const updateDirectives = async () => {
    await fetch("/api/directives", {
      method: "POST",
      body: JSON.stringify({ office: "mailroom", content: directives }),
      headers: { "Content-Type": "application/json" },
    });
  };

  function onSendEmail() {
    sendEmail(toField, subjectField, bodyField)
      .then(res => {
        alert('Sent');
        return getUnreadEmails();
      })
      .then(refresh => setEmails(refresh));
  }

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">📨 Admin Mailroom</h1>

      <section>
        <h2 className="text-xl font-semibold mb-2">📥 Live Email Log</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-white p-4 rounded border">
          {emails.map((email, idx) => (
            <div key={idx} className="p-3 border rounded shadow-sm bg-gray-50">
              <strong>{email.subject}</strong><br />
              From: {email.from}<br />
              Date: {email.date}<br />
              <p className="text-sm mt-2">{email.snippet}</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">📤 Compose Email</h2>
        <div className="bg-white p-4 rounded border space-y-3">
          <div>
            <label className="block text-sm font-medium mb-1">To:</label>
            <input
              type="email"
              className="w-full border p-2 rounded"
              placeholder="recipient@example.com"
              value={toField}
              onChange={(e) => setToField(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Subject:</label>
            <input
              type="text"
              className="w-full border p-2 rounded"
              placeholder="Email subject"
              value={subjectField}
              onChange={(e) => setSubjectField(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Message:</label>
            <textarea
              className="w-full border p-2 rounded"
              rows="4"
              placeholder="Email content"
              value={bodyField}
              onChange={(e) => setBodyField(e.target.value)}
            ></textarea>
          </div>
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={onSendEmail}
            disabled={!toField || !subjectField || !bodyField}
          >
            Send Email
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">🧠 Stacy – Email AI Assistant</h2>
        <div className="h-60 overflow-y-auto bg-gray-100 p-3 rounded border mb-3">
          {messages.map((msg, i) => (
            <div key={i} className="mb-2">
              <strong>{msg.role === "user" ? "You" : "Stacy"}:</strong> {msg.content}
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            className="flex-1 border p-2 rounded"
            placeholder="Ask Stacy something..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="bg-green-600 text-white px-4 py-2 rounded"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">📋 Mailroom Taskbar</h2>
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
        <h2 className="text-xl font-semibold mb-2">📝 Directive Settings</h2>
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