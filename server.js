// server.js
// Basic Express server for the Atomic CRM API

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const accountingRouter = require('./routes/accounting');
const googleRouter = require('./routes/googleRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for the frontend)
app.use(express.static('.'));

// API Routes
app.use('/api/accounting', accountingRouter);
app.use('/api', googleRouter);

// Mock API endpoints for existing frontend compatibility
app.get('/api/tasks', (req, res) => {
  const { office } = req.query;
  
  // Mock tasks for different offices
  const mockTasks = {
    accounts: [
      {
        id: 1,
        title: "Process month-end invoices",
        status: "In Progress",
        created_at: "2025-09-01T09:00:00Z",
        updated_at: "2025-09-28T14:30:00Z"
      },
      {
        id: 2,
        title: "Reconcile bank statements",
        status: "Pending",
        created_at: "2025-09-15T10:00:00Z",
        updated_at: "2025-09-25T16:20:00Z"
      }
    ],
    logistics: [],
    it: [],
    scheduling: []
  };
  
  res.json({ tasks: mockTasks[office] || [] });
});

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});



// Catch-all handler for the SPA
// app.get('*', (req, res) => {
//   // If it's an API route that doesn't exist, return 404
//   if (req.path.startsWith('/api/')) {
//     return res.status(404).json({ error: 'API endpoint not found' });
//   }
//   
//   // Otherwise serve the main index.html
//   res.sendFile(path.join(__dirname, 'index.html'));
// });


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Atomic CRM server running on port ${PORT}`);
  console.log(`📊 Accounting API available at http://localhost:${PORT}/api/accounting`);
  console.log(`📅 Calendar API available at http://localhost:${PORT}/api/calendar/events`);
  console.log(`📧 Gmail API available at http://localhost:${PORT}/api/gmail/unread`);
});

module.exports = app;