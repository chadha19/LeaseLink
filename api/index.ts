// Vercel API Route
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.status(200).json({ 
    message: 'LeaseLink API is running',
    path: req.url,
    method: req.method 
  });
}