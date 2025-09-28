// ITOffice.jsx
import { useState, useEffect } from "react";

export default function ITOffice() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    async function fetchTasks() {
      const res = await fetch("/api/tasks?office=it");
      const data = await res.json();
      setTasks(data.tasks || []);
    }
    fetchTasks();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">🖥 IT Office</h1>

      <section>
        <h2 className="text-lg font-semibold mb-2">Taskbar – IT Only</h2>
        <ul className="space-y-3">
          {tasks.map((task) => (
            <li key={task.id} className="p-4 bg-white border rounded-xl shadow">
              <div className="font-semibold">{task.title}</div>
              <div className="text-sm text-gray-600">Status: {task.status}</div>
              <div className="text-xs text-gray-500">
                Created: {task.created_at} | Updated: {task.updated_at}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}