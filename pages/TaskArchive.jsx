// TaskArchive.jsx
import { useState, useEffect } from "react";

export default function TaskArchive() {
  const [archivedTasks, setArchivedTasks] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    async function fetchArchived() {
      const res = await fetch(`/api/tasks/archive?search=${encodeURIComponent(search)}`);
      const data = await res.json();
      setArchivedTasks(data.tasks || []);
    }
    fetchArchived();
  }, [search]);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📁 Task Archive</h1>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tasks..."
          className="w-full p-2 border rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <ul className="space-y-3">
        {archivedTasks.map((task) => (
          <li key={task.id} className="p-4 bg-gray-50 border rounded-xl">
            <div className="font-semibold">{task.title}</div>
            <div className="text-sm text-gray-600">Status: {task.status}</div>
            <div className="text-xs text-gray-500">
              Created: {task.created_at} | Completed: {task.completed_at}
            </div>
            <div className="text-xs italic text-gray-400">Office: {task.office}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}