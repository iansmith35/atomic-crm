// Authentication helper utility for ISHE Group CRM
const auth = {
  // Check if user is authenticated
  isAuthenticated() {
    return localStorage.getItem('isAuthenticated') === 'true';
  },

  // Get stored auth token
  getToken() {
    return localStorage.getItem('authToken');
  },

  // Set authentication state
  setAuthenticated(token) {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('authToken', token);
  },

  // Clear authentication state
  logout() {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('authToken');
    window.location.href = 'login.html';
  },

  // Require authentication (redirect to login if not authenticated)
  requireAuth() {
    // DISABLED: Allow pages to load without authentication
    // if (!this.isAuthenticated()) {
    //   window.location.href = 'login.html';
    //   return false;
    // }
    return true;
  },

  // Initialize authentication check on page load
  init() {
    // DISABLED: No automatic authentication checks
    // Only auto-check authentication if not on login page
    // if (window.location.pathname !== '/login.html' && !window.location.href.includes('login.html')) {
    //   document.addEventListener('DOMContentLoaded', () => {
    //     this.requireAuth();
    //   });
    // }
  }
};

// Auto-initialize if this script is loaded
if (typeof window !== 'undefined') {
  auth.init();
}