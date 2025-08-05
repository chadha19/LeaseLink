import express from "express";
import { createServer } from "http";
import { storage } from "../server/storage.js";
import { setupAuth, isAuthenticated } from "../server/googleAuth.js";
import { insertPropertySchema, insertSwipeSchema, insertMatchSchema, insertMessageSchema } from "../shared/schema.js";
import { z } from "zod";

const app = express();

// Body parsing middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Trust proxy for Vercel
app.set('trust proxy', 1);

// Setup authentication
await setupAuth(app);

// Auth routes
app.get('/api/auth/user', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await storage.getUser(userId);
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Failed to fetch user" });
  }
});

// Properties routes
app.get('/api/properties', isAuthenticated, async (req, res) => {
  try {
    const properties = await storage.getActiveProperties();
    res.json(properties);
  } catch (error) {
    console.error("Error fetching properties:", error);
    res.status(500).json({ message: "Failed to fetch properties" });
  }
});

// Matches routes
app.get('/api/matches', isAuthenticated, async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    let matches;
    if (user.userType === 'landlord') {
      matches = await storage.getMatchesByLandlord(userId);
    } else {
      matches = await storage.getMatchesByBuyer(userId);
    }
    
    res.json(matches);
  } catch (error) {
    console.error("Error fetching matches:", error);
    res.status(500).json({ message: "Failed to fetch matches" });
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});

export default app;