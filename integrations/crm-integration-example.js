/**
 * CRM Integration Example Usage
 * Demonstrates how to integrate the CRMIntegration class with AI bot responses
 */

// Example 1: Basic Usage
async function basicCRMUsage() {
  console.log('=== Basic CRM Integration Usage ===')
  
  const crm = new CRMIntegration()
  
  try {
    // Get all companies
    const companies = await crm.getCompanies()
    console.log(`Found ${companies.length} companies`)
    
    // Get contacts with company data
    const contacts = await crm.getContacts()
    console.log(`Found ${contacts.length} contacts`)
    
    // Search for a specific contact
    const searchResults = await crm.searchContacts('john@example.com')
    console.log(`Search found ${searchResults.count} contacts`)
    
    // Get dashboard summary
    const dashboard = await crm.getDashboardSummary()
    console.log('Dashboard summary:', dashboard)
    
  } catch (error) {
    console.error('CRM API Error:', error)
  }
}

// Example 2: AI Bot Integration with CRM Context
async function aiChatWithCRMContext() {
  console.log('=== AI Chat with CRM Context ===')
  
  const crm = new CRMIntegration()
  
  // Simulate user messages that might contain contact information
  const userMessages = [
    "I need to follow up with john.doe@techcorp.com about the proposal",
    "Can you schedule a meeting with Sarah Johnson from ABC Company?",
    "What's the status of our opportunities with Microsoft?",
    "Send an email to the contacts at Innovative Solutions Inc"
  ]
  
  for (const message of userMessages) {
    console.log(`\n--- Processing: "${message}" ---`)
    
    try {
      // Enrich the prompt with CRM context
      const enrichedResult = await crm.enrichPrompt(message, {
        includeFoundContacts: true,
        includeRecentOpportunities: true,
        includeDashboard: false,
        maxContacts: 5,
        maxOpportunities: 3
      })
      
      if (enrichedResult.hasRelevantContext) {
        console.log('CRM Context Found:')
        console.log('- Found contacts:', enrichedResult.enrichmentData.foundContacts?.length || 0)
        console.log('- Extracted emails:', enrichedResult.enrichmentData.extractedInfo?.emails || [])
        console.log('- Extracted names:', enrichedResult.enrichmentData.extractedInfo?.names || [])
        
        // This enriched prompt would be sent to your AI service
        console.log('Enriched prompt ready for AI:', enrichedResult.enrichedPrompt.slice(0, 200) + '...')
      } else {
        console.log('No relevant CRM context found')
      }
      
    } catch (error) {
      console.error('Error processing message:', error)
    }
  }
}

// Example 3: Integration with AI Response Handler
class AIBotWithCRM {
  constructor(aiApiKey, supabaseUrl) {
    this.crm = new CRMIntegration()
    this.aiApiKey = aiApiKey
    // In a real implementation, you would initialize your AI client here
  }
  
  /**
   * Process a user message with CRM context and generate AI response
   * @param {string} userMessage - The user's message
   * @param {object} options - Processing options
   * @returns {Promise<object>} AI response with CRM context
   */
  async processMessage(userMessage, options = {}) {
    try {
      // Step 1: Enrich the prompt with CRM context
      const enrichedResult = await this.crm.enrichPrompt(userMessage, {
        includeFoundContacts: true,
        includeRecentOpportunities: true,
        includeDashboard: options.includeDashboard || false,
        ...options
      })
      
      // Step 2: Prepare context for AI
      let systemPrompt = `You are an AI assistant with access to CRM data. Help the user with their request.`
      
      if (enrichedResult.hasRelevantContext) {
        systemPrompt += `\n\nRelevant CRM context has been provided below. Use this information to give more helpful and specific responses.`
      }
      
      // Step 3: Simulate AI API call (replace with actual AI service)
      const aiResponse = await this.callAIService({
        systemPrompt,
        userMessage: enrichedResult.enrichedPrompt,
        context: enrichedResult.crmContext
      })
      
      // Step 4: Return enriched response
      return {
        userMessage,
        aiResponse,
        crmContext: enrichedResult.crmContext,
        hasRelevantContext: enrichedResult.hasRelevantContext,
        enrichmentData: enrichedResult.enrichmentData
      }
      
    } catch (error) {
      console.error('Error processing message with CRM:', error)
      return {
        userMessage,
        aiResponse: "I apologize, but I encountered an error while processing your request.",
        error: error.message
      }
    }
  }
  
  /**
   * Simulate AI service call (replace with actual implementation)
   * @param {object} params - AI service parameters
   * @returns {Promise<string>} AI response
   */
  async callAIService({ systemPrompt, userMessage, context }) {
    // This is a mock implementation
    // In practice, you would call OpenAI, Claude, or your AI service here
    
    console.log('--- AI Service Call (Mock) ---')
    console.log('System Prompt:', systemPrompt)
    console.log('User Message:', userMessage.slice(0, 100) + '...')
    console.log('CRM Context Available:', context.length > 0)
    
    // Simulate API response based on CRM context
    if (context.includes('Contacts')) {
      return "Based on the CRM data, I can see relevant contacts in your system. I'll help you with your request using this information."
    } else if (context.includes('Opportunities')) {
      return "I found relevant opportunities in your CRM. Let me help you with the next steps."
    } else {
      return "I'll help you with your request. Let me know if you need me to look up any specific contacts or companies."
    }
  }
}

// Example 4: Real-world Usage Scenarios
async function realWorldExamples() {
  console.log('=== Real-world CRM Integration Examples ===')
  
  const aiBot = new AIBotWithCRM('your-ai-api-key', 'your-supabase-url')
  
  // Scenario 1: Follow-up request
  const followUpMessage = "I need to follow up with Sarah at TechCorp about the Q4 proposal we discussed last week"
  const response1 = await aiBot.processMessage(followUpMessage)
  console.log('\nScenario 1 - Follow-up Request:')
  console.log('AI Response:', response1.aiResponse)
  
  // Scenario 2: Meeting scheduling
  const meetingMessage = "Schedule a call with the decision makers at Innovative Solutions Inc for next Tuesday"
  const response2 = await aiBot.processMessage(meetingMessage)
  console.log('\nScenario 2 - Meeting Scheduling:')
  console.log('AI Response:', response2.aiResponse)
  
  // Scenario 3: Opportunity status check
  const statusMessage = "What's the current status of all our open opportunities?"
  const response3 = await aiBot.processMessage(statusMessage, { 
    includeRecentOpportunities: true,
    includeDashboard: true 
  })
  console.log('\nScenario 3 - Status Check:')
  console.log('AI Response:', response3.aiResponse)
}

// Example 5: Frontend Integration (for use in HTML pages)
function initializeFrontendCRM() {
  // This would typically be included in your HTML page
  const frontendExample = `
    <script>
      // Initialize CRM integration
      const crm = new CRMIntegration('/functions/v1/crm-api')
      
      // Function to handle chat messages with CRM context
      async function handleChatMessage(message) {
        try {
          // Show loading state
          showLoadingIndicator()
          
          // Enrich message with CRM context
          const enriched = await crm.enrichPrompt(message)
          
          // Display CRM context if available
          if (enriched.hasRelevantContext) {
            displayCRMContext(enriched.enrichmentData)
          }
          
          // Send to AI service (your existing chat handler)
          const aiResponse = await sendToAIService(enriched.enrichedPrompt)
          
          // Display response
          displayChatMessage(aiResponse)
          
        } catch (error) {
          console.error('Chat error:', error)
          displayErrorMessage('Sorry, I encountered an error processing your message.')
        } finally {
          hideLoadingIndicator()
        }
      }
      
      // Helper functions (implement based on your UI)
      function showLoadingIndicator() { /* ... */ }
      function hideLoadingIndicator() { /* ... */ }
      function displayCRMContext(data) { /* ... */ }
      function displayChatMessage(message) { /* ... */ }
      function displayErrorMessage(error) { /* ... */ }
      function sendToAIService(prompt) { /* ... */ }
    </script>
  `
  
  console.log('Frontend integration example:')
  console.log(frontendExample)
}

// Export examples for different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    basicCRMUsage,
    aiChatWithCRMContext,
    AIBotWithCRM,
    realWorldExamples,
    initializeFrontendCRM
  }
} else if (typeof window !== 'undefined') {
  window.CRMExamples = {
    basicCRMUsage,
    aiChatWithCRMContext,
    AIBotWithCRM,
    realWorldExamples,
    initializeFrontendCRM
  }
}

// Run examples if this file is executed directly
if (typeof require !== 'undefined' && require.main === module) {
  (async () => {
    await basicCRMUsage()
    await aiChatWithCRMContext()
    await realWorldExamples()
    initializeFrontendCRM()
  })()
}