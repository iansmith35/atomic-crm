// Client-side API wrapper functions for calendar operations
// These functions provide a clean interface to the backend calendar API

/**
 * Fetch calendar events from the API
 * @param {string} calendarId - Calendar ID (defaults to 'primary')
 * @param {string} timeMin - Minimum time to query from (ISO string)
 * @returns {Promise<Array>} Array of calendar events
 */
export async function getCalendarEvents(calendarId = 'primary', timeMin = null) {
  try {
    const params = new URLSearchParams();
    params.append('calendarId', calendarId);
    if (timeMin) {
      params.append('timeMin', timeMin);
    }

    const response = await fetch(`/api/calendar/events?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data.events || data || [];
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    throw error;
  }
}

/**
 * Create a new calendar event
 * @param {Object} event - Event object with required properties
 * @returns {Promise<Object>} Created event object
 */
export async function postCalendarEvent(event) {
  try {
    if (!event || !event.summary) {
      throw new Error('Event must have a summary');
    }

    if (!event.start || !event.end) {
      throw new Error('Event must have start and end times');
    }

    const response = await fetch('/api/calendar/events', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ event }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating calendar event:', error);
    throw error;
  }
}
