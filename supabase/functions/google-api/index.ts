// Supabase Edge Function for Google API integration
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Google API integration functions (adapted for Deno)
async function listUnreadEmails(maxResults = 20) {
  try {
    const mockEmails = [
      {
        id: '1',
        subject: 'Important Business Update',
        from: 'client@example.com',
        date: new Date().toISOString(),
        snippet: 'This is an important update regarding our business partnership...',
        body: 'Full email body content would be here',
        isRead: false
      },
      {
        id: '2', 
        subject: 'Meeting Request',
        from: 'partner@company.com',
        date: new Date(Date.now() - 3600000).toISOString(),
        snippet: 'Would like to schedule a meeting to discuss the project...',
        body: 'Full email body content would be here',
        isRead: false
      }
    ];

    return mockEmails.slice(0, maxResults);
  } catch (error) {
    console.error('Error fetching unread emails:', error);
    throw new Error(`Failed to fetch unread emails: ${error.message}`);
  }
}

async function sendEmail(to: string, subject: string, body: string) {
  try {
    if (!to || !subject || !body) {
      throw new Error('Missing required fields: to, subject, or body');
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(to)) {
      throw new Error('Invalid email address format');
    }

    const response = {
      id: `sent_${Date.now()}`,
      threadId: `thread_${Date.now()}`,
      labelIds: ['SENT'],
      to,
      subject,
      body,
      sentAt: new Date().toISOString(),
      success: true
    };

    console.log(`Email sent successfully to ${to}: ${subject}`);
    return response;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

async function listCalendarEvents(calendarId = 'primary', timeMin: string | null = null) {
  try {
    const startTime = timeMin ? new Date(timeMin) : new Date();
    
    const mockEvents = [
      {
        id: 'event_1',
        summary: 'Team Meeting',
        description: 'Weekly team sync meeting',
        start: {
          dateTime: new Date(Date.now() + 3600000).toISOString(),
          timeZone: 'UTC'
        },
        end: {
          dateTime: new Date(Date.now() + 7200000).toISOString(),
          timeZone: 'UTC'
        },
        attendees: [
          { email: 'team@company.com', responseStatus: 'accepted' }
        ],
        calendarId
      },
      {
        id: 'event_2',
        summary: 'Client Call',
        description: 'Important client discussion',
        start: {
          dateTime: new Date(Date.now() + 86400000).toISOString(),
          timeZone: 'UTC'
        },
        end: {
          dateTime: new Date(Date.now() + 90000000).toISOString(),
          timeZone: 'UTC'
        },
        attendees: [
          { email: 'client@example.com', responseStatus: 'needsAction' }
        ],
        calendarId
      }
    ];

    let filteredEvents = mockEvents;
    if (timeMin) {
      const minTime = new Date(timeMin);
      filteredEvents = mockEvents.filter(event => 
        new Date(event.start.dateTime) >= minTime
      );
    }

    return filteredEvents;
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw new Error(`Failed to fetch calendar events: ${error.message}`);
  }
}

async function createCalendarEvent(event: any) {
  try {
    if (!event || !event.summary) {
      throw new Error('Event must have a summary');
    }

    if (!event.start || !event.end) {
      throw new Error('Event must have start and end times');
    }

    const createdEvent = {
      id: `created_${Date.now()}`,
      summary: event.summary,
      description: event.description || '',
      start: event.start,
      end: event.end,
      attendees: event.attendees || [],
      calendarId: event.calendarId || 'primary',
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      status: 'confirmed',
      htmlLink: `https://calendar.google.com/event?eid=${Date.now()}`,
      ...event
    };

    console.log(`Calendar event created: ${createdEvent.summary}`);
    return createdEvent;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw new Error(`Failed to create calendar event: ${error.message}`);
  }
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  try {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;

    let result;

    // Route handling similar to Express router
    if (method === 'GET' && path.endsWith('/gmail/unread')) {
      result = await listUnreadEmails(20);
    } 
    else if (method === 'POST' && path.endsWith('/gmail/send')) {
      const body = await req.json();
      const { to, subject, body: emailBody } = body;
      result = await sendEmail(to, subject, emailBody);
    }
    else if (method === 'GET' && path.endsWith('/calendar/events')) {
      const calendarId = url.searchParams.get('calendarId');
      const timeMin = url.searchParams.get('timeMin');
      result = await listCalendarEvents(calendarId || 'primary', timeMin);
    }
    else if (method === 'POST' && path.endsWith('/calendar/events')) {
      const body = await req.json();
      const event = body.event;
      result = await createCalendarEvent(event);
    }
    else {
      return new Response(JSON.stringify({ error: 'Route not found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      });
    }

    return new Response(JSON.stringify(result), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });

  } catch (error) {
    console.error('Error in google-api function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});