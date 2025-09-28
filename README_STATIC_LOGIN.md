# Static Login Documentation

## Google Authentication Removal

All Google OAuth authentication has been successfully removed from the ISHE Group CRM website. The site now loads without any authentication requirements.

## How to Enable Optional Static Login

The login.html file contains a commented-out static login form that can be enabled if desired:

### Steps to Enable:

1. Open `login.html`
2. Find the commented section starting with `<!-- OPTIONAL: Static Login (commented out by default) -->`
3. Uncomment the HTML form section (lines ~32-52)
4. Find the commented JavaScript section starting with `// OPTIONAL: Static login function (commented out)`
5. Uncomment the JavaScript event listener (lines ~90-110)

### Static Login Credentials:

- **Email**: `ian@ishe-ltd.co.uk`
- **Password**: `502914`

### What was disabled:

- **auth.js**: Automatic authentication checks and redirects
- **login.html**: Google Sign-In button and OAuth handling
- **All office pages**: Google OAuth scripts and Supabase authentication handlers
- **index.html**: Google Sign-In div and OAuth initialization

## Current Behavior:

- All pages load without authentication requirements
- Login page shows simple "Enter CRM System" button
- No automatic redirects to login page
- Optional static login can be enabled by uncommenting code sections

## Testing Verified:

✅ Index page loads without authentication  
✅ Login page displays correctly  
✅ Office pages (CEO, IT, etc.) load without authentication  
✅ Login flow works (Enter CRM System button → index page)  
✅ No remaining active Google OAuth references  
✅ No remaining active Supabase OAuth references  