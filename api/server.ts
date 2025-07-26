// Vercel serverless function entry point
import express from "express";
import session from "express-session";
import { registerRoutes } from "../server/routes";
import { log } from "../server/vite";

const app = express();

// Configure app for production
app.set("env", "production");

// Session configuration
app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false, // Set to true in production with HTTPS
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  
  res.on("finish", () => {
    const duration = Date.now() - start;
    const status = res.statusCode;
    const method = req.method;
    const url = req.url;
    
    if (req.url.startsWith("/api")) {
      let logLine = `${method} ${url} ${status} in ${duration}ms`;
      if (req.body && Object.keys(req.body).length > 0) {
        logLine += ` :: ${JSON.stringify(req.body)}`;
      }
      log(logLine);
    }
  });

  next();
});

// Register routes
registerRoutes(app);

// Export the Express app for Vercel
export default app;