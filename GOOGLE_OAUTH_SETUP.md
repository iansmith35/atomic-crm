# Google OAuth Integration Setup

This document describes the Google OAuth integration implemented for the ISHE Group CRM system.

## Overview

The system now includes Google OAuth authentication that integrates with the existing Supabase backend. Users must authenticate with their Google account before accessing any office pages.

## Files Added/Modified

### New Files:
- `login.html` - Login page with Google Sign-In button
- `auth.js` - Authentication utility helper
- `GOOGLE_OAUTH_SETUP.md` - This documentation

### Modified Files:
- `index.html` - Added logout button and authentication check
- `ceo-office.html` - Added back button and authentication protection
- `config.js` - Added Google OAuth configuration

## Configuration Required

### 1. Google OAuth Client ID
Replace `YOUR_GOOGLE_CLIENT_ID` in `config.js` with your actual Google OAuth client ID:

```javascript
const GOOGLE_CONFIG = {
  clientId: 'your-actual-google-client-id.googleusercontent.com',
  scopes: ['email', 'profile']
};
```

### 2. Supabase Function
Deploy the Supabase Edge Function to handle Google token verification. Example implementation is provided in `supabase-function-example.js`.

The function should be deployed at:
`https://mydxasjicsfetnglbppp.supabase.co/functions/v1/save-google-token`

## How It Works

1. **Authentication Flow:**
   - User visits any protected page
   - If not authenticated, redirected to `login.html`
   - User clicks "Sign in with Google" button
   - Google OAuth flow completes
   - Token sent to Supabase function for verification
   - On success, user redirected to main dashboard

2. **Protection:**
   - All office pages include `auth.js` which automatically checks authentication
   - If not authenticated, user is redirected to login page
   - Authentication state stored in localStorage

3. **Logout:**
   - Logout button in main dashboard header
   - Clears authentication state and redirects to login

## Testing

The implementation has been tested with:
- ✅ Login page displays correctly
- ✅ Authentication redirect works (accessing protected pages redirects to login)
- ✅ Main dashboard shows logout button when authenticated
- ✅ Logout functionality clears session and redirects to login
- ✅ CEO office page includes back button and authentication protection

## Next Steps

1. Configure actual Google OAuth client ID
2. Deploy Supabase Edge Function
3. Test with real Google authentication
4. Add authentication to remaining office pages by including `auth.js`