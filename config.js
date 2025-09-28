// Supabase Configuration for Atomic CRM
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15ZHhhc2ppY3NmZXRuZ2xicHBwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyMjYyNTQsImV4cCI6MjA3MzgwMjI1NH0.zdJa3T1WDdc6_JNQbh93oB7CnVWa5TQ5jLb1UN-8dLE";

const SUPABASE_CONFIG = {
  url: 'https://mydxasjicsfetnglbppp.supabase.co',
  anonKey: SUPABASE_ANON_KEY,
  functionsUrl: 'https://mydxasjicsfetnglbppp.supabase.co/functions/v1',
  officeEndpoints: {
    itOffice: 'it-office',
    ceoOffice: 'ceo-office',
    communicationsO: 'communications',
    accounts: 'accounts',
    virtualEngineer: 'virtual-engineer',
    coastview: 'coastview',
    logistics: 'logistics'
  }
};

// Google OAuth Configuration
const GOOGLE_CONFIG = {

  clientId: '624596716963-huc2ef9rt7q8vckvjtbr84tfrjbs5cic.apps.googleusercontent.com',
  scopes: ['email', 'profile']
};

// Global API Helper
const api = {
  async call(office, endpoint = '', options = {}) {
    const url = `${SUPABASE_CONFIG.functionsUrl}/${SUPABASE_CONFIG.officeEndpoints[office]}${endpoint}`;
    
    const defaultOptions = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SUPABASE_CONFIG.anonKey}`
      },
      ...options
    };

    try {
      const response = await fetch(url, defaultOptions);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`API Error (${office}):`, error);
      return { success: false, error: error.message };
    }
  }
};