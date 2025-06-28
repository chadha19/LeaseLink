import {
  users,
  properties,
  swipes,
  matches,
  messages,
  type User,
  type UpsertUser,
  type Property,
  type InsertProperty,
  type Swipe,
  type InsertSwipe,
  type Match,
  type InsertMatch,
  type Message,
  type InsertMessage,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, asc, inArray } from "drizzle-orm";

export interface IStorage {
  // User operations (required for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Property operations
  createProperty(property: InsertProperty): Promise<Property>;
  getProperty(id: string): Promise<Property | undefined>;
  getPropertiesByLandlord(landlordId: string): Promise<Property[]>;
  getActiveProperties(filters?: {
    zipCodes?: string[];
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
  }): Promise<Property[]>;
  updateProperty(id: string, updates: Partial<InsertProperty>): Promise<Property>;
  deleteProperty(id: string): Promise<void>;
  
  // Swipe operations
  createSwipe(swipe: InsertSwipe): Promise<Swipe>;
  getSwipesByBuyer(buyerId: string): Promise<Swipe[]>;
  getSwipesByProperty(propertyId: string): Promise<Swipe[]>;
  hasUserSwipedOnProperty(buyerId: string, propertyId: string): Promise<boolean>;
  
  // Match operations
  createMatch(match: InsertMatch): Promise<Match>;
  getMatchesByBuyer(buyerId: string): Promise<Match[]>;
  getMatchesByLandlord(landlordId: string): Promise<Match[]>;
  getMatch(id: string): Promise<Match | undefined>;
  updateMatchStatus(id: string, status: string): Promise<Match>;
  getPendingMatchesForProperty(propertyId: string): Promise<Match[]>;
  
  // Message operations
  createMessage(message: InsertMessage): Promise<Message>;
  getMessagesByMatch(matchId: string): Promise<Message[]>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Property operations
  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db
      .insert(properties)
      .values(property)
      .returning();
    return newProperty;
  }

  async getProperty(id: string): Promise<Property | undefined> {
    const [property] = await db
      .select()
      .from(properties)
      .where(eq(properties.id, id));
    return property;
  }

  async getPropertiesByLandlord(landlordId: string): Promise<Property[]> {
    return await db
      .select()
      .from(properties)
      .where(eq(properties.landlordId, landlordId))
      .orderBy(desc(properties.createdAt));
  }

  async getActiveProperties(filters?: {
    zipCodes?: string[];
    minPrice?: number;
    maxPrice?: number;
    bedrooms?: number;
    bathrooms?: number;
    amenities?: string[];
  }): Promise<Property[]> {
    let query = db
      .select()
      .from(properties)
      .where(eq(properties.isActive, true));

    // Apply filters if provided
    // Note: Complex filtering would need more sophisticated query building
    return await query.orderBy(desc(properties.createdAt));
  }

  async updateProperty(id: string, updates: Partial<InsertProperty>): Promise<Property> {
    const [updatedProperty] = await db
      .update(properties)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return updatedProperty;
  }

  async deleteProperty(id: string): Promise<void> {
    await db.delete(properties).where(eq(properties.id, id));
  }

  // Swipe operations
  async createSwipe(swipe: InsertSwipe): Promise<Swipe> {
    const [newSwipe] = await db
      .insert(swipes)
      .values(swipe)
      .returning();
    return newSwipe;
  }

  async getSwipesByBuyer(buyerId: string): Promise<Swipe[]> {
    return await db
      .select()
      .from(swipes)
      .where(eq(swipes.buyerId, buyerId))
      .orderBy(desc(swipes.createdAt));
  }

  async getSwipesByProperty(propertyId: string): Promise<Swipe[]> {
    return await db
      .select()
      .from(swipes)
      .where(eq(swipes.propertyId, propertyId))
      .orderBy(desc(swipes.createdAt));
  }

  async hasUserSwipedOnProperty(buyerId: string, propertyId: string): Promise<boolean> {
    const [swipe] = await db
      .select()
      .from(swipes)
      .where(and(
        eq(swipes.buyerId, buyerId),
        eq(swipes.propertyId, propertyId)
      ));
    return !!swipe;
  }

  // Match operations
  async createMatch(match: InsertMatch): Promise<Match> {
    const [newMatch] = await db
      .insert(matches)
      .values(match)
      .returning();
    return newMatch;
  }

  async getMatchesByBuyer(buyerId: string): Promise<Match[]> {
    return await db
      .select()
      .from(matches)
      .where(eq(matches.buyerId, buyerId))
      .orderBy(desc(matches.createdAt));
  }

  async getMatchesByLandlord(landlordId: string): Promise<Match[]> {
    return await db
      .select()
      .from(matches)
      .where(eq(matches.landlordId, landlordId))
      .orderBy(desc(matches.createdAt));
  }

  async getMatch(id: string): Promise<Match | undefined> {
    const [match] = await db
      .select()
      .from(matches)
      .where(eq(matches.id, id));
    return match;
  }

  async updateMatchStatus(id: string, status: string): Promise<Match> {
    const [updatedMatch] = await db
      .update(matches)
      .set({ status })
      .where(eq(matches.id, id))
      .returning();
    return updatedMatch;
  }

  async getPendingMatchesForProperty(propertyId: string): Promise<Match[]> {
    return await db
      .select()
      .from(matches)
      .where(and(
        eq(matches.propertyId, propertyId),
        eq(matches.status, "pending")
      ))
      .orderBy(desc(matches.createdAt));
  }

  // Message operations
  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  async getMessagesByMatch(matchId: string): Promise<Message[]> {
    return await db
      .select()
      .from(messages)
      .where(eq(messages.matchId, matchId))
      .orderBy(asc(messages.createdAt));
  }
}

export const storage = new DatabaseStorage();
