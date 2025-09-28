// routes/googleRoutes.js
// CommonJS wrapper for Google API routes

const { listUnreadEmails, sendEmail, listCalendarEvents, createCalendarEvent } = require('../integrations/rubeGoogle.js');
const { Router } = require('express');

const router = Router();

// GET /api/gmail/unread
router.get('/gmail/unread', async (req, res) => {
  try {
    const msgs = await listUnreadEmails(20);
    res.json(msgs);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/gmail/send
router.post('/gmail/send', async (req, res) => {
  const { to, subject, body } = req.body;
  try {
    const resp = await sendEmail(to, subject, body);
    res.json(resp);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// GET /api/calendar/events
router.get('/calendar/events', async (req, res) => {
  const { calendarId, timeMin } = req.query;
  try {
    const ev = await listCalendarEvents(calendarId, timeMin);
    res.json(ev);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// POST /api/calendar/events
router.post('/calendar/events', async (req, res) => {
  const event = req.body.event;
  try {
    const ev = await createCalendarEvent(event);
    res.json(ev);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;