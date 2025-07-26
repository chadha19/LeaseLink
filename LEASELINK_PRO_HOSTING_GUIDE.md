# LeaseLink.pro Custom Domain Hosting Guide

## Overview
This guide shows you how to host your LeaseLink app on your custom domain **leaselink.pro** using multiple hosting options.

## Option 1: Replit Deployments + Custom Domain (Recommended)

### Step 1: Deploy on Replit
1. **Click Deploy button** in your Replit interface
2. **Choose "Reserved VM"** deployment (for custom domains)
3. **Wait for deployment** to complete
4. **Note your deployment URL** (something like `https://your-app.replit.app`)

### Step 2: Configure Custom Domain
1. **In Replit Deployments dashboard:**
   - Click "Domains" tab
   - Click "Add Custom Domain"
   - Enter: `leaselink.pro`
   - Click "Add Domain"

2. **Get DNS settings** from Replit:
   - Copy the CNAME record they provide
   - Copy any A records if provided

### Step 3: Configure Your Domain DNS
**At your domain registrar (where you bought leaselink.pro):**

1. **Add CNAME record:**
   - **Name:** `@` (or leave blank for root domain)
   - **Value:** Your Replit deployment URL
   - **TTL:** 300 (5 minutes)

2. **Add www redirect (optional):**
   - **Name:** `www`
   - **Value:** Your Replit deployment URL
   - **TTL:** 300

### Step 4: Update Google OAuth
1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Find your OAuth app**
3. **Update Authorized Redirect URIs:**
   - Add: `https://leaselink.pro/api/auth/google/callback`
   - Keep existing Replit URL for testing

**DNS propagation takes 5-60 minutes. Your site will be live at https://leaselink.pro**

---

## Option 2: Vercel Hosting (Alternative)

### Step 1: Prepare for Vercel
1. **Create Vercel account** at [vercel.com](https://vercel.com)
2. **Connect your GitHub** (you'll need to push code to GitHub first)

### Step 2: Push to GitHub
```bash
# In your Replit console
git init
git add .
git commit -m "Initial LeaseLink deployment"
git remote add origin https://github.com/yourusername/leaselink.git
git push -u origin main
```

### Step 3: Deploy to Vercel
1. **Import project** from GitHub in Vercel dashboard
2. **Configure build settings:**
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Install Command:** `npm install`

### Step 4: Add Environment Variables
**In Vercel dashboard, add these secrets:**
```
DATABASE_URL=your-neon-connection-string
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_MAPS_API_KEY=your-google-maps-key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
OPENAI_API_KEY=your-openai-key
SESSION_SECRET=your-session-secret
NODE_ENV=production
```

### Step 5: Configure Custom Domain
1. **In Vercel dashboard:**
   - Go to "Domains" tab
   - Add `leaselink.pro`
   - Follow their DNS instructions

---

## Option 3: Railway Hosting (Another Alternative)

### Step 1: Deploy to Railway
1. **Create account** at [railway.app](https://railway.app)
2. **Connect GitHub** and import your repository
3. **Deploy automatically**

### Step 2: Add Environment Variables
**In Railway dashboard:**
- Add all the same environment variables as listed above

### Step 3: Configure Custom Domain
1. **In Railway dashboard:**
   - Go to "Settings" → "Domains"
   - Add `leaselink.pro`
   - Configure DNS as instructed

---

## Environment Variables Checklist

Make sure these are set in your hosting platform:

**Required:**
- ✅ `DATABASE_URL` - Your Neon PostgreSQL connection
- ✅ `GOOGLE_CLIENT_ID` - OAuth authentication
- ✅ `GOOGLE_CLIENT_SECRET` - OAuth authentication
- ✅ `SESSION_SECRET` - Session encryption (generate random string)

**Optional but Recommended:**
- ✅ `GOOGLE_MAPS_API_KEY` - Address validation and maps
- ✅ `VITE_GOOGLE_MAPS_API_KEY` - Frontend maps
- ✅ `OPENAI_API_KEY` - AI property recommendations
- ✅ `NODE_ENV=production` - Production mode

---

## SSL Certificate
**All hosting options automatically provide:**
- ✅ Free SSL certificate (https://)
- ✅ Automatic renewal
- ✅ Force HTTPS redirect

---

## Final Steps After Deployment

### 1. Update Google OAuth Settings
**Add your production domain to Google OAuth:**
- Development: `http://localhost:5000/api/auth/google/callback`
- Production: `https://leaselink.pro/api/auth/google/callback`

### 2. Test Your App
**Verify these features work:**
- ✅ Homepage loads at https://leaselink.pro
- ✅ Google login works
- ✅ Property creation and browsing
- ✅ Maps and address validation
- ✅ User profiles and matching system

### 3. Performance Optimization
**Your app automatically includes:**
- ✅ Neon database connection pooling
- ✅ Gzip compression
- ✅ Static asset caching
- ✅ CDN distribution

---

## Cost Breakdown

### Replit Deployments
- **Reserved VM:** $20/month
- **Custom domain:** Included
- **SSL certificate:** Included
- **Bandwidth:** Generous limits

### Vercel
- **Pro Plan:** $20/month (for custom domains)
- **Bandwidth:** 1TB/month
- **Serverless functions:** Included

### Railway
- **Pro Plan:** $5/month + usage
- **Custom domains:** Included
- **Very cost-effective** for small to medium apps

---

## Recommendation

**Start with Replit Deployments** because:
- ✅ Easiest setup (one-click deploy)
- ✅ No code migration needed
- ✅ Built-in monitoring and logs
- ✅ Automatic scaling
- ✅ Great for MVP and early users

**Your leaselink.pro domain will be live and professional!**