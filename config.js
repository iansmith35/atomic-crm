// Supabase Configuration for Atomic CRM
const SUPABASE_CONFIG = {
  url: 'https://mydxasjicsfetnglbppp.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCIrOiJKV1QiLCJ9.uyissso.supabase',
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