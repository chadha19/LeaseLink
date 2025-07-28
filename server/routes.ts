import express, { type Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./googleAuth";
import { insertPropertySchema, insertSwipeSchema, insertMatchSchema, insertMessageSchema, type Match } from "@shared/schema";
import { AIRecommendationService } from "./aiRecommendations";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Configure express for serverless
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Get user by ID (for landlords to view buyer profiles)
  app.get('/api/users/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.params.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user profile (excluding sensitive data like sessions)
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // User profile routes
  app.patch('/api/user/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const updateData = req.body;
      
      console.log("Updating user profile:", userId, "with data:", updateData);
      
      const updatedUser = await storage.updateUserProfile(userId, updateData);
      
      console.log("Profile updated successfully:", updatedUser);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  // Property routes
  app.get('/api/properties', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Get properties excluding ones already swiped by this user
      const swipedProperties = await storage.getSwipesByBuyer(userId);
      const swipedPropertyIds = swipedProperties.map(swipe => swipe.propertyId);
      
      const allProperties = await storage.getActiveProperties();
      const availableProperties = allProperties.filter(prop => 
        !swipedPropertyIds.includes(prop.id) && prop.landlordId !== userId
      );
      
      // Use AI to recommend properties based on user preferences and behavior
      const recommendedProperties = await AIRecommendationService.generateRecommendations(
        user,
        availableProperties,
        swipedProperties
      );
      
      // Add interested count to each property (pending + approved matches)
      const propertiesWithInterestedCount = await Promise.all(
        recommendedProperties.map(async (property) => {
          const propertyMatches = await storage.getMatchesByProperty(property.id);
          const interestedCount = propertyMatches.filter(
            (match: Match) => match.status === 'pending' || match.status === 'approved'
          ).length;
          
          return {
            ...property,
            interestedCount
          };
        })
      );
      
      res.json(propertiesWithInterestedCount);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.post('/api/properties', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      console.log("Creating property for user:", userId);
      console.log("Request body:", req.body);
      
      const validatedData = insertPropertySchema.parse(req.body);
      
      // Validate address with Google Maps API if available
      let addressValidation: { 
        isValid: boolean; 
        coordinates: { lat: number; lng: number } | null; 
        formattedAddress: string | null 
      } = { isValid: true, coordinates: null, formattedAddress: null };
      
      try {
        const { GoogleMapsService } = await import('./external-apis');
        const fullAddress = `${validatedData.address}, ${validatedData.zipCode}`;
        addressValidation = await GoogleMapsService.validateAddress(fullAddress);
        
        if (!addressValidation.isValid) {
          return res.status(400).json({ 
            message: "Location not found. Please check the address and ZIP code.",
            field: "address"
          });
        }
        
        console.log("Address validated successfully:", addressValidation.formattedAddress);
      } catch (error: any) {
        console.log("Address validation skipped:", error.message);
      }
      
      const propertyData: any = {
        ...validatedData,
        landlordId: userId,
      };
      
      // Store coordinates if we got them
      if (addressValidation.coordinates) {
        propertyData.latitude = addressValidation.coordinates.lat.toString();
        propertyData.longitude = addressValidation.coordinates.lng.toString();
      }
      
      // Use formatted address if available
      if (addressValidation.formattedAddress) {
        propertyData.address = addressValidation.formattedAddress;
      }
      
      console.log("Parsed property data:", propertyData);
      const newProperty = await storage.createProperty(propertyData);
      res.json(newProperty);
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error("Property validation errors:", error.errors);
        return res.status(400).json({ message: "Invalid property data", errors: error.errors });
      }
      console.error("Error creating property:", error);
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  app.get('/api/properties/my', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const properties = await storage.getPropertiesByLandlord(userId);
      res.json(properties);
    } catch (error) {
      console.error("Error fetching user properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.patch('/api/properties/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const propertyId = req.params.id;
      const updates = req.body;

      // Handle empty moveInDate strings
      if (updates.moveInDate === '') {
        updates.moveInDate = null;
      } else if (updates.moveInDate && typeof updates.moveInDate === 'string') {
        updates.moveInDate = new Date(updates.moveInDate);
      }
      
      const property = await storage.getProperty(propertyId);
      if (!property || property.landlordId !== userId) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      const updatedProperty = await storage.updateProperty(propertyId, updates);
      res.json(updatedProperty);
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(500).json({ message: "Failed to update property" });
    }
  });

  app.delete('/api/properties/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const propertyId = req.params.id;
      
      const property = await storage.getProperty(propertyId);
      if (!property || property.landlordId !== userId) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      await storage.deleteProperty(propertyId);
      res.json({ message: "Property deleted successfully" });
    } catch (error) {
      console.error("Error deleting property:", error);
      res.status(500).json({ message: "Failed to delete property" });
    }
  });

  // Swipe routes
  app.post('/api/swipes', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const { propertyId, direction } = req.body;
      
      // Check if user already swiped on this property
      const hasSwipedBefore = await storage.hasUserSwipedOnProperty(userId, propertyId);
      if (hasSwipedBefore) {
        return res.status(400).json({ message: "Already swiped on this property" });
      }
      
      const swipeData = insertSwipeSchema.parse({
        buyerId: userId,
        propertyId,
        direction,
      });
      
      const newSwipe = await storage.createSwipe(swipeData);
      
      // If it's a right swipe, create a pending match
      if (direction === 'right') {
        const property = await storage.getProperty(propertyId);
        if (property) {
          const matchData = insertMatchSchema.parse({
            buyerId: userId,
            landlordId: property.landlordId,
            propertyId,
            status: 'pending',
          });
          
          const newMatch = await storage.createMatch(matchData);
          return res.json({ swipe: newSwipe, match: newMatch });
        }
      }
      
      res.json({ swipe: newSwipe });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid swipe data", errors: error.errors });
      }
      console.error("Error creating swipe:", error);
      res.status(500).json({ message: "Failed to create swipe" });
    }
  });

  // Match routes
  app.get('/api/matches', isAuthenticated, async (req: any, res) => {
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

  app.patch('/api/matches/:id/status', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const matchId = req.params.id;
      const { status } = req.body;
      
      const match = await storage.getMatch(matchId);
      if (!match || match.landlordId !== userId) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      const updatedMatch = await storage.updateMatchStatus(matchId, status);
      res.json(updatedMatch);
    } catch (error) {
      console.error("Error updating match status:", error);
      res.status(500).json({ message: "Failed to update match status" });
    }
  });

  app.get('/api/properties/:id/pending-matches', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const propertyId = req.params.id;
      
      const property = await storage.getProperty(propertyId);
      if (!property || property.landlordId !== userId) {
        return res.status(404).json({ message: "Property not found" });
      }
      
      const pendingMatches = await storage.getPendingMatchesForProperty(propertyId);
      res.json(pendingMatches);
    } catch (error) {
      console.error("Error fetching pending matches:", error);
      res.status(500).json({ message: "Failed to fetch pending matches" });
    }
  });

  // Message routes
  app.get('/api/matches/:id/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.id;
      const matchId = req.params.id;
      
      const match = await storage.getMatch(matchId);
      if (!match || (match.buyerId !== userId && match.landlordId !== userId)) {
        return res.status(404).json({ message: "Match not found" });
      }
      
      const messages = await storage.getMessagesByMatch(matchId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Create HTTP server
  const httpServer = createServer(app);
  
  // Setup WebSocket server for real-time chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket, req) => {
    console.log('New WebSocket connection');
    
    ws.on('message', async (data) => {
      try {
        const messageData = JSON.parse(data.toString());
        
        if (messageData.type === 'chat_message') {
          const { matchId, content, senderId } = messageData;
          
          // Validate that sender is part of the match
          const match = await storage.getMatch(matchId);
          if (!match || (match.buyerId !== senderId && match.landlordId !== senderId)) {
            ws.send(JSON.stringify({ type: 'error', message: 'Unauthorized' }));
            return;
          }
          
          // Save message to database
          const newMessage = await storage.createMessage({
            matchId,
            senderId,
            content,
          });
          
          // Broadcast message to all connected clients
          const broadcastData = JSON.stringify({
            type: 'new_message',
            message: newMessage,
          });
          
          wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send(broadcastData);
            }
          });
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Invalid message format' }));
      }
    });
    
    ws.on('close', () => {
      console.log('WebSocket connection closed');
    });
  });

  return httpServer;
}
