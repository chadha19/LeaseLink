// Vercel API Route - Simplified handler
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Basic API response for now
    if (req.url?.startsWith('/api/auth/user')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.url?.startsWith('/api/auth/google')) {
      // Redirect to Google OAuth (you'll need to set this up in Vercel environment)
      const googleAuthUrl = `https://accounts.google.com/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent('https://lease-link-delta.vercel.app/api/auth/callback')}&scope=email%20profile&response_type=code`;
      return res.redirect(302, googleAuthUrl);
    }

    // Default response
    res.status(200).json({ 
      message: 'LeaseLink API is running',
      path: req.url,
      method: req.method,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}