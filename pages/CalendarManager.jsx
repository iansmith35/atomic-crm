// CalendarManager.jsx - React component implementing the exact pattern from the problem statement
import { useState, useEffect } from "react";
import { getCalendarEvents, postCalendarEvent } from "../src/utils/api.js";

export default function CalendarManager() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startISO, setStartISO] = useState("");
  const [endISO, setEndISO] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
    
    setIsLoading(true);
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
      .catch(e => {
        console.error('Event creation error:', e);
        alert('Failed to create event: ' + e.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  // Helper to format date for datetime-local input
  const formatDateTimeLocal = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().slice(0, 16);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">📅 Calendar Manager</h1>
      
      {/* Event Creation Form */}
      <section className="mb-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Create New Event</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Event Title *
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meeting title"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event description"
              className="w-full border border-gray-300 rounded-md px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Time *
            </label>
            <input
              type="datetime-local"
              value={formatDateTimeLocal(startISO)}
              onChange={(e) => setStartISO(e.target.value ? new Date(e.target.value).toISOString() : "")}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Time *
            </label>
            <input
              type="datetime-local"
              value={formatDateTimeLocal(endISO)}
              onChange={(e) => setEndISO(e.target.value ? new Date(e.target.value).toISOString() : "")}
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              required
            />
          </div>
        </div>

        <button
          onClick={createEventHandler}
          disabled={!title || !startISO || !endISO || isLoading}
          className={`mt-4 px-6 py-2 rounded-md font-medium ${
            !title || !startISO || !endISO || isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Creating...' : 'Create Event'}
        </button>
      </section>

      {/* Events List */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Current Events</h2>
        {events.length === 0 ? (
          <p className="text-gray-500">No events found.</p>
        ) : (
          <div className="grid gap-4">
            {events.map((event, index) => (
              <div key={event.id || index} className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
                <h3 className="font-semibold text-lg">{event.summary}</h3>
                {event.description && (
                  <p className="text-gray-600 mt-1">{event.description}</p>
                )}
                <div className="mt-2 text-sm text-gray-500">
                  <div>
                    <strong>Start:</strong> {new Date(event.start?.dateTime || event.start).toLocaleString()}
                  </div>
                  <div>
                    <strong>End:</strong> {new Date(event.end?.dateTime || event.end).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}