# Fix Google OAuth 403 Error

## The Problem
When you click "Sign in with Google", you get a 403 error because your current Replit URL is not authorized in Google Cloud Console.

## Your Current Callback URL
```
https://da7d1586-69c0-45fd-bec8-f926885dc0e7-00-24gbaupdcikvc.worf.replit.dev/api/auth/google/callback
```

## Quick Fix Steps

### 1. Go to Google Cloud Console
1. Visit [Google Cloud Console](https://console.cloud.google.com/)
2. Select your LeaseLink project
3. Go to "APIs & Services" → "Credentials"
4. Click on your OAuth 2.0 Client ID

### 2. Add Your Current Replit URL
In "Authorized redirect URIs", add this exact URL:
```
https://da7d1586-69c0-45fd-bec8-f926885dc0e7-00-24gbaupdcikvc.worf.replit.dev/api/auth/google/callback
```

### 3. Save Changes
Click "Save"

### 4. Test Again
- Refresh your Replit preview
- Click "Sign in with Google" 
- Should work without 403 error

## Why This Happens
- Replit generates dynamic URLs for each workspace
- Google only allows pre-authorized callback URLs
- Your old URLs probably don't match your current Replit domain

## Alternative: Use Wildcard (if Google supports it)
Some OAuth providers allow wildcards like:
```
https://*.replit.dev/api/auth/google/callback
```

But Google usually requires exact URLs.

## Note
Every time your Replit workspace URL changes, you'll need to update this in Google Cloud Console.