# LeaseLink Deployment Guide

## Overview
This guide helps you deploy LeaseLink to your own hosting environment with your own credentials and domain.

## Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Google Cloud Console account
- OpenAI API account (optional, for AI recommendations)

## 1. Environment Setup

### Copy and configure environment variables:
```bash
cp .env.example .env
```

Edit `.env` with your own values:

### Database Configuration
Set up a PostgreSQL database and update `DATABASE_URL`:
```
DATABASE_URL=postgresql://username:password@host:port/database_name
```

### Google OAuth Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set authorized redirect URIs:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`
6. Update your `.env`:
```
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
```

### OpenAI API (Optional)
1. Get API key from [OpenAI](https://platform.openai.com/api-keys)
2. Update your `.env`:
```
OPENAI_API_KEY=your-openai-api-key-here
```

### Session Secret
Generate a secure random string for session encryption:
```
SESSION_SECRET=your-super-secret-session-key-change-this-in-production
```

## 2. Database Setup

### Run database migrations:
```bash
npm install
npm run db:push
```

This will create all necessary tables in your PostgreSQL database.

## 3. Build and Deploy

### For production build:
```bash
npm run build
npm start
```

### For development:
```bash
npm run dev
```

## 4. Hosting Options

### Option 1: VPS/Cloud Server (DigitalOcean, AWS, etc.)
1. Set up a Linux server
2. Install Node.js and PostgreSQL
3. Clone your repository
4. Set up environment variables
5. Run the application with PM2 or similar process manager
6. Configure reverse proxy (nginx) for HTTPS

### Option 2: Platform as a Service (Heroku, Railway, etc.)
1. Connect your GitHub repository
2. Set environment variables in the platform dashboard
3. Configure PostgreSQL add-on
4. Deploy

### Option 3: Docker Deployment
```dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 5000
CMD ["npm", "start"]
```

## 5. Domain Configuration

### Update OAuth redirect URLs:
1. In Google Cloud Console, update authorized redirect URIs
2. Update your domain in environment variables if needed

### SSL/HTTPS Setup:
- Use Let's Encrypt for free SSL certificates
- Configure your reverse proxy (nginx) for HTTPS
- Ensure all OAuth redirects use HTTPS in production

## 6. Key Changes Made for Independent Hosting

### Authentication System
- ✅ Replaced Replit Auth with Google OAuth
- ✅ Configurable OAuth redirect URLs
- ✅ Session management with PostgreSQL storage

### Environment Variables
- ✅ All Replit-specific variables removed
- ✅ Standard environment configuration
- ✅ Production-ready security settings

### Dependencies
- ✅ Removed Replit-specific packages
- ✅ Added Google OAuth packages
- ✅ Standard Node.js deployment structure

## 7. Production Checklist

- [ ] Database configured and accessible
- [ ] Google OAuth credentials set up
- [ ] Environment variables configured
- [ ] SSL/HTTPS configured
- [ ] Domain pointed to your server
- [ ] Process manager set up (PM2, systemd)
- [ ] Backup strategy implemented
- [ ] Monitoring set up

## 8. Troubleshooting

### Common Issues:
1. **OAuth errors**: Check redirect URLs match exactly
2. **Database connection**: Verify DATABASE_URL format
3. **Session issues**: Ensure SESSION_SECRET is set
4. **CORS issues**: Configure your domain properly

### Support:
This is now your independent codebase! You can modify and deploy it anywhere you want.

## 9. Next Steps

Consider adding:
- Email notifications
- Payment processing
- Advanced search filters
- Mobile app
- Analytics and monitoring
- Load balancing for high traffic

Your LeaseLink application is now ready for independent hosting! 🚀