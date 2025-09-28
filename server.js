// server.js
// Basic Express server for the Atomic CRM API

const express = require('express');
const cors = require('cors');
const path = require('path');

// Import routes
const accountingRouter = require('./routes/accounting');

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

// Basic health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Catch-all handler for the SPA
app.get('*', (req, res) => {
  // If it's an API route that doesn't exist, return 404
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({ error: 'API endpoint not found' });
  }
  
  // Otherwise serve the main index.html
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Atomic CRM server running on port ${PORT}`);
  console.log(`📊 Accounting API available at http://localhost:${PORT}/api/accounting`);
});

module.exports = app;