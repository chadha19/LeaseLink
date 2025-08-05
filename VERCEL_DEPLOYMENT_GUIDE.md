# Vercel Deployment Guide for LeaseLink

## Prerequisites
1. GitHub account with your LeaseLink repository
2. Vercel account (sign up at vercel.com)
3. Environment variables ready

## Step 1: Prepare Repository
Your repository should have these files (already created):
- `vercel.json` - Vercel configuration
- `api/server.js` - Serverless function for API routes

## Step 2: Push to GitHub
1. Initialize git repository (if not already):
   ```bash
   git init
   git add .
   git commit -m "Initial commit - LeaseLink app ready for Vercel"
   ```

2. Create GitHub repository and push:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/leaselink.git
   git push -u origin main
   ```

## Step 3: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure project settings:
   - **Framework Preset**: Other (not Vite)
   - **Build Command**: `vite build --outDir dist/public`
   - **Output Directory**: `dist/public`
   - **Install Command**: `npm install`

## Step 4: Environment Variables
Add these environment variables in Vercel dashboard:

### Required Variables:
- `DATABASE_URL` - Your Neon PostgreSQL connection string
- `GOOGLE_CLIENT_ID` - Your Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Your Google OAuth client secret
- `SESSION_SECRET` - Random string for session encryption
- `NODE_ENV` - Set to `production`

### Optional Variables:
- `GOOGLE_MAPS_API_KEY` - For address validation
- `VITE_GOOGLE_MAPS_API_KEY` - Client-side maps
- `OPENAI_API_KEY` - For AI recommendations

## Step 5: Update Google OAuth Settings
After deployment, update your Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth client
4. Add your Vercel domain to **Authorized redirect URIs**:
   ```
   https://your-app-name.vercel.app/api/auth/google/callback
   ```

## Step 6: Deploy
1. Click "Deploy" in Vercel
2. Wait for build to complete
3. Test authentication on your new domain

## Important Notes:
- Vercel serverless functions have 10-second timeout limit
- Database connections should use connection pooling
- Static files are served from `dist/public`
- API routes are handled by the serverless function

## Troubleshooting:
- Build errors: Check build logs in Vercel dashboard
- OAuth errors: Verify callback URLs in Google Console
- Database errors: Check DATABASE_URL and connection limits
- 500 errors: Check function logs in Vercel dashboard

Your LeaseLink app should now be live on Vercel!