-- Supabase Table Setup for Atomic CRM
-- Run these commands in your Supabase SQL editor

-- Create chat_messages table
CREATE TABLE IF NOT EXISTS chat_messages (
    id BIGSERIAL PRIMARY KEY,
    office VARCHAR(50) NOT NULL,
    message TEXT NOT NULL,
    sender VARCHAR(100) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create tasks table  
CREATE TABLE IF NOT EXISTS tasks (
    id BIGSERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    office VARCHAR(50) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    priority VARCHAR(20) DEFAULT 'medium',
    assigned_to VARCHAR(100),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_chat_messages_office ON chat_messages(office);
CREATE INDEX IF NOT EXISTS idx_chat_messages_created_at ON chat_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_tasks_office ON tasks(office);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_created_at ON tasks(created_at DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users
CREATE POLICY "Enable read access for all users" ON chat_messages FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON chat_messages FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON chat_messages FOR UPDATE USING (true);

CREATE POLICY "Enable read access for all users" ON tasks FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON tasks FOR UPDATE USING (true);

-- Insert some sample data
INSERT INTO tasks (title, description, office, status, priority, assigned_to) VALUES
('Process month-end invoices', 'Complete Q4 invoice processing and reconciliation', 'accounts', 'In Progress', 'high', 'AI Agent'),
('Reconcile bank statements', 'Monthly bank statement reconciliation', 'accounts', 'pending', 'medium', 'AI Agent'),
('Strategic planning review', 'Quarterly strategic planning and goal setting', 'ceo', 'In Progress', 'critical', 'CEO AI'),
('Update system documentation', 'Review and update all system documentation', 'it', 'pending', 'low', 'IT AI'),
('Schedule team meetings', 'Coordinate Q1 team meetings and reviews', 'scheduling', 'pending', 'medium', 'Scheduling AI');

INSERT INTO chat_messages (office, message, sender) VALUES
('ceo', 'Welcome to the CEO office. How can I assist with strategic decisions today?', 'CEO AI Assistant'),
('accounts', 'Accounting department ready. What financial tasks need attention?', 'Accounting AI'),
('it', 'IT support online. Ready to help with technical issues.', 'IT Support AI'),
('scheduling', 'Schedule assistant active. Ready to manage your calendar.', 'Scheduling AI');