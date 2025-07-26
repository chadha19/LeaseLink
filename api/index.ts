// Vercel API Route - Proxy to Express app
import express from 'express';
import session from 'express-session';
import { registerRoutes } from '../server/routes';

const app = express();

// Configure middleware for serverless
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration for production
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Register all your existing routes
registerRoutes(app);

// Export as Vercel handler
export default app;