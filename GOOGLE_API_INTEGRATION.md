# Google API Integration

This document describes the Google API integration for Gmail and Calendar functionality in the Atomic CRM system.

## Overview

The Google API integration provides four main endpoints for Gmail and Calendar operations:

### Gmail Endpoints

#### GET /api/gmail/unread
Retrieves unread emails from Gmail.

**Parameters:**
- None (defaults to 20 emails maximum)

**Response:**
```json
[
  {
    "id": "1",
    "subject": "Important Business Update",
    "from": "client@example.com",
    "date": "2024-01-15T10:30:00Z",
    "snippet": "This is an important update...",
    "body": "Full email body content",
    "isRead": false
  }
]
```

#### POST /api/gmail/send
Sends an email through Gmail.

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "body": "Email body content"
}
```

**Response:**
```json
{
  "id": "sent_1234567890",
  "threadId": "thread_1234567890",
  "labelIds": ["SENT"],
  "to": "recipient@example.com",
  "subject": "Email Subject",
  "body": "Email body content",
  "sentAt": "2024-01-15T10:30:00Z",
  "success": true
}
```

### Calendar Endpoints

#### GET /api/calendar/events
Lists calendar events.

**Query Parameters:**
- `calendarId` (optional): Calendar ID to query (defaults to 'primary')
- `timeMin` (optional): Minimum time to query from (ISO string)

**Response:**
```json
[
  {
    "id": "event_1",
    "summary": "Team Meeting",
    "description": "Weekly team sync meeting",
    "start": {
      "dateTime": "2024-01-15T10:00:00Z",
      "timeZone": "UTC"
    },
    "end": {
      "dateTime": "2024-01-15T11:00:00Z",
      "timeZone": "UTC"
    },
    "attendees": [
      {
        "email": "team@company.com",
        "responseStatus": "accepted"
      }
    ],
    "calendarId": "primary"
  }
]
```

#### POST /api/calendar/events
Creates a new calendar event.

**Request Body:**
```json
{
  "event": {
    "summary": "New Meeting",
    "description": "Meeting description",
    "start": {
      "dateTime": "2024-01-15T10:00:00Z",
      "timeZone": "UTC"
    },
    "end": {
      "dateTime": "2024-01-15T11:00:00Z",
      "timeZone": "UTC"
    },
    "attendees": [
      {
        "email": "attendee@example.com"
      }
    ]
  }
}
```

**Response:**
```json
{
  "id": "created_1234567890",
  "summary": "New Meeting",
  "description": "Meeting description",
  "start": {
    "dateTime": "2024-01-15T10:00:00Z",
    "timeZone": "UTC"
  },
  "end": {
    "dateTime": "2024-01-15T11:00:00Z",
    "timeZone": "UTC"
  },
  "attendees": [
    {
      "email": "attendee@example.com"
    }
  ],
  "calendarId": "primary",
  "created": "2024-01-15T09:30:00Z",
  "updated": "2024-01-15T09:30:00Z",
  "status": "confirmed",
  "htmlLink": "https://calendar.google.com/event?eid=1234567890"
}
```

## Architecture

### Files Structure

```
/integrations/rubeGoogle.js          # Core Google API wrapper functions
/api/googleRoutes.js                 # Express-style API routes
/supabase/functions/google-api/      # Supabase Edge Function implementation
```

### Integration Components

1. **rubeGoogle.js**: Core integration module with Google API wrapper functions
2. **googleRoutes.js**: Express-style router implementation for API endpoints
3. **Supabase Edge Function**: Deployed function to handle API requests in the Supabase environment

### Current Implementation

The current implementation uses mock data to demonstrate the API structure and functionality. In a production environment, these would be replaced with actual Google API calls using proper authentication.

### Authentication Notes

For production use, you would need to:

1. Set up Google Cloud Project with Gmail and Calendar APIs enabled
2. Configure OAuth 2.0 credentials
3. Implement proper token management and refresh logic
4. Update the integration functions to use the Google API client libraries

### Usage in Frontend

The frontend components (like MailroomOffice.jsx) can now call these endpoints:

```javascript
// Get unread emails
const emails = await fetch('/api/gmail/unread').then(res => res.json());

// Send email
const result = await fetch('/api/gmail/send', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    to: 'recipient@example.com',
    subject: 'Hello',
    body: 'Email content'
  })
});

// Get calendar events
const events = await fetch('/api/calendar/events?timeMin=2024-01-15T00:00:00Z')
  .then(res => res.json());

// Create calendar event
const newEvent = await fetch('/api/calendar/events', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    event: {
      summary: 'New Meeting',
      start: { dateTime: '2024-01-15T10:00:00Z', timeZone: 'UTC' },
      end: { dateTime: '2024-01-15T11:00:00Z', timeZone: 'UTC' }
    }
  })
});
```

## Testing

A test script is available at `/tmp/test-google-integration.js` to verify the integration functionality.

Run tests with:
```bash
node /tmp/test-google-integration.js
```

## Deployment

To deploy the Supabase Edge Function:

1. Ensure Supabase CLI is installed and configured
2. Deploy the function:
   ```bash
   supabase functions deploy google-api
   ```
3. Update the frontend to call the deployed function endpoint