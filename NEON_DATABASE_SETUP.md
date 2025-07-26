# Free Neon Database Setup for LeaseLink

## What is Neon?
Neon is a serverless PostgreSQL database that's perfect for modern web applications. It offers:
- **Free tier**: 500MB storage, 1 database
- **Serverless**: Automatically scales and hibernates when not in use
- **Modern**: Built for developers with branching and instant provisioning
- **Compatible**: Works with any PostgreSQL application

## Step-by-Step Setup

### 1. Create Neon Account
1. Go to [neon.tech](https://neon.tech)
2. Click "Sign Up" (it's completely free)
3. Sign up with GitHub, Google, or email
4. No credit card required for free tier

### 2. Create Your First Project
1. After signing in, click "Create Project"
2. Choose:
   - **Project name**: `leaselink-production` (or whatever you prefer)
   - **Database name**: `leaselink` 
   - **Region**: Choose closest to your users (US East, Europe, Asia)
3. Click "Create Project"

### 3. Get Your Connection String
1. On your project dashboard, look for "Connection Details"
2. Click "Connection string" tab
3. Copy the connection string that looks like:
   ```
   postgresql://username:password@ep-cool-name-123456.us-east-1.aws.neon.tech/leaselink?sslmode=require
   ```
4. **Save this somewhere safe** - you'll need it for deployment

### 4. Set Up Your Environment
For development in Replit:
1. Go to Replit Secrets (lock icon in sidebar)
2. Add secret: `DATABASE_URL` = your connection string
3. The app will automatically use it

For independent hosting:
1. Add to your `.env` file:
   ```
   DATABASE_URL=your-neon-connection-string-here
   ```

### 5. Initialize Your Database
Run this command to create all tables:
```bash
npm run db:push
```

This will create all the tables your LeaseLink app needs:
- `users` - User profiles and authentication
- `properties` - Property listings
- `swipes` - User interactions with properties
- `matches` - Connections between buyers and landlords  
- `messages` - Chat conversations

### 6. Verify Setup
Your app should now connect to Neon automatically. Check:
1. App starts without database errors
2. You can sign in with Google
3. Property listings work
4. User profiles save properly

## Free Tier Limits
- **Storage**: 500MB (plenty for thousands of properties and users)
- **Compute**: Shared resources (perfect for small to medium apps)
- **Connections**: Shared pool (sufficient for most use cases)
- **Branches**: 1 main branch

## Upgrading Later
If you need more resources:
- **Pro Plan**: $19/month for 20GB storage and dedicated compute
- **Scale Plan**: $69/month for 100GB storage and higher performance
- You can upgrade anytime without losing data

## Database Management
Neon provides:
- **Web Console**: View and edit data directly in browser
- **SQL Editor**: Run custom queries
- **Metrics**: Monitor database performance
- **Backups**: Automatic daily backups
- **Branching**: Create development/staging copies

## Security
- **SSL Required**: All connections encrypted
- **IP Allowlist**: Optional IP restrictions
- **Role-based Access**: Multiple database users
- **SOC 2 Compliant**: Enterprise security standards

## Next Steps After Setup
1. Test your app thoroughly with the new database
2. Configure your production domain in Google OAuth
3. Deploy your app to your hosting platform
4. Set up custom domain (optional)

Your LeaseLink app is now running on a professional database that can scale with your users!