# LeaseLink Railway Deployment Guide

## Quick Fix for OAuth Callback Issue

The 404 error on `/api/auth/google/callback` is fixed by:

1. **Updated OAuth Configuration** - Now supports Railway URLs via `RAILWAY_STATIC_URL`
2. **Proper Port Configuration** - Uses Railway's `PORT` environment variable
3. **Railway-specific startup script** - `start-railway.js` handles Railway deployment

## Environment Variables Required

Set these in Railway Dashboard → Your Project → Variables:

```
DATABASE_URL=postgresql://username:password@hostname:port/database
SESSION_SECRET=your-super-secret-key-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
GOOGLE_MAPS_API_KEY=your-maps-api-key (optional)
VITE_GOOGLE_MAPS_API_KEY=your-client-maps-key (optional)
OPENAI_API_KEY=your-openai-key (optional)
```

## Google OAuth Setup for Railway

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to APIs & Services → Credentials
3. Edit your OAuth 2.0 client
4. Add these URLs to "Authorized redirect URIs":
   ```
   https://your-railway-domain.up.railway.app/api/auth/google/callback
   https://leaselink-production.up.railway.app/api/auth/google/callback
   ```

## Railway Deployment Steps

### Method 1: Railway CLI (Recommended)
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway link [your-project-id]
railway up
```

### Method 2: GitHub Integration
1. Push code to GitHub
2. Connect repository in Railway dashboard
3. Railway will auto-deploy on commits

## Build Configuration

Railway automatically detects Node.js and runs:
- **Build**: `npm run build` (compiles client + server)
- **Start**: `node start-railway.js` (Railway-optimized startup)

## Files Added/Modified for Railway

- ✅ `railway.json` - Railway configuration
- ✅ `start-railway.js` - Railway startup script
- ✅ `server/googleAuth.ts` - Updated OAuth callback URLs
- ✅ `server/index.ts` - Dynamic port configuration

## Troubleshooting

### OAuth Callback 404 Error
- ✅ **FIXED**: OAuth routes are now properly configured
- Verify `RAILWAY_STATIC_URL` is set in environment variables
- Check Google OAuth redirect URIs match your Railway domain

### Database Connection Issues
- Verify `DATABASE_URL` is correct PostgreSQL connection string
- Ensure database accepts connections from Railway IPs
- Check database exists and has correct permissions

### Build Failures
- Check Railway build logs for detailed error messages
- Verify all dependencies are in `package.json`
- Ensure Node.js version compatibility (18+)

## Production Checklist

- [ ] Environment variables configured
- [ ] Google OAuth redirect URIs updated
- [ ] Database accessible from Railway
- [ ] Custom domain configured (optional)
- [ ] SSL certificates active
- [ ] Health checks passing

## Support

Your OAuth callback route is now available at:
`https://your-railway-domain.up.railway.app/api/auth/google/callback`

The route is defined in `server/googleAuth.ts` lines 108-114 and is properly registered through the auth middleware.