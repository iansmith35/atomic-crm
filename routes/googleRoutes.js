
// Enhanced Google API routes with full CRUD operations
const express = require('express');
const { validateBearerToken } = require('../middleware/auth');
const {
  fetchUnreadEmails,
  sendEmail,
  modifyMessage,
  deleteMessage,
  searchEmails,
  findCalendarEvents,
  createCalendarEvent,
  updateCalendarEvent,
  deleteCalendarEvent,
} = require('../integrations/composio');

const router = express.Router();

// Apply authentication middleware to all routes
router.use(validateBearerToken);

// ============= GMAIL ENDPOINTS =============

// GET /api/gmail/unread - Get unread Gmail messages
router.get('/gmail/unread', async (req, res) => {
  try {
    const { limit = 20, pageToken } = req.query;
    const result = await fetchUnreadEmails(parseInt(limit), pageToken);
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching unread emails:', error);
    res.status(500).json({ 
      error: 'Failed to fetch unread emails',
      message: error.message 
    });
  }
});

// POST /api/gmail/send - Send email
router.post('/gmail/send', async (req, res) => {
  try {
    const { to, subject, body } = req.body;
    
    if (!to || !subject || !body) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'to, subject, and body are required'
      });
    }
    
    const result = await sendEmail(to, subject, body);
    res.json(result);
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ 
      error: 'Failed to send email',
      message: error.message 
    });
  }
});

// DELETE /api/gmail/messages/:id - Delete message
router.delete('/gmail/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteMessage(id);
    
    res.json(result);
  } catch (error) {
    console.error('Error deleting message:', error);
    res.status(500).json({ 
      error: 'Failed to delete message',
      message: error.message 
    });
  }
});

// PATCH /api/gmail/messages/:id/labels - Update message labels
router.patch('/gmail/messages/:id/labels', async (req, res) => {
  try {
    const { id } = req.params;
    const { addLabels = [], removeLabels = [] } = req.body;
    
    const result = await modifyMessage(id, addLabels, removeLabels);
    res.json(result);
  } catch (error) {
    console.error('Error updating message labels:', error);
    res.status(500).json({ 
      error: 'Failed to update message labels',
      message: error.message 
    });
  }
});

// PATCH /api/gmail/messages/:id - Mark message as read/unread
router.patch('/gmail/messages/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { markAsRead } = req.body;
    
    if (markAsRead === undefined) {
      return res.status(400).json({
        error: 'Missing required field',
        message: 'markAsRead field is required (true/false)'
      });
    }
    
    const addLabels = [];
    const removeLabels = [];
    
    if (markAsRead) {
      removeLabels.push('UNREAD');
    } else {
      addLabels.push('UNREAD');
    }
    
    const result = await modifyMessage(id, addLabels, removeLabels);
    res.json(result);
  } catch (error) {
    console.error('Error updating message read status:', error);
    res.status(500).json({ 
      error: 'Failed to update message read status',
      message: error.message 
    });
  }
});

// GET /api/gmail/search - Search emails with filters
router.get('/gmail/search', async (req, res) => {
  try {
    const { q, limit = 20, pageToken } = req.query;
    
    if (!q) {
      return res.status(400).json({
        error: 'Missing required parameter',
        message: 'q (query) parameter is required'
      });
    }
    
    const result = await searchEmails(q, parseInt(limit), pageToken);
    res.json(result);
  } catch (error) {
    console.error('Error searching emails:', error);
    res.status(500).json({ 
      error: 'Failed to search emails',
      message: error.message 
    });
  }
});

// ============= CALENDAR ENDPOINTS =============

// GET /api/calendar/events - Get calendar events
router.get('/calendar/events', async (req, res) => {
  try {
    const { limit = 10, timeMin, pageToken } = req.query;
    const result = await findCalendarEvents(parseInt(limit), timeMin, pageToken);
    
    res.json(result);
  } catch (error) {
    console.error('Error fetching calendar events:', error);
    res.status(500).json({ 
      error: 'Failed to fetch calendar events',
      message: error.message 
    });
  }
});

// POST /api/calendar/events - Create calendar event
router.post('/calendar/events', async (req, res) => {
  try {
    const { summary, start, end, description, attendees } = req.body;
    
    if (!summary || !start || !end) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'summary, start, and end are required'
      });
    }
    
    const result = await createCalendarEvent(summary, start, end, description, attendees);
    res.json(result);
  } catch (error) {
    console.error('Error creating calendar event:', error);
    res.status(500).json({ 
      error: 'Failed to create calendar event',
      message: error.message 
    });
  }
});

// PATCH /api/calendar/events/:id - Update calendar event
router.patch('/calendar/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    const result = await updateCalendarEvent(id, updates);
    res.json(result);
  } catch (error) {
    console.error('Error updating calendar event:', error);
    res.status(500).json({ 
      error: 'Failed to update calendar event',
      message: error.message 
    });
  }
});

// DELETE /api/calendar/events/:id - Delete calendar event
router.delete('/calendar/events/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteCalendarEvent(id);
    
    res.json(result);
  } catch (error) {
    console.error('Error deleting calendar event:', error);
    res.status(500).json({ 
      error: 'Failed to delete calendar event',
      message: error.message 
    });
  }
});

// POST /api/calendar/bulk - Bulk calendar operations
router.post('/calendar/bulk', async (req, res) => {
  try {
    const { operations } = req.body;
    
    if (!operations || !Array.isArray(operations)) {
      return res.status(400).json({
        error: 'Invalid request',
        message: 'operations array is required'
      });
    }
    
    const results = [];
    
    for (const operation of operations) {
      try {
        let result;
        
        switch (operation.type) {
          case 'create':
            result = await createCalendarEvent(
              operation.summary,
              operation.start,
              operation.end,
              operation.description,
              operation.attendees
            );
            break;
            
          case 'update':
            result = await updateCalendarEvent(operation.id, operation.updates);
            break;
            
          case 'delete':
            result = await deleteCalendarEvent(operation.id);
            break;
            
          default:
            result = { error: `Unknown operation type: ${operation.type}` };
        }
        
        results.push({
          operation: operation.type,
          id: operation.id,
          success: !result.error,
          result
        });
      } catch (error) {
        results.push({
          operation: operation.type,
          id: operation.id,
          success: false,
          error: error.message
        });
      }
    }
    
    res.json({
      processed: operations.length,
      results
    });
  } catch (error) {
    console.error('Error processing bulk calendar operations:', error);
    res.status(500).json({ 
      error: 'Failed to process bulk operations',
      message: error.message 
    });
  }
});

module.exports = router;