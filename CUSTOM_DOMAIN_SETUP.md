# Custom Domain Setup for LeaseLink

## Overview
Moving from the Replit development URL to your own custom domain (like `leaselink.com` or `mypropertyapp.com`) involves several steps but gives you complete control and professional branding.

## Step 1: Choose Your Hosting Platform

### Recommended Options:

#### A. Platform-as-a-Service (Easiest)
- **Railway**: Modern, simple deployment
- **Render**: Free tier available, easy setup
- **Fly.io**: Great performance, reasonable pricing
- **Heroku**: Industry standard (paid plans only now)

#### B. Cloud Providers (More Control)
- **Vercel**: Excellent for full-stack apps
- **Netlify**: Good for static + serverless
- **DigitalOcean App Platform**: Simple cloud deployment
- **AWS/Google Cloud/Azure**: Enterprise-grade but more complex

#### C. VPS/Dedicated (Full Control)
- **DigitalOcean Droplet**: $5/month VPS
- **Linode**: Reliable VPS hosting
- **Vultr**: High-performance VPS

## Step 2: Domain Registration

### Buy Your Domain:
1. **Namecheap** (recommended) - `leaselink.com` ~$10/year
2. **Google Domains** - Good integration with Google services
3. **Cloudflare** - Excellent DNS management
4. **GoDaddy** - Popular but more expensive

### Domain Ideas:
- `leaselink.com`
- `swipeproperties.com`
- `yourlastname-properties.com`
- `findmylease.com`
- `propertymatch.app`

## Step 3: Update Google OAuth

Once you have your domain, update your Google Cloud Console:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to your OAuth 2.0 Client
3. Update **Authorized redirect URIs**:
   - Remove: `https://da7d1586-69c0-45fd-bec8-f926885dc0e7-00-24gbaupdcikvc.worf.replit.dev/api/auth/google/callback`
   - Add: `https://yourdomain.com/api/auth/google/callback`

## Step 4: Environment Variables for Production

Update your `.env` file for your new domain:

```bash
# Your custom domain
DOMAIN=https://yourdomain.com

# Database (you'll need a production PostgreSQL)
DATABASE_URL=postgresql://user:password@your-db-host:5432/leaselink

# Google OAuth (same credentials, updated redirect URLs)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Session security
SESSION_SECRET=your-super-secure-session-secret-for-production

# OpenAI (optional)
OPENAI_API_KEY=your-openai-api-key

# Environment
NODE_ENV=production
```

## Step 5: Database Setup

### Option A: Managed PostgreSQL (Recommended)
- **Neon** (free tier) - `neon.tech`
- **Supabase** (free tier) - `supabase.com`
- **Railway PostgreSQL** - Built-in with Railway hosting
- **AWS RDS** - Enterprise-grade
- **Google Cloud SQL** - Google's managed database

### Option B: Self-Hosted Database
- Set up PostgreSQL on your VPS
- Configure backups and security
- More work but full control

## Step 6: Deployment Process

### Example with Railway (Recommended for Beginners):

1. **Connect GitHub**:
   - Push your LeaseLink code to GitHub
   - Connect Railway to your repository

2. **Environment Variables**:
   - Add all your environment variables in Railway dashboard
   - Railway will automatically detect it's a Node.js app

3. **Database**:
   - Add PostgreSQL service in Railway
   - Copy the DATABASE_URL to your environment variables

4. **Custom Domain**:
   - In Railway, go to your app settings
   - Add your custom domain
   - Update your domain's DNS to point to Railway

5. **SSL Certificate**:
   - Railway automatically provides HTTPS
   - Your app will be secure by default

## Step 7: DNS Configuration

Point your domain to your hosting service:

### For Railway/Render/Fly.io:
```
Type: CNAME
Name: @
Value: your-app.railway.app (or your hosting provider's URL)
```

### For VPS:
```
Type: A
Name: @
Value: 123.456.789.123 (your server's IP address)
```

## Step 8: Final Testing

1. **Test Authentication**: Ensure Google OAuth works with new domain
2. **Test All Features**: Property creation, swiping, matching, chat
3. **Performance**: Check loading speeds
4. **Mobile**: Test on mobile devices
5. **SSL**: Verify HTTPS works correctly

## Cost Breakdown (Monthly)

### Budget Option (~$15/month):
- Domain: $1/month (annual payment)
- Railway hosting: $5/month
- Neon PostgreSQL: Free tier
- Total: ~$6/month + domain

### Standard Option (~$25/month):
- Domain: $1/month
- Railway Pro: $20/month
- Managed PostgreSQL: $5/month
- Total: ~$26/month

### Premium Option (~$50/month):
- Domain: $1/month
- DigitalOcean VPS: $20/month
- Managed Database: $15/month
- CDN/Backup services: $10/month
- Total: ~$46/month

## Benefits of Your Own Domain

### Professional:
- Custom branding (`https://leaselink.com`)
- Professional email addresses (`contact@leaselink.com`)
- SEO benefits
- User trust and credibility

### Technical:
- Full control over deployment
- No platform restrictions
- Ability to scale infinitely
- Custom subdomains (`api.leaselink.com`, `admin.leaselink.com`)

### Business:
- Can monetize freely
- Add payment processing
- White-label for other markets
- Sell the platform if desired

## Next Steps

1. **Choose hosting platform** (Railway recommended for simplicity)
2. **Register domain name**
3. **Set up production database**
4. **Deploy application**
5. **Update Google OAuth settings**
6. **Configure DNS**
7. **Test everything works**

## Migration Timeline

- **Day 1**: Register domain, set up hosting account
- **Day 2**: Deploy application, configure database
- **Day 3**: Update OAuth settings, configure DNS
- **Day 4**: Test and go live!

Your LeaseLink platform will then be completely independent and professional, ready to compete with major property platforms!