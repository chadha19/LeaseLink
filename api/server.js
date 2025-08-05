import express from "express";
import { registerRoutes } from "../server/routes.js";

const app = express();

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Trust proxy for Vercel
app.set('trust proxy', 1);

// Register all routes
await registerRoutes(app);

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;