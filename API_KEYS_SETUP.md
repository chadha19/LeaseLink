# API Keys Setup Guide

This project supports storing API keys directly in your code files for easy development.

## Quick Setup

1. **Edit the API keys file**: Open `api-keys.ts` in the root directory
2. **Replace placeholder values** with your actual API keys
3. **Save the file** - it's automatically excluded from git commits

## Example Configuration

```typescript
export const API_KEYS = {
  // Replace these with your actual keys
  RENTCAST_API_KEY: "sk_test_abc123...",
  GOOGLE_MAPS_API_KEY: "AIzaSyC123...",
  TWILIO_ACCOUNT_SID: "AC123...",
  // ... etc
};
```

## Supported Services

### RentCast API (Property Market Data)
- **What it does**: Gets real estate market estimates and comparable properties
- **Where to get**: [rentcast.io](https://rentcast.io)
- **Usage**: Automatic market data when creating properties

### Google Maps API (Location Services)
- **What it does**: Validates addresses and gets coordinates
- **Where to get**: [Google Cloud Console](https://console.cloud.google.com)
- **Usage**: Address validation in property forms

### Twilio (SMS Notifications)
- **What it does**: Sends text message notifications
- **Where to get**: [twilio.com](https://twilio.com)
- **Usage**: Match notifications and property alerts

### Cloudinary (Image Storage)
- **What it does**: Professional image hosting and optimization
- **Where to get**: [cloudinary.com](https://cloudinary.com)
- **Usage**: Better image storage instead of base64

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