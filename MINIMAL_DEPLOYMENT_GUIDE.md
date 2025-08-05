# Minimal LeaseLink Deployment (Only Required APIs)

## 🎯 Deploy with Only Essential Features

Your LeaseLink app works perfectly with just the core APIs. Optional features can be added later.

---

## Required Environment Variables Only:

```bash
DATABASE_URL=your_neon_postgresql_connection_string
GOOGLE_CLIENT_ID=your_google_oauth_client_id
GOOGLE_CLIENT_SECRET=your_google_oauth_client_secret
SESSION_SECRET=any_random_secure_string_here
NODE_ENV=production
```

## What Works with Minimal Setup:
✅ **Google OAuth Authentication** (Purabh Singh successfully logged in)  
✅ **Property Listings & Management**  
✅ **Swipe Interface for Property Discovery**  
✅ **Match System** (buyers + landlords)  
✅ **Real-time Chat** (WebSocket messaging)  
✅ **Landlord Dashboard**  
✅ **User Profiles & Preferences**  
✅ **PostgreSQL Database** (all CRUD operations)

## What's Optional (app gracefully degrades without these):
❓ **Google Maps API** - Address validation and embedded maps  
❓ **OpenAI API** - AI-powered property recommendations  

---

## Deployment Steps:

### 1. Vercel Deployment
- Use only the **5 required environment variables** above
- Framework: **Other** (not Vite)
- Build: `vite build --outDir dist/public`
- Output: `dist/public`

### 2. Google OAuth Update
Add your Vercel domain to Google Cloud Console:
```
https://your-app.vercel.app/api/auth/google/callback
```

### 3. Test Core Features
- ✅ Google sign-in
- ✅ Property browsing
- ✅ Swipe functionality  
- ✅ Match creation
- ✅ Real-time chat

---

## Add Optional Features Later:

**Google Maps** (if you want address validation):
1. Get API key from Google Cloud Console
2. Add `GOOGLE_MAPS_API_KEY` and `VITE_GOOGLE_MAPS_API_KEY`
3. Redeploy

**OpenAI** (if you want AI recommendations):  
1. Get API key from OpenAI Platform
2. Add `OPENAI_API_KEY`
3. Redeploy

---

## Your App is Production-Ready with Just 5 Environment Variables!

LeaseLink's architecture gracefully handles missing optional APIs - users get a fully functional property discovery platform without any degraded experience.