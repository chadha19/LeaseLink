# API Keys Setup Guide

This project supports storing API keys directly in your code files for easy development.

## Quick Setup

1. **Edit the API keys file**: Open `api-keys.ts` in the root directory
2. **Replace placeholder values** with your actual API keys
3. **Save the file** - it's automatically excluded from git commits

## Example Configuration

**Note:** This file is outdated. LeaseLink now uses Replit Secrets for secure API key storage.

Instead of editing files, add your API keys through:
1. Go to Replit Secrets (lock icon in sidebar)
2. Add keys like: `GOOGLE_MAPS_API_KEY`, `VITE_GOOGLE_MAPS_API_KEY`
3. They're automatically available as environment variables

## Supported Services

### Google Maps API (Address Validation & Maps)
- **What it does**: Validates addresses and displays interactive maps
- **Where to get**: [Google Cloud Console](https://console.cloud.google.com)
- **Usage**: Address validation and embedded maps in property listings

### OpenAI API (AI Property Recommendations)
- **What it does**: Generates intelligent property recommendations for buyers
- **Where to get**: [OpenAI Platform](https://platform.openai.com)
- **Usage**: AI-powered property matching and recommendations

## How It Works

- **Development**: API keys work immediately once added to `api-keys.ts`
- **Fallback**: If keys aren't configured, the app uses mock data or skips features
- **Security**: The `api-keys.ts` file is excluded from git commits
- **No restart needed**: Changes take effect immediately

## Usage in Code

The services automatically check if keys are configured:

```typescript
import { GoogleMapsService } from './server/external-apis';

// Validates addresses if API key is configured
const validation = await GoogleMapsService.validateAddress(address);
```

All services gracefully handle missing API keys by either using fallback data or skipping the feature.

## Currently Active Services

LeaseLink currently uses these services:
- **Google Maps API**: Address validation and interactive maps
- **Google OAuth**: User authentication and profile management  
- **OpenAI API**: AI-powered property recommendations
- **PostgreSQL**: Database storage for all application data