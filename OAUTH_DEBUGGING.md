# OAuth Debugging Guide

## Current Status
Your Google OAuth configuration is working correctly:
- ✅ Callback URL added to Google Cloud Console
- ✅ OAuth redirect (302) is working
- ✅ Google Client ID is valid

## "accounts.google.com refused to connect" Error

This error typically occurs due to:

### 1. Browser Security Settings
- **Pop-up blockers** preventing the OAuth window
- **Third-party cookies** disabled
- **Strict privacy settings** blocking Google OAuth

### 2. Domain Restrictions (Most Likely)
Check your Google Cloud Console OAuth settings:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials → Your OAuth Client
3. Check **"Authorized domains"** section
4. Make sure `replit.dev` is listed as an authorized domain

### 3. Quick Test
Try opening this URL directly in a new tab:
```
https://da7d1586-69c0-45fd-bec8-f926885dc0e7-00-24gbaupdcikvc.worf.replit.dev/api/auth/google
```

If it redirects you to Google's OAuth page, the issue is with browser handling.
If it shows an error, there's a server-side configuration issue.

## Alternative Solution: Try Different Browser
- Chrome (with pop-ups enabled)
- Firefox (with third-party cookies enabled)
- Incognito/Private browsing mode

## Next Steps
1. Check authorized domains in Google Console
2. Try the direct URL test above
3. Check browser console for JavaScript errors
4. Try a different browser or incognito mode