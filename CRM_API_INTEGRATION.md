# CRM API Integration

This document describes the complete CRM API integration implementation for Atomic CRM, including the Supabase Edge Function and JavaScript CRMIntegration class.

## Overview

The CRM API integration provides a complete backend API for managing CRM data and a JavaScript class for easy frontend integration with AI systems. The implementation includes:

- **Supabase Edge Function**: RESTful API endpoints for CRM data
- **CRMIntegration Class**: JavaScript wrapper with AI integration features
- **Demo Interface**: Interactive test page for all functionality

## Supabase Edge Function

### Location
`supabase/functions/crm-api/index.ts`

### Endpoints

#### 1. GET /companies
Fetches all companies from the atomic_crm database.

**Response:**
```json
{
  "success": true,
  "data": {
    "companies": [
      {
        "id": 1,
        "name": "TechCorp Inc",
        "industry": "Technology",
        "website": "https://techcorp.com",
        "created_at": "2024-01-15T10:00:00Z"
      }
    ]
  },
  "timestamp": "2024-01-15T10:00:00Z"
}
```

#### 2. GET /contacts
Fetches contacts with their related company information.

**Response:**
```json
{
  "success": true,
  "data": {
    "contacts": [
      {
        "id": 1,
        "first_name": "John",
        "last_name": "Doe",
        "email": "john.doe@techcorp.com",
        "title": "CEO",
        "company": {
          "id": 1,
          "name": "TechCorp Inc",
          "industry": "Technology",
          "website": "https://techcorp.com"
        }
      }
    ]
  }
}
```

#### 3. GET /opportunities
Fetches opportunities with contact and company joins.

**Response:**
```json
{
  "success": true,
  "data": {
    "opportunities": [
      {
        "id": 1,
        "title": "Q4 Enterprise Deal",
        "status": "open",
        "value": 50000,
        "contact": {
          "id": 1,
          "first_name": "John",
          "last_name": "Doe",
          "email": "john.doe@techcorp.com",
          "company": {
            "id": 1,
            "name": "TechCorp Inc",
            "industry": "Technology"
          }
        }
      }
    ]
  }
}
```

#### 4. GET /search?q=term
Searches contacts by name or email.

**Parameters:**
- `q` (required): Search term

**Response:**
```json
{
  "success": true,
  "data": {
    "searchTerm": "john",
    "contacts": [...],
    "count": 2
  }
}
```

#### 5. GET /dashboard
Returns summary statistics.

**Response:**
```json
{
  "success": true,
  "data": {
    "summary": {
      "totalCompanies": 25,
      "totalContacts": 150,
      "totalOpportunities": 45,
      "opportunitiesByStatus": {
        "open": 20,
        "closed_won": 15,
        "closed_lost": 10
      }
    }
  }
}
```

### Environment Variables
- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

### Database Schema
The API expects the following tables in the `atomic_crm` schema:

```sql
-- Companies table
CREATE TABLE companies (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  industry TEXT,
  website TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Contacts table
CREATE TABLE contacts (
  id SERIAL PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE,
  title TEXT,
  company_id INTEGER REFERENCES companies(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Opportunities table
CREATE TABLE opportunities (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  status TEXT DEFAULT 'open',
  value DECIMAL(10,2),
  contact_id INTEGER REFERENCES contacts(id),
  created_at TIMESTAMP DEFAULT NOW()
);
```

## CRMIntegration JavaScript Class

### Location
`integrations/crm-integration.js`

### Basic Usage

```javascript
// Initialize the CRM integration
const crm = new CRMIntegration('/functions/v1/crm-api');

// Fetch data
const companies = await crm.getCompanies();
const contacts = await crm.getContacts();
const opportunities = await crm.getOpportunities();

// Search contacts
const results = await crm.searchContacts('john@example.com');

// Get dashboard summary
const summary = await crm.getDashboardSummary();
```

### AI Integration Features

#### Contact Extraction
```javascript
const message = "Please contact john.doe@example.com about the proposal";
const extracted = crm.extractContactInfo(message);
// Returns: { emails: ['john.doe@example.com'], names: [] }
```

#### Find Contacts in Messages
```javascript
const found = await crm.findContactsInMessage(message);
// Returns: {
//   extractedEmails: ['john.doe@example.com'],
//   extractedNames: [],
//   foundContacts: [...], // Actual contact records
//   totalFound: 1
// }
```

#### Enrich AI Prompts
```javascript
const enriched = await crm.enrichPrompt(userMessage, {
  includeFoundContacts: true,
  includeRecentOpportunities: true,
  includeDashboard: false,
  maxContacts: 5
});

// Returns enriched prompt with CRM context for AI
console.log(enriched.enrichedPrompt);
```

### Caching
The class includes intelligent caching with a 5-minute TTL:

```javascript
// Clear cache
crm.clearCache();

// Get cache stats
const stats = crm.getCacheStats();
```

## AI Bot Integration Example

### Complete Integration
```javascript
class AIBotWithCRM {
  constructor() {
    this.crm = new CRMIntegration();
  }
  
  async processMessage(userMessage) {
    // Enrich with CRM context
    const enriched = await this.crm.enrichPrompt(userMessage);
    
    // Send to AI service
    const aiResponse = await this.callAIService({
      prompt: enriched.enrichedPrompt,
      context: enriched.crmContext
    });
    
    return {
      response: aiResponse,
      crmContext: enriched.hasRelevantContext
    };
  }
}
```

### Frontend Integration
```javascript
// Initialize in your HTML page
const crm = new CRMIntegration();

// Handle chat messages
async function handleChatMessage(message) {
  const enriched = await crm.enrichPrompt(message);
  
  if (enriched.hasRelevantContext) {
    // Show CRM context to user
    displayCRMContext(enriched.enrichmentData);
  }
  
  // Send enriched prompt to your AI service
  const response = await sendToAI(enriched.enrichedPrompt);
  displayResponse(response);
}
```

## Demo Page

### Location
`crm-integration-demo.html`

### Features
- Interactive testing of all API endpoints
- CRM class method demonstrations  
- AI integration examples
- Contact extraction testing
- Real-time results display

### Usage
1. Start a local server: `npx serve . -p 3000`
2. Open `http://localhost:3000/crm-integration-demo.html`
3. Test all endpoints and features interactively

## Real-World Usage Scenarios

### 1. Follow-up Automation
```javascript
const message = "Follow up with sarah@techcorp.com about Q4 proposal";
const enriched = await crm.enrichPrompt(message);
// AI now has context about Sarah and her company
```

### 2. Meeting Scheduling
```javascript
const message = "Schedule call with decision makers at Innovative Solutions";
const enriched = await crm.enrichPrompt(message);
// AI can identify contacts at that company
```

### 3. Opportunity Management
```javascript
const message = "What's the status of our Microsoft opportunities?";
const enriched = await crm.enrichPrompt(message, {
  includeRecentOpportunities: true
});
// AI has current opportunity data for informed responses
```

## Error Handling

Both the Edge Function and CRMIntegration class include comprehensive error handling:

### API Errors
```json
{
  "success": false,
  "error": "Search term (q) is required",
  "timestamp": "2024-01-15T10:00:00Z"
}
```

### Class Errors
```javascript
try {
  const data = await crm.getContacts();
} catch (error) {
  console.error('CRM API Error:', error.message);
  // Handle gracefully
}
```

## Performance Features

- **Caching**: 5-minute TTL for repeated requests
- **Parallel Requests**: Dashboard endpoint uses Promise.all
- **Error Recovery**: Graceful fallbacks for failed requests
- **Request Deduplication**: Cache prevents duplicate API calls

## Browser Support

The CRMIntegration class supports:
- Modern browsers (Chrome, Firefox, Safari, Edge)
- Node.js environments
- Both CommonJS and ES6 module systems

## Security

- CORS headers configured for cross-origin requests
- Environment variables for sensitive data
- Input validation and sanitization
- SQL injection protection via Supabase client

## Deployment

### Supabase Edge Function
```bash
supabase functions deploy crm-api
```

### Frontend Integration
Include the CRM integration files in your project:
```html
<script src="integrations/crm-integration.js"></script>
<script src="integrations/crm-integration-example.js"></script>
```

## Testing

Use the demo page for comprehensive testing, or run individual tests:

```javascript
// Test basic functionality
await crm.getCompanies();
await crm.searchContacts('test@example.com');

// Test AI integration
const message = "Contact john@example.com";
const enriched = await crm.enrichPrompt(message);
console.log(enriched.hasRelevantContext);
```

This implementation provides a complete, production-ready CRM API integration with advanced AI capabilities for enhancing conversational experiences.