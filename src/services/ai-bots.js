class AIBotsService {
  constructor() {
    this.supabaseUrl = 'https://mydxasjicsfetnglbppp.supabase.co'
    this.supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZHhhc2ppY3NmZXRuZ2xicHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjYyNTQsImV4cCI6MjA3MzgwMjI1NH0.zdJa3T1WDdc6_JNQbh93oB7CnVWa5TQ5jLb1UN-8dLE'
  }

  async callRecordingStudioBot(action, data) {
    try {
      const response = await fetch(`${this.supabaseUrl}/functions/v1/recording-studio-bot`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, data })
      })
      
      return await response.json()
    } catch (error) {
      console.error('Recording Studio Bot Error:', error)
      return { error: error.message }
    }
  }

  async callHolidayOfficeBot(action, data) {
    try {
      const response = await fetch(`${this.supabaseUrl}/functions/v1/holiday-office-bot`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.supabaseAnonKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ action, data })
      })
      
      return await response.json()
    } catch (error) {
      console.error('Holiday Office Bot Error:', error)
      return { error: error.message }
    }
  }

  async createStudioBooking(clientName, date, duration, notes) {
    return this.callRecordingStudioBot('create_booking', {
      booking: { client_name: clientName, date, duration, notes }
    })
  }

  async createPropertyBooking(propertyId, guestName, checkIn, checkOut) {
    return this.callHolidayOfficeBot('create_booking', {
      booking: { property_id: propertyId, guest_name: guestName, check_in: checkIn, check_out: checkOut }
    })
  }

  async getChatResponse(botType, message) {
    const botFunction = botType === 'studio' ? this.callRecordingStudioBot : this.callHolidayOfficeBot
    return botFunction('chat', { message })
  }
}

window.AIBots = new AIBotsService()