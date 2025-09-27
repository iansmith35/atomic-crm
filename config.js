// Supabase Configuration for Atomic CRM
const SUPABASE_CONFIG = {
  url: 'https://mydxasjicsfetnglbppp.supabase.co',
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCIrOiJKV1QiLCJ9LnV5aXNzc28uc3VwYWJhc2UiLCJyZWYiOiJteWR4YXNqaWNzZmV0bmdsYnBwUiIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzU4LTc4cjIzNjU0LCJleHAiOjIwNzM4MDIyNTR9L1-VcgDF0BFOWgOWH-MrA2DCqHwbSlTm0LlktjlSihqI'wA6,jwXkroIhY
  functionsUrl: 'https://mydxasjicsfetnglbppp.supabase.co/functions/v1',
  officeEndpoints: {
    itOffice: 'it-office',
    ceoOffice: 'ceo-office',
    communicationsO: 'communications',
    accounts: 'accounts',
    virtualEngineer: 'virtual-engineer',

    musicStudio: 'music-studio'

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