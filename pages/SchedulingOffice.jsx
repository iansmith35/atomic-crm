// SchedulingOffice.jsx
import { useState, useEffect } from "react";
import { getCalendarEvents, postCalendarEvent } from "../src/utils/api.js";

export default function SchedulingOffice() {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startISO, setStartISO] = useState("");
  const [endISO, setEndISO] = useState("");

  useEffect(() => {
    async function fetchTasks() {
      const res = await fetch("/api/tasks?office=scheduling");
      const data = await res.json();
      setTasks(data.tasks || []);
    }
    fetchTasks();
  }, []);

  // Implement the exact useEffect pattern from the problem statement
  useEffect(() => {
    getCalendarEvents('primary', new Date().toISOString())
      .then(events => setEvents(events))
      .catch(e => console.error('Calendar fetch error:', e));
  }, []);

  // Implement the exact createEventHandler pattern from the problem statement
  function createEventHandler() {
    const event = {
      summary: title,
      description: description,
      start: { dateTime: startISO },
      end: { dateTime: endISO }
    };
    postCalendarEvent(event)
      .then(res => {
        // refresh calendar
        return getCalendarEvents('primary', new Date().toISOString());
      })
      .then(ev => {
        setEvents(ev);
        // Clear form
        setTitle("");
        setDescription("");
        setStartISO("");
        setEndISO("");
      })
      .catch(e => console.error('Event creation error:', e));
  }

  // Helper to format date for datetime-local input
  const formatDateTimeLocal = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">📅 Scheduling Office</h1>

      {/* Calendar Events Section */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold mb-4">Calendar Events</h2>
        
        {/* Event Creation Form */}
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <h3 className="font-medium mb-3">Create New Event</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Event title"
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description"
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="datetime-local"
              value={formatDateTimeLocal(startISO)}
              onChange={(e) => setStartISO(e.target.value ? new Date(e.target.value).toISOString() : "")}
              className="border border-gray-300 rounded px-3 py-2"
            />
            <input
              type="datetime-local"
              value={formatDateTimeLocal(endISO)}
              onChange={(e) => setEndISO(e.target.value ? new Date(e.target.value).toISOString() : "")}
              className="border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <button
            onClick={createEventHandler}
            disabled={!title || !startISO || !endISO}
            className={`mt-3 px-4 py-2 rounded ${
              !title || !startISO || !endISO
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            Create Event
          </button>
        </div>

        {/* Events List */}
        <div className="space-y-3">
          {events.map((event, index) => (
            <div key={event.id || index} className="p-3 bg-white border rounded-lg">
              <div className="font-semibold">{event.summary}</div>
              {event.description && (
                <div className="text-sm text-gray-600">{event.description}</div>
              )}
              <div className="text-xs text-gray-500 mt-1">
                {new Date(event.start?.dateTime || event.start).toLocaleString()} - {new Date(event.end?.dateTime || event.end).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold mb-2">Taskbar – Scheduling Only</h2>
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