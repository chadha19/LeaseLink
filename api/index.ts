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
      // Use the correct callback URL format that matches your original auth system
      const redirectUri = 'https://leaselink.pro/api/auth/google/callback';
      const googleAuthUrl = `https://accounts.google.com/oauth2/auth?client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=email%20profile&response_type=code&access_type=offline`;
      console.log('OAuth redirect URL:', googleAuthUrl);
      return res.redirect(302, googleAuthUrl);
    }

    if (req.url?.startsWith('/api/auth/google/callback')) {
      // Handle OAuth callback
      const url = new URL(req.url, `https://${req.headers.host}`);
      const code = url.searchParams.get('code');
      const error = url.searchParams.get('error');
      
      if (error) {
        console.log('OAuth error:', error);
        return res.redirect(302, '/?auth=error&reason=' + encodeURIComponent(error));
      }
      
      if (code) {
        console.log('OAuth success with code:', code.substring(0, 10) + '...');
        // In a full implementation, you'd exchange the code for tokens and create a session
        return res.redirect(302, '/?auth=success');
      } else {
        return res.redirect(302, '/?auth=error&reason=no_code');
      }
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