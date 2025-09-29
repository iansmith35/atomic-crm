# Atomic CRM - AI-Powered Multi-Office Business Management System

An advanced, AI-powered CRM system featuring secure backend API, intelligent task automation, and seamless multi-office integration.

## 🚀 Live Demo
Visit the live application: [https://iansmith35.github.io/atomic-crm/](https://iansmith35.github.io/atomic-crm/)

## ✨ Features

### 🤖 AI-Powered Automation
- **Intelligent Chat Assistants** in every office with voice support
- **Automated Task Management** with priority-based routing
- **AI-Generated Reports** and business insights
- **Smart Suggestions** for workflow optimization

### 🏢 Multi-Office Architecture
- **CEO Office** - Executive oversight and strategic command
- **Accounts Office** - Financial management and bookkeeping  
- **IT Office** - Technical support and system management
- **Scheduling Office** - Calendar and appointment management
- **Logistics Office** - Operations and supply chain management
- **Communications Office** - Customer relations and messaging
- **Virtual Engineer Office** - Technical consulting and solutions

### 🔒 Enterprise Security
- **Secure Backend API** with environment-based configuration
- **API Key Management** through backend proxy
- **Encrypted Communications** between frontend and backend
- **Role-Based Access Control** for different office types

### 🎨 Modern Interface
- **Responsive Design** optimized for all devices
- **Animated Components** with smooth transitions
- **Dark Theme** with gradient accents
- **Real-time Updates** and live task synchronization

## 🛠️ Technology Stack

### Backend
- **Node.js + Express** - Secure API server
- **Supabase** - Database and real-time subscriptions
- **Environment Variables** - Secure configuration management
- **CORS Protection** - Cross-origin request security

### Frontend  
- **HTML5 + CSS3** - Modern web standards
- **JavaScript (ES6+)** - Interactive functionality
- **Tailwind CSS** - Utility-first styling framework
- **Fetch API** - Secure backend communication

### AI Integration
- **OpenAI API** - Advanced language processing
- **Rube.app** - Voice-enabled chat widgets
- **Custom AI Assistants** - Office-specific personalities

### Database
- **PostgreSQL** (via Supabase) - Primary data storage
- **Real-time subscriptions** - Live data updates
- **Row Level Security** - Fine-grained access control

## 📦 Installation & Setup

### Prerequisites

```bash
# Node.js 18+ and npm
node --version
npm --version

# Git for version control
git --version
```

### 1. Clone the Repository

```bash
git clone https://github.com/iansmith35/atomic-crm.git
cd atomic-crm
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Create a secure `.env.local` file (never commit this):

```bash
# Copy the example and fill in your values
cp .env.example .env.local
```

**Required Environment Variables:**

```env
# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key-here

# Supabase Configuration  
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key-here

# Rube.app Configuration
RUBE_API_KEY=your-rube-api-key-here

# Server Configuration
PORT=3000
NODE_ENV=development
SESSION_SECRET=your-secure-session-secret-here
```

### 4. Database Setup

Run the Supabase table setup script:

```sql
-- Execute the contents of setup-supabase-tables.sql in your Supabase SQL editor
-- This creates the chat_messages and tasks tables with proper indexes and RLS policies
```

Or run via Supabase CLI:

```bash
supabase db push
```

### 5. Start the Development Server

```bash
# Start the secure backend API server
npm start

# Or for development with auto-reload
npm run dev
```

The application will be available at:
- **Frontend**: http://localhost:3000
- **API**: http://localhost:3000/api/*

## 🏗️ Project Structure

```
atomic-crm/
├── 📁 api/                     # API route handlers
├── 📁 integrations/            # Third-party integrations
├── 📁 routes/                  # Express route modules
├── 📁 src/                     # Source code and modules
├── 📁 supabase/                # Database migrations and functions
├── 📁 types/                   # TypeScript type definitions
├── 📄 server.js                # Main Express server
├── 📄 shared-office-components.js  # Reusable UI components
├── 📄 setup-supabase-tables.sql    # Database schema
├── 📄 .env.local               # Environment variables (create this)
├── 📄 package.json             # Dependencies and scripts
└── 📄 README.md                # This file

# Office HTML Files
├── 📄 index.html               # Main dashboard
├── 📄 ceo-office.html          # Executive management
├── 📄 accounts-office.html     # Financial management  
├── 📄 ai-chatbot.html          # AI assistant interface
├── 📄 it-office.html           # Technical support
├── 📄 scheduling-office.html   # Calendar management
└── 📄 [other-office].html      # Additional offices
```

## 🔧 API Endpoints

### Configuration
- `GET /api/config` - Secure frontend configuration
- `GET /api/health` - System health check

### Chat & AI
- `GET /api/chat/messages` - Retrieve chat history
- `POST /api/chat/messages` - Send new chat message
- `POST /api/ai/chat` - AI assistant interaction

### Task Management
- `GET /api/tasks` - Get tasks by office
- `POST /api/tasks` - Create new task
- `PUT /api/tasks/:id` - Update existing task

## 🚀 Deployment

### Automated Deployment

```bash
# Run the comprehensive deployment script
./deploy.sh
```

### Manual Deployment Steps

1. **Build for Production**
```bash
NODE_ENV=production npm run build
```

2. **Deploy Backend API**
```bash
# Deploy to your preferred platform (Vercel, Railway, etc.)
npm run deploy:api
```

3. **Deploy Frontend**
```bash
# Deploy to GitHub Pages or your hosting platform
npm run deploy:frontend
```

### Environment-Specific Configuration

**Production Environment Variables:**
```env
NODE_ENV=production
PORT=443
# Use production Supabase project
# Use production OpenAI API key
# Set secure session secrets
```

## 🎯 Usage Guide

### For Business Users

1. **Dashboard Navigation**
   - Use the main dashboard to access different offices
   - Each office has specialized tools and AI assistants

2. **AI Assistant Interaction**
   - Click the chat button in any office for AI help
   - Use voice commands (supported browsers)
   - Ask for reports, task creation, or general assistance

3. **Task Management**
   - Create tasks through the AI assistant or directly
   - Track progress across all offices
   - Automatic priority-based routing

### For Developers

1. **Adding New Offices**
   - Copy an existing office HTML file
   - Update the office-specific configuration
   - Add routing in `server.js` if needed

2. **Customizing AI Assistants**
   - Modify prompts in `shared-office-components.js`
   - Add office-specific AI behaviors
   - Configure voice personalities

3. **Extending API**
   - Add new routes in the `routes/` directory
   - Update `server.js` with new route handlers
   - Maintain security best practices

## 🔒 Security Features

- **Environment-based secrets** - No API keys in frontend code
- **CORS protection** - Controlled cross-origin access
- **Input validation** - All user inputs sanitized
- **SQL injection protection** - Parameterized queries via Supabase
- **Session management** - Secure session handling
- **Rate limiting** - API endpoint protection

## 🧪 Testing

```bash
# Run API health check
curl http://localhost:3000/api/health

# Test AI chat endpoint
curl -X POST http://localhost:3000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello", "office": "test"}'

# Test task creation
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" \
  -d '{"title": "Test Task", "office": "test"}'
```

## 📈 Performance Optimization

- **CDN Integration** - Tailwind CSS via CDN
- **Code Splitting** - Modular JavaScript components
- **Database Indexing** - Optimized queries with proper indexes
- **Caching Strategy** - API response caching where appropriate
- **Lazy Loading** - Components loaded on demand

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙋‍♂️ Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the documentation in `/docs`

## 🔄 Changelog

### Version 2.0.0 - AI CRM Overhaul
- ✅ Secure backend API with Express.js
- ✅ Enhanced AI chatbot with animations
- ✅ Multi-office navigation system
- ✅ Real-time task management
- ✅ Environment-based security
- ✅ Modern responsive design
- ✅ Voice-enabled AI assistants

### Version 1.0.0 - Initial Release
- Basic CRM functionality
- Static HTML interface
- Supabase integration
- GitHub Pages deployment

---

**Built with ❤️ by the Atomic CRM Team**

This project is automatically deployed to GitHub Pages using GitHub Actions. The deployment workflow:

1. Triggers on pushes to the `main` branch
2. Builds the static site using Jekyll
3. Deploys to GitHub Pages environment
4. Available at the live demo URL above

### Local Testing

Before deploying, test locally:

```bash
npm run dev      # Start development server on port 3000
npm run start    # Start server on port 8000
npm run validate # Validate HTML files
```

## 🏗️ Local Development
1. Clone the repository:
   ```bash
   git clone https://github.com/iansmith35/atomic-crm.git
   cd atomic-crm
   ```

2. Open `index.html` in your browser or use a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   ```

3. Navigate to `http://localhost:8000` to view the application

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
