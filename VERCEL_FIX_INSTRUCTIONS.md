# Fix for Vercel Deployment Issue

## Problem
Your app is showing raw JavaScript code because Vercel configured it as a Vite-only frontend app instead of a full-stack Node.js application.

## Solution Steps

### 1. In Vercel Dashboard
1. Go to your project settings
2. **Change Framework Preset from "Vite" to "Other"**
3. **Update Build Settings:**
   - Build Command: `npm run build`
   - Output Directory: `dist/public`
   - Install Command: `npm install`

### 2. Redeploy
- Click "Redeploy" to rebuild with correct settings

## Why This Fixes It
- **Vite preset** = Frontend-only static site
- **Other preset** = Full-stack Node.js app (what you need)

Your app needs both:
- ✅ React frontend (served from `/dist/public/`)
- ✅ Express API server (served from `/dist/index.js`)

## Alternative: Manual Configuration
If automatic detection doesn't work, add this build configuration:

**Build Command:** `npm run build`
**Output Directory:** `dist/public`  
**Functions:** Your Express server will be auto-detected

## Expected Result
After fixing the preset:
- ✅ Homepage loads properly (React app)
- ✅ API endpoints work (`/api/*`)
- ✅ Authentication functions
- ✅ Database connections work

Your LeaseLink app will then work correctly at the Vercel URL!