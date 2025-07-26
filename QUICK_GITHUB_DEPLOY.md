# Quick GitHub + Vercel Deployment for LeaseLink.pro

## 5-Minute Setup Guide

### Step 1: Push to GitHub (2 minutes)
```bash
# Run these commands in your Replit terminal:
git init
git add .
git commit -m "LeaseLink production deployment"
git branch -M main

# Replace 'yourusername' with your GitHub username
git remote add origin https://github.com/yourusername/leaselink.git
git push -u origin main
```

### Step 2: Deploy on Vercel (2 minutes)
1. Go to **[vercel.com](https://vercel.com)**
2. Click **"Sign up with GitHub"**
3. Click **"New Project"**
4. Select your **"leaselink"** repository
5. Click **"Deploy"** (uses automatic settings)

### Step 3: Add Environment Variables (1 minute)
**In Vercel dashboard, go to Settings → Environment Variables:**

Copy your existing values from Replit Secrets:
```
DATABASE_URL
GOOGLE_CLIENT_ID  
GOOGLE_CLIENT_SECRET
GOOGLE_MAPS_API_KEY
VITE_GOOGLE_MAPS_API_KEY
OPENAI_API_KEY
SESSION_SECRET
NODE_ENV=production
```

### Step 4: Connect leaselink.pro Domain
1. **In Vercel dashboard:**
   - Domains tab → Add Domain
   - Enter: `leaselink.pro`
2. **At your domain registrar:**
   - Add CNAME record: `@` → your-vercel-url
   - Or follow Vercel's specific DNS instructions

### Step 5: Update Google OAuth
Add to authorized redirect URIs:
`https://leaselink.pro/api/auth/google/callback`

## ✅ Result: FREE Professional Hosting

- **Your app:** https://leaselink.pro
- **Cost:** $0/month
- **SSL certificate:** Automatic
- **Global CDN:** Included
- **Auto-deployments:** Every GitHub push

Your LeaseLink platform will be live and professional!