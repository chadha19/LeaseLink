// Vercel serverless handler that properly wraps Express app
import serverless from 'serverless-http';
import express from 'express';
import { registerRoutes } from '../server/routes';

const app = express();

// Initialize Express app with all routes
let isInitialized = false;
let serverlessHandler: any = null;

async function initializeApp() {
  if (!isInitialized) {
    console.log('Initializing Express app with authentication routes...');
    
    // Register all your existing routes including full authentication system
    await registerRoutes(app);
    
    // Create serverless wrapper
    serverlessHandler = serverless(app);
    isInitialized = true;
    
    console.log('Express app initialized with OAuth routes');
  }
}

export default async function handler(req: any, res: any) {
  try {
    // Initialize the Express app with routes
    await initializeApp();
    
    // Handle the request through serverless wrapper
    return serverlessHandler(req, res);
  } catch (error) {
    console.error('Serverless function error:', error);
    return res.status(500).json({ 
      message: 'Internal Server Error',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}