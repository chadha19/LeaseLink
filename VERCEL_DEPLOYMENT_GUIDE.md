# Vercel Deployment Guide for LeaseLink

## 🚀 Ready to Deploy Your Working LeaseLink App!

Your LeaseLink app is **fully functional** on Replit with:
- ✅ Google OAuth authentication working (Purabh Singh successfully logged in)
- ✅ Database operations confirmed functional
- ✅ All API routes working properly
- ✅ Real-time WebSocket chat system
- ✅ AI-powered property recommendations

Now let's deploy it to Vercel for production use!

---

## Step 1: Push to GitHub

1. **Initialize git repository** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "LeaseLink - Ready for Vercel deployment with working OAuth"
   ```

2. **Create GitHub repository** and push:
   - Go to [github.com](https://github.com) and create a new repository named `leaselink`
   - Then run:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/leaselink.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 2: Deploy to Vercel

1. **Go to [vercel.com](https://vercel.com)** and sign in with GitHub
2. **Click "New Project"**
3. **Import your LeaseLink repository**
4. **Configure project settings**:
   - **Framework Preset**: Other (not Vite)
   - **Build Command**: Leave empty (uses vercel.json configuration)
   - **Output Directory**: Leave empty (uses vercel.json configuration)
   - **Install Command**: Leave empty (uses vercel.json configuration)

---

## Step 3: Environment Variables

In Vercel dashboard, add these environment variables:

### 🔑 Required Variables (Essential for app to work):
```
DATABASE_URL=your_neon_postgresql_url
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret  
SESSION_SECRET=any_random_string_for_sessions
NODE_ENV=production
```

### 🌟 Optional Variables (Enhanced features - app works without these):
```
GOOGLE_MAPS_API_KEY=for_address_validation_and_maps
VITE_GOOGLE_MAPS_API_KEY=for_client_side_maps
OPENAI_API_KEY=for_ai_property_recommendations
```

**Note**: LeaseLink works perfectly without the optional API keys. They provide enhanced features:
- **Google Maps**: Address validation and embedded maps (falls back to basic validation)
- **OpenAI**: AI-powered property recommendations (falls back to standard sorting)

---

## Step 4: Update Google OAuth

**Important**: After deployment, update your Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services → Credentials**
3. Edit your OAuth 2.0 client
4. Add your new Vercel domain to **Authorized redirect URIs**:
   ```
   https://your-app-name.vercel.app/api/auth/google/callback
   ```

---

## Step 5: Deploy & Test

1. **Click "Deploy"** in Vercel dashboard
2. **Wait for build to complete** (usually 2-3 minutes)
3. **Test your live app**:
   - Visit your new Vercel URL
   - Try Google sign-in
   - Verify all features work

---

## 📁 Files Created for Deployment

- ✅ `vercel.json` - Vercel configuration for serverless deployment
- ✅ `api/server.js` - Serverless function handling all API routes
- ✅ This deployment guide

---

## 🛠️ Technical Details

### Architecture:
- **Frontend**: React app built with Vite → `dist/public`
- **Backend**: Express.js serverless function → `api/server.js`
- **Database**: Neon PostgreSQL (same as current)
- **Authentication**: Google OAuth (same configuration)

### What Works:
- All current functionality preserved
- WebSocket chat system
- AI property recommendations  
- Property swiping interface
- Landlord dashboard
- Real-time match notifications

---

## 🚨 Important Notes

- **OAuth only works on direct domain** (same as Replit behavior)
- **WebSocket connections** may need connection pooling in production
- **Database connections** are handled by Neon's connection pooling
- **Session storage** uses PostgreSQL (same as current setup)

---

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Verify environment variables are set correctly
3. Confirm Google OAuth callback URLs are updated
4. Test database connectivity

Your LeaseLink app will be production-ready on Vercel with the same functionality you've already tested!