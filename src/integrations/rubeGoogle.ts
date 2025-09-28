// src/integrations/rubeGoogle.ts

import fetch from 'node-fetch';

const RUBE_BASE_URL = process.env.RUBE_URL;    // e.g. "https://api.rube.app"
const RUBE_TOKEN = process.env.RUBE_TOKEN;     // your Rube connector token

async function callRube(connector: string, action: string, payload: any) {
  const url = `${RUBE_BASE_URL}/connectors/${connector}/actions/${action}`;
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${RUBE_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });
  if (!resp.ok) {
    const err = await resp.text();
    throw new Error(`Rube error ${connector}.${action}: ${err}`);
  }
  return resp.json();
}

// Gmail read / list unread
export async function listUnreadEmails(limit = 20) {
  return callRube('gmail', 'listMessages', {
    maxResults: limit,
    labelIds: ['INBOX'],
    q: 'is:unread'
  });
}

// Gmail send
export async function sendEmail(to: string, subject: string, body: string) {
  return callRube('gmail', 'sendMessage', { to, subject, body });
}

// Calendar: list events
export async function listCalendarEvents(calendarId = 'primary', timeMin?: string) {
  return callRube('google_calendar', 'listEvents', {
    calendarId,
    timeMin: timeMin || (new Date()).toISOString()
  });
}

// Calendar: create / insert event
export async function createCalendarEvent(event: any) {
  return callRube('google_calendar', 'createEvent', { event });
}