/**
 * CRMIntegration Class
 * Provides methods to fetch data from CRM API endpoints and integrate with AI systems
 */
class CRMIntegration {
  constructor(baseUrl = '/functions/v1/crm-api') {
    this.baseUrl = baseUrl
    this.cache = new Map()
    this.cacheTimeout = 5 * 60 * 1000 // 5 minutes cache
  }

  /**
   * Helper method to make API requests
   * @param {string} endpoint - The API endpoint
   * @param {object} options - Fetch options
   * @returns {Promise<object>} API response data
   */
  async fetchFromAPI(endpoint, options = {}) {
    const url = `${this.baseUrl}${endpoint}`
    
    try {
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      })

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      
      if (!data.success) {
        throw new Error(data.error || 'API request failed')
      }

      return data.data
    } catch (error) {
      console.error(`CRM API Error (${endpoint}):`, error)
      throw error
    }
  }

  /**
   * Get cached data or fetch from API
   * @param {string} key - Cache key
   * @param {function} fetchFunction - Function to fetch data
   * @returns {Promise<object>} Cached or fresh data
   */
  async getCached(key, fetchFunction) {
    const cached = this.cache.get(key)
    const now = Date.now()

    if (cached && (now - cached.timestamp) < this.cacheTimeout) {
      return cached.data
    }

    const data = await fetchFunction()
    this.cache.set(key, { data, timestamp: now })
    return data
  }

  /**
   * Fetch all companies
   * @returns {Promise<Array>} List of companies
   */
  async getCompanies() {
    return this.getCached('companies', async () => {
      const result = await this.fetchFromAPI('/companies')
      return result.companies || []
    })
  }

  /**
   * Fetch contacts with company relationships
   * @returns {Promise<Array>} List of contacts with company data
   */
  async getContacts() {
    return this.getCached('contacts', async () => {
      const result = await this.fetchFromAPI('/contacts')
      return result.contacts || []
    })
  }

  /**
   * Fetch opportunities with contact/company joins
   * @returns {Promise<Array>} List of opportunities with related data
   */
  async getOpportunities() {
    return this.getCached('opportunities', async () => {
      const result = await this.fetchFromAPI('/opportunities')
      return result.opportunities || []
    })
  }

  /**
   * Search contacts by name or email
   * @param {string} searchTerm - The search term
   * @returns {Promise<object>} Search results with contacts and count
   */
  async searchContacts(searchTerm) {
    if (!searchTerm || searchTerm.trim().length < 2) {
      return { contacts: [], count: 0, searchTerm }
    }

    const encoded = encodeURIComponent(searchTerm.trim())
    const result = await this.fetchFromAPI(`/search?q=${encoded}`)
    return {
      contacts: result.contacts || [],
      count: result.count || 0,
      searchTerm: result.searchTerm
    }
  }

  /**
   * Get dashboard summary with counts
   * @returns {Promise<object>} Dashboard summary data
   */
  async getDashboardSummary() {
    return this.getCached('dashboard', async () => {
      const result = await this.fetchFromAPI('/dashboard')
      return result.summary || {}
    })
  }

  /**
   * Extract emails and names from a message using regex patterns
   * @param {string} message - The message to analyze
   * @returns {object} Extracted emails and names
   */
  extractContactInfo(message) {
    if (!message || typeof message !== 'string') {
      return { emails: [], names: [] }
    }

    // Email pattern
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g
    const emails = message.match(emailRegex) || []

    // Name patterns (basic heuristics)
    const nameRegex = /\b[A-Z][a-z]+\s+[A-Z][a-z]+\b/g
    const potentialNames = message.match(nameRegex) || []
    
    // Filter out common words that might match the name pattern
    const commonWords = ['Thank You', 'Best Regards', 'Kind Regards', 'Dear Sir', 'Dear Madam']
    const names = potentialNames.filter(name => !commonWords.includes(name))

    return { emails: [...new Set(emails)], names: [...new Set(names)] }
  }

  /**
   * Search for contacts mentioned in a message
   * @param {string} message - The message to analyze
   * @returns {Promise<object>} Found contacts and extracted info
   */
  async findContactsInMessage(message) {
    const { emails, names } = this.extractContactInfo(message)
    const foundContacts = []

    // Search by emails
    for (const email of emails) {
      try {
        const results = await this.searchContacts(email)
        foundContacts.push(...results.contacts)
      } catch (error) {
        console.warn(`Failed to search for email ${email}:`, error)
      }
    }

    // Search by names
    for (const name of names) {
      try {
        const results = await this.searchContacts(name)
        foundContacts.push(...results.contacts)
      } catch (error) {
        console.warn(`Failed to search for name ${name}:`, error)
      }
    }

    // Remove duplicates
    const uniqueContacts = foundContacts.filter((contact, index, array) =>
      array.findIndex(c => c.id === contact.id) === index
    )

    return {
      extractedEmails: emails,
      extractedNames: names,
      foundContacts: uniqueContacts,
      totalFound: uniqueContacts.length
    }
  }

  /**
   * Format CRM data for AI context
   * @param {Array} contacts - Contacts to format
   * @param {Array} companies - Companies to format  
   * @param {Array} opportunities - Opportunities to format
   * @returns {string} Formatted context string
   */
  formatCRMContext(contacts = [], companies = [], opportunities = []) {
    let context = 'CRM Context:\n'

    if (contacts.length > 0) {
      context += `\nContacts (${contacts.length}):\n`
      contacts.forEach(contact => {
        context += `- ${contact.first_name} ${contact.last_name}`
        if (contact.email) context += ` (${contact.email})`
        if (contact.company?.name) context += ` at ${contact.company.name}`
        if (contact.title) context += `, ${contact.title}`
        context += '\n'
      })
    }

    if (companies.length > 0) {
      context += `\nCompanies (${companies.length}):\n`
      companies.forEach(company => {
        context += `- ${company.name}`
        if (company.industry) context += ` (${company.industry})`
        if (company.website) context += ` - ${company.website}`
        context += '\n'
      })
    }

    if (opportunities.length > 0) {
      context += `\nOpportunities (${opportunities.length}):\n`
      opportunities.forEach(opp => {
        context += `- ${opp.title}: ${opp.status}`
        if (opp.value) context += ` (£${opp.value})`
        if (opp.contact) {
          context += ` - Contact: ${opp.contact.first_name} ${opp.contact.last_name}`
        }
        context += '\n'
      })
    }

    return context
  }

  /**
   * Enrich an AI prompt with relevant CRM context
   * @param {string} originalMessage - The original user message
   * @param {object} options - Options for context enrichment
   * @returns {Promise<object>} Enriched prompt with CRM context
   */
  async enrichPrompt(originalMessage, options = {}) {
    const {
      includeFoundContacts = true,
      includeRecentOpportunities = true,
      includeDashboard = false,
      maxContacts = 10,
      maxOpportunities = 5
    } = options

    try {
      const enrichmentData = {}

      // Find contacts mentioned in the message
      if (includeFoundContacts) {
        const contactInfo = await this.findContactsInMessage(originalMessage)
        enrichmentData.foundContacts = contactInfo.foundContacts.slice(0, maxContacts)
        enrichmentData.extractedInfo = {
          emails: contactInfo.extractedEmails,
          names: contactInfo.extractedNames
        }
      }

      // Get recent opportunities if requested
      if (includeRecentOpportunities) {
        const opportunities = await this.getOpportunities()
        enrichmentData.recentOpportunities = opportunities.slice(0, maxOpportunities)
      }

      // Get dashboard summary if requested
      if (includeDashboard) {
        enrichmentData.dashboardSummary = await this.getDashboardSummary()
      }

      // Format CRM context
      const crmContext = this.formatCRMContext(
        enrichmentData.foundContacts || [],
        [], // Companies are included in contact data
        enrichmentData.recentOpportunities || []
      )

      // Create enriched prompt
      const enrichedPrompt = `${originalMessage}\n\n${crmContext}`

      return {
        originalMessage,
        enrichedPrompt,
        crmContext,
        enrichmentData,
        hasRelevantContext: (enrichmentData.foundContacts?.length || 0) > 0 ||
                           (enrichmentData.recentOpportunities?.length || 0) > 0
      }

    } catch (error) {
      console.error('Error enriching prompt:', error)
      return {
        originalMessage,
        enrichedPrompt: originalMessage,
        crmContext: '',
        enrichmentData: {},
        hasRelevantContext: false,
        error: error.message
      }
    }
  }

  /**
   * Clear the cache
   */
  clearCache() {
    this.cache.clear()
  }

  /**
   * Get cache statistics
   * @returns {object} Cache statistics
   */
  getCacheStats() {
    const now = Date.now()
    const entries = Array.from(this.cache.entries())
    
    return {
      totalEntries: entries.length,
      validEntries: entries.filter(([key, value]) => 
        (now - value.timestamp) < this.cacheTimeout
      ).length,
      expiredEntries: entries.filter(([key, value]) => 
        (now - value.timestamp) >= this.cacheTimeout
      ).length
    }
  }
}

// Export for use in different environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CRMIntegration
} else if (typeof window !== 'undefined') {
  window.CRMIntegration = CRMIntegration
}