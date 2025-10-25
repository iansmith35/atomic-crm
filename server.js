// server.js
require('dotenv').config({ path: '.env.local' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

let accountingRouter, googleRouter;
try { accountingRouter = require('./routes/accounting'); } catch (e) { console.log('Accounting routes not available'); }
try { googleRouter = require('./routes/googleRoutes'); } catch (e) { console.log('Google routes not available'); }

const app = express();
const PORT = process.env.PORT || 3000;
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const isProduction = process.env.NODE_ENV === 'production';

app.use(cors({
  origin: isProduction 
    ? ['https://iansmith35.github.io', 'https://atomic-crm.vercel.app'] 
    : ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// API Routes FIRST
if (accountingRouter) app.use('/api/accounting', accountingRouter);
if (googleRouter) app.use('/api', googleRouter);

app.get('/api/config', (req, res) => {
  res.json({
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
    rubeApiKey: process.env.RUBE_API_KEY
  });
});

app.get('/api/chat/messages', async (req, res) => {
  try {
    const { office, limit = 50 } = req.query;
    const { data, error } = await supabase.from('chat_messages').select('*').eq('office', office).order('created_at', { ascending: false }).limit(parseInt(limit));
    if (error) throw error;
    res.json({ success: true, data });
  } catch (error) {
    console.error('Chat messages API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/chat/messages', async (req, res) => {
  try {
    const { office, message, sender, metadata } = req.body;
    const { data, error } = await supabase.from('chat_messages').insert([{
      office, message, sender, metadata: metadata || {}, created_at: new Date().toISOString()
    }]).select();
    if (error) throw error;
    res.json({ success: true, data: data[0] });
  } catch (error) {
    console.error('Chat message create error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/tasks', async (req, res) => {
  try {
    const { office, status, limit = 50 } = req.query;
    let query = supabase.from('tasks').select('*').order('created_at', { ascending: false }).limit(parseInt(limit));
    if (office) query = query.eq('office', office);
    if (status) query = query.eq('status', status);
    const { data, error } = await query;
    if (error) throw error;
    if (!data || data.length === 0) {
      const mockTasks = { accounts: [{ id: 1, title: "Process month-end invoices", description: "Complete Q4 invoice processing", status: "In Progress", priority: "high", office: "accounts", assigned_to: "AH Agent" }], ceo: [], logistics: [], it: [], scheduling: [] };
      return res.json({ success: true, data: mockTasks[office] || [], source: 'mock' });
    }
    res.json({ success: true, data, source: 'database' });
  } catch (error) {
    console.error('Tasks API error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { title, description, office, status = 'pending', priority = 'medium' } = req.body;
    const { data, error } = await supabase.from('tasks').insert([{ title, description, office, status, priority, assigned_to: 'AI Agent', created_at: new Date().toISOString(), updated_at: new Date().toISOString() }]).select();
    if (error) throw error;
    res.json({ success: true, data: data[0] });
  } catch (error) {
    console.error('Task create error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.put('/api/tasks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body, updated_at: new Date().toISOString() };
    const { data, error } = await supabase.from('tasks').update(updates).eq('id', id).select();
    if (error) throw error;
    res.json({ success: true, data: data[0] });
  } catch (error) {
    console.error('Task update error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, context = {}, office } = req.body;
    if (!process.env.OPENAI_API_KEY) {
      return res.status(503).json({ success: false, error: 'OpenAI API key not configured' });
    }
    const aiResponse = {
      response: `AI Assistant for ${office || 'Atomic CRM'}: I understand you said "${message}". How can I help?`,
      suggestions: ["Create a new task", "View recent activities", "Generate a report", "Schedule a meeting"],
      context: context,
      timestamp: new Date().toISOString()
    };
    res.json({ success: true, data: aiResponse });
  } catch (error) {
    console.error('AI chat error:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    services: {
      supabase: !!process.env.SUPABASE_URL,
      openai: !!process.env.OPENAI_API_KEY,
      rube: !!process.env.RUBE_API_KEY
    }
  });
});

// SERVE STATIC FILES - AFTER ALL API ROUTES
app.use(express.static('.', {
  setHeaders: (res, filePath) => {
    if (filePath.endsWith('.js')) {
      res.setHeader('Content-Type', 'application/javascript');
    }
  }
}));

// ROOT ROUTE LAST
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`🤖 Atomic CRM server running on port ${PORT}`);
  console.log(`📋 Tasks API at http://localhost:${PORT}/api/tasks`);
  console.log(`🤖 AI Chat API at http://localhost:${PORT}/api/ai/chat`);
  console.log(`⚙️ Config API at http://localhost:${PORT}/api/config`);
  console.log(`❤️ Health check at http://localhost:${PORT}/api/health`);
});

module.exports = app;