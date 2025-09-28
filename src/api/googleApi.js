// src/api/googleApi.js

const API_BASE = process.env.REACT_APP_API_BASE || ''; // e.g. your backend base URL

export async function getUnreadEmails() {
  const resp = await fetch(`${API_BASE}/api/gmail/unread`);
  if (!resp.ok) throw new Error(await resp.text());
  return resp.json();
}

export async function sendEmail(to, subject, body) {
  const resp = await fetch(`${API_BASE}/api/gmail/send`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ to, subject, body }),
  });
  if (!resp.ok) throw new Error(await resp.text());
  return resp.json();
}

export async function getCalendarEvents(calendarId, timeMin) {
  const url = new URL(`${API_BASE}/api/calendar/events`);
  if (calendarId) url.searchParams.set('calendarId', calendarId);
  if (timeMin) url.searchParams.set('timeMin', timeMin);
  const resp = await fetch(url.toString());
  if (!resp.ok) throw new Error(await resp.text());
  return resp.json();
}

export async function postCalendarEvent(event) {
  const resp = await fetch(`${API_BASE}/api/calendar/events`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ event }),
  });
  if (!resp.ok) throw new Error(await resp.text());
  return resp.json();
}