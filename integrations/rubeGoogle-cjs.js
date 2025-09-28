// CommonJS wrapper for rubeGoogle functions
// This file provides CommonJS exports for the ES6 module

/**
 * List unread emails from Gmail
 * @param {number} maxResults - Maximum number of emails to retrieve
 * @returns {Promise<Array>} Array of unread email objects
 */
async function listUnreadEmails(maxResults = 20) {
  try {
    // Mock unread emails for demonstration
    const mockEmails = [
      {
        id: "1",
        subject: "Important Business Update",
        from: "client@example.com",
        date: new Date().toISOString(),
        snippet: "This is an important update regarding our project...",
        isRead: false
      },
      {
        id: "2", 
        subject: "Meeting Confirmation",
        from: "team@company.com",
        date: new Date(Date.now() - 3600000).toISOString(),
        snippet: "Confirming our meeting for tomorrow at 2 PM...",
        isRead: false
      }
    ];
    
    return mockEmails.slice(0, maxResults);
  } catch (error) {
    console.error('Error fetching unread emails:', error);
    throw new Error(`Failed to fetch unread emails: ${error.message}`);
  }
}

/**
 * Send an email through Gmail
 * @param {string} to - Recipient email address
 * @param {string} subject - Email subject
 * @param {string} body - Email body content
 * @returns {Promise<Object>} Response object with send status
 */
async function sendEmail(to, subject, body) {
  try {
    // Mock email send for demonstration
    const sentEmail = {
      id: `sent_${Date.now()}`,
      to,
      subject,
      body,
      sentAt: new Date().toISOString(),
      success: true
    };
    
    console.log(`Email sent to ${to}: ${subject}`);
    return sentEmail;
  } catch (error) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

/**
 * List calendar events
 * @param {string} calendarId - Calendar ID to query
 * @param {string} timeMin - Minimum time to query from (ISO string)
 * @returns {Promise<Array>} Array of calendar events
 */
async function listCalendarEvents(calendarId = 'primary', timeMin = null) {
  try {
    const startTime = timeMin ? new Date(timeMin) : new Date();
    
    // Mock calendar events
    const mockEvents = [
      {
        id: 'event_1',
        summary: 'Team Meeting',
        description: 'Weekly team sync meeting',
        start: {
          dateTime: new Date(Date.now() + 3600000).toISOString(), // 1 hour from now
          timeZone: 'UTC'
        },
        end: {
          dateTime: new Date(Date.now() + 7200000).toISOString(), // 2 hours from now
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
          dateTime: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
          timeZone: 'UTC'
        },
        end: {
          dateTime: new Date(Date.now() + 90000000).toISOString(), // 1 hour later
          timeZone: 'UTC'
        },
        attendees: [
          { email: 'client@example.com', responseStatus: 'needsAction' }
        ],
        calendarId
      }
    ];

    // Filter events by timeMin if provided
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

/**
 * Create a new calendar event
 * @param {Object} event - Event object with required properties
 * @returns {Promise<Object>} Created event object
 */
async function createCalendarEvent(event) {
  try {
    if (!event || !event.summary) {
      throw new Error('Event must have a summary');
    }

    if (!event.start || !event.end) {
      throw new Error('Event must have start and end times');
    }

    // Create mock event response
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
      ...event // Include any additional properties from the input
    };

    console.log(`Calendar event created: ${createdEvent.summary}`);
    return createdEvent;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw new Error(`Failed to create calendar event: ${error.message}`);
  }
}

module.exports = {
  listUnreadEmails,
  sendEmail,
  listCalendarEvents,
  createCalendarEvent
};