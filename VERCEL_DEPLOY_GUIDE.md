# Vercel Deployment for LeaseLink.pro

## Quick Deploy Steps

### 1. Go to Vercel
- Visit [vercel.com](https://vercel.com)
- Click "Sign up with GitHub"
- Authorize Vercel to access your repositories

### 2. Import Your Project
- Click "New Project" 
- Find "Purabhh/LeaseLink" in your repositories
- Click "Import"

### 3. Vercel Auto-Configuration
Vercel will automatically detect:
- ✅ Node.js project
- ✅ Build command: `npm run build`
- ✅ Output directory: `dist`
- ✅ Install command: `npm install`

### 4. Add Environment Variables
**Before deployment, add these in Vercel dashboard:**

**Required:**
```
DATABASE_URL=postgresql://neondb_owner:npg_8xvzqhBys0pt@ep-fragrant-firefly-ae9gjo2n-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
SESSION_SECRET=your-random-session-secret
NODE_ENV=production
```

**Optional (for full features):**
```
GOOGLE_MAPS_API_KEY=your-google-maps-key
VITE_GOOGLE_MAPS_API_KEY=your-google-maps-key
OPENAI_API_KEY=your-openai-key
```

### 5. Deploy
- Click "Deploy"
- Wait 2-3 minutes for build
- Get your live URL: `https://lease-link-xyz.vercel.app`

### 6. Add Custom Domain
- In Vercel dashboard: Domains → Add Domain
- Enter: `leaselink.pro`
- Configure DNS at your domain registrar
- SSL certificate automatically provided

### 7. Update Google OAuth
Add production callback:
`https://leaselink.pro/api/auth/google/callback`

## ✅ Result
- **Live site:** https://leaselink.pro
- **Cost:** FREE
- **Performance:** Global CDN
- **Auto-deployments:** Every GitHub push