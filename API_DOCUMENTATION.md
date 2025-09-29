# Gmail & Calendar API Documentation

This document describes the comprehensive CRUD API endpoints for Gmail and Google Calendar operations using Composio integration.

## Authentication

All endpoints require a Bearer token in the Authorization header:

```http
Authorization: Bearer <your-token>
```

If no token is provided, the API returns:
```json
{
  "error": "Unauthorized",
  "message": "Bearer token is required"
}
```

## Gmail Endpoints

### GET /api/gmail/unread
Returns unread Gmail messages.

**Parameters:**
- `limit` (optional): Number of messages to return (default: 20)
- `pageToken` (optional): Token for pagination

**Response:**
```json
{
  "unread_count": 201,
  "messages": [
    {
      "messageId": "199917db212588ef",
      "subject": "Important Business Update",
      "sender": "client@example.com",
      "timestamp": "2025-09-29T00:26:19.620Z",
      "snippet": "This is a preview of the email..."
    }
  ],
  "nextPageToken": "next_page_token_123"
}
```

### POST /api/gmail/send
Send an email through Gmail.

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
  "messageId": "x6378ei8n6b",
  "threadId": "en0zuqygk1g",
  "success": true,
  "sentAt": "2025-09-29T00:26:35.465Z"
}
```

### DELETE /api/gmail/messages/:id
Delete a specific message.

**Response:**
```json
{
  "messageId": "test123",
  "deleted": true,
  "deletedAt": "2025-09-29T00:26:59.100Z"
}
```

### PATCH /api/gmail/messages/:id/labels
Update message labels.

**Request Body:**
```json
{
  "addLabels": ["IMPORTANT"],
  "removeLabels": ["SPAM"]
}
```

**Response:**
```json
{
  "messageId": "test123",
  "modified": true,
  "updatedAt": "2025-09-29T00:26:59.100Z"
}
```

### PATCH /api/gmail/messages/:id
Mark message as read or unread.

**Request Body:**
```json
{
  "markAsRead": true
}
```

**Response:**
```json
{
  "messageId": "test123",
  "modified": true,
  "updatedAt": "2025-09-29T00:26:59.100Z"
}
```

### GET /api/gmail/search
Search emails with filters.

**Parameters:**
- `q`: Search query (required)
- `limit` (optional): Number of results (default: 20)
- `pageToken` (optional): Token for pagination

**Example:**
```http
GET /api/gmail/search?q=subject:Important&limit=10
```

**Response:** Same format as `/api/gmail/unread`

## Calendar Endpoints

### GET /api/calendar/events
Get calendar events.

**Parameters:**
- `limit` (optional): Number of events to return (default: 10)
- `timeMin` (optional): Minimum time to query from (ISO string)
- `pageToken` (optional): Token for pagination

**Response:**
```json
{
  "events": [
    {
      "id": "b87bsd5t0ov",
      "summary": "Team Meeting",
      "start": {
        "dateTime": "2025-09-29T00:26:27.331Z"
      },
      "end": {
        "dateTime": "2025-09-29T01:26:27.331Z"
      },
      "htmlLink": "https://calendar.google.com/event?eid=komceyqdjm"
    }
  ],
  "nextPageToken": "calendar_next_token_456"
}
```

### POST /api/calendar/events
Create a new calendar event.

**Request Body:**
```json
{
  "summary": "Test Meeting",
  "start": {
    "dateTime": "2025-09-30T10:00:00Z"
  },
  "end": {
    "dateTime": "2025-09-30T11:00:00Z"
  },
  "description": "Meeting description",
  "attendees": [
    {
      "email": "attendee@example.com"
    }
  ]
}
```

**Response:**
```json
{
  "id": "khrjfcq336",
  "summary": "Test Meeting",
  "start": {
    "dateTime": "2025-09-30T10:00:00Z"
  },
  "end": {
    "dateTime": "2025-09-30T11:00:00Z"
  },
  "htmlLink": "https://calendar.google.com/event?eid=vmc55r7g6z",
  "created": "2025-09-29T00:26:43.471Z",
  "updated": "2025-09-29T00:26:43.471Z",
  "status": "confirmed"
}
```

### PATCH /api/calendar/events/:id
Update an existing calendar event.

**Request Body:**
```json
{
  "summary": "Updated Meeting Title",
  "description": "Updated description"
}
```

**Response:** Same format as POST response with updated fields.

### DELETE /api/calendar/events/:id
Delete a calendar event.

**Response:**
```json
{
  "id": "event123",
  "deleted": true,
  "deletedAt": "2025-09-29T00:27:08.304Z"
}
```

### POST /api/calendar/bulk
Perform bulk calendar operations.

**Request Body:**
```json
{
  "operations": [
    {
      "type": "create",
      "summary": "Bulk Meeting 1",
      "start": {"dateTime": "2025-09-30T14:00:00Z"},
      "end": {"dateTime": "2025-09-30T15:00:00Z"}
    },
    {
      "type": "update",
      "id": "existing-event-id",
      "updates": {
        "summary": "Updated Title"
      }
    },
    {
      "type": "delete",
      "id": "event-to-delete"
    }
  ]
}
```

**Response:**
```json
{
  "processed": 3,
  "results": [
    {
      "operation": "create",
      "success": true,
      "result": { /* created event object */ }
    },
    {
      "operation": "update",
      "id": "existing-event-id",
      "success": true,
      "result": { /* updated event object */ }
    },
    {
      "operation": "delete",
      "id": "event-to-delete", 
      "success": true,
      "result": { /* deletion confirmation */ }
    }
  ]
}
```

## Composio Integration

The API uses Composio tools for Gmail and Calendar operations:

### Gmail Tools Used:
- `GMAIL_FETCH_EMAILS` - Fetch emails with label filters
- `GMAIL_SEND_EMAIL` - Send emails
- `GMAIL_MODIFY_MESSAGE` - Modify message labels and read status
- `GMAIL_DELETE_MESSAGE` - Delete messages

### Calendar Tools Used:
- `GOOGLECALENDAR_FIND_EVENT` - Find calendar events
- `GOOGLECALENDAR_CREATE_EVENT` - Create new events
- `GOOGLECALENDAR_UPDATE_EVENT` - Update existing events
- `GOOGLECALENDAR_DELETE_EVENT` - Delete events

### Configuration

Set these environment variables to use real Composio integration:

```bash
COMPOSIO_BASE_URL=https://api.composio.dev
COMPOSIO_API_KEY=your-composio-api-key
```

If these are not set, the API falls back to mock data for development and testing.

## Error Handling

All endpoints return appropriate HTTP status codes:

- `200` - Success
- `400` - Bad Request (missing required fields)
- `401` - Unauthorized (missing or invalid token)
- `500` - Internal Server Error

Error responses include:
```json
{
  "error": "Error type",
  "message": "Detailed error message"
}
```

## Testing

Use the provided test page at `/api-test.html` to interactively test all endpoints.

### Example with curl:

```bash
# Get unread emails
curl -X GET http://localhost:3000/api/gmail/unread \
  -H "Authorization: Bearer your-token-here"

# Send email
curl -X POST http://localhost:3000/api/gmail/send \
  -H "Authorization: Bearer your-token-here" \
  -H "Content-Type: application/json" \
  -d '{"to":"test@example.com","subject":"Test","body":"Hello"}'

# Create calendar event
curl -X POST http://localhost:3000/api/calendar/events \
  -H "Authorization: Bearer your-token-here" \
  -H "Content-Type: application/json" \
  -d '{
    "summary":"Team Meeting",
    "start":{"dateTime":"2025-09-30T10:00:00Z"},
    "end":{"dateTime":"2025-09-30T11:00:00Z"}
  }'
```