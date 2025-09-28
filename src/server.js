// Simple server.js that can integrate the gas checker cron job
const path = require('path');
const { runGasChecker } = require('./jobs/gasChecker');

// Import and start the cron job
require('./jobs/cron');

console.log('🚀 ISHE Group CRM Server Starting...');
console.log('📋 Features loaded:');
console.log('  ✅ Gas Checker Cron Job');
console.log('  ✅ Supabase Integration');
console.log('  ✅ Certificate Monitoring');

// Optional: Create a simple HTTP endpoint to manually trigger gas checker
const http = require('http');
const url = require('url');

const server = http.createServer(async (req, res) => {
  const parsedUrl = url.parse(req.url, true);
  
  // CORS headers for frontend integration
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Manual gas checker trigger endpoint
  if (parsedUrl.pathname === '/api/gas-checker/run') {
    try {
      console.log('🔄 Manual gas checker trigger via API');
      const result = await runGasChecker();
      
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: true,
        message: 'Gas checker completed successfully',
        data: result
      }, null, 2));
      
    } catch (error) {
      console.error('❌ Error in manual gas checker:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        success: false,
        message: 'Gas checker failed',
        error: error.message
      }));
    }
    return;
  }

  // Health check endpoint
  if (parsedUrl.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      services: {
        gasChecker: 'running',
        cronJob: 'active'
      }
    }));
    return;
  }

  // Default response
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: 'Not Found',
    availableEndpoints: [
      'GET /api/health - Health check',
      'POST /api/gas-checker/run - Manually trigger gas checker'
    ]
  }));
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🌐 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log(`🔧 Manual gas checker: http://localhost:${PORT}/api/gas-checker/run`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('🛑 Shutting down server...');
  server.close(() => {
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('🛑 Shutting down server...');
  server.close(() => {
    process.exit(0);
  });
});