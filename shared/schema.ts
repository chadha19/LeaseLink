import {
  pgTable,
  text,
  varchar,
  timestamp,
  jsonb,
  index,
  serial,
  integer,
  boolean,
  decimal,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Session storage table (required for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (required for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().notNull(),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  userType: varchar("user_type").notNull().default("buyer"), // "buyer" or "landlord"
  monthlyIncome: integer("monthly_income"),
  creditScore: integer("credit_score"),
  budgetMin: integer("budget_min"),
  budgetMax: integer("budget_max"),
  preferredZipCodes: text("preferred_zip_codes").array(),
  preferredBedrooms: integer("preferred_bedrooms"),
  preferredBathrooms: integer("preferred_bathrooms"),
  petFriendly: boolean("pet_friendly").default(false),
  moveInDate: timestamp("move_in_date"),
  phone: varchar("phone"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const properties = pgTable("properties", {
  id: uuid("id").primaryKey().defaultRandom(),
  landlordId: varchar("landlord_id").notNull().references(() => users.id),
  title: varchar("title").notNull(),
  address: text("address").notNull(),
  zipCode: varchar("zip_code").notNull(),
  price: integer("price").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: decimal("bathrooms").notNull(),
  squareFootage: integer("square_footage"),
  leaseTerms: varchar("lease_terms"),
  moveInDate: timestamp("move_in_date"),
  amenities: text("amenities").array(),
  description: text("description"),
  images: text("images").array(),
  minCreditScore: integer("min_credit_score"),
  autoReject: boolean("auto_reject").default(false),
  isActive: boolean("is_active").default(true),
  marketEstimateMin: integer("market_estimate_min"),
  marketEstimateMax: integer("market_estimate_max"),
  daysOnMarket: integer("days_on_market"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const swipes = pgTable("swipes", {
  id: uuid("id").primaryKey().defaultRandom(),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  propertyId: uuid("property_id").notNull().references(() => properties.id),
  direction: varchar("direction").notNull(), // "left" or "right"
  createdAt: timestamp("created_at").defaultNow(),
});

export const matches = pgTable("matches", {
  id: uuid("id").primaryKey().defaultRandom(),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  landlordId: varchar("landlord_id").notNull().references(() => users.id),
  propertyId: uuid("property_id").notNull().references(() => properties.id),
  status: varchar("status").notNull().default("pending"), // "pending", "approved", "rejected"
  createdAt: timestamp("created_at").defaultNow(),
});

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  matchId: uuid("match_id").notNull().references(() => matches.id),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  properties: many(properties),
  swipes: many(swipes),
  buyerMatches: many(matches, { relationName: "buyerMatches" }),
  landlordMatches: many(matches, { relationName: "landlordMatches" }),
  messages: many(messages),
}));

export const propertiesRelations = relations(properties, ({ one, many }) => ({
  landlord: one(users, {
    fields: [properties.landlordId],
    references: [users.id],
  }),
  swipes: many(swipes),
  matches: many(matches),
}));

export const swipesRelations = relations(swipes, ({ one }) => ({
  buyer: one(users, {
    fields: [swipes.buyerId],
    references: [users.id],
  }),
  property: one(properties, {
    fields: [swipes.propertyId],
    references: [properties.id],
  }),
}));

export const matchesRelations = relations(matches, ({ one, many }) => ({
  buyer: one(users, {
    fields: [matches.buyerId],
    references: [users.id],
    relationName: "buyerMatches",
  }),
  landlord: one(users, {
    fields: [matches.landlordId],
    references: [users.id],
    relationName: "landlordMatches",
  }),
  property: one(properties, {
    fields: [matches.propertyId],
    references: [properties.id],
  }),
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  match: one(matches, {
    fields: [messages.matchId],
    references: [matches.id],
  }),
  sender: one(users, {
    fields: [messages.senderId],
    references: [users.id],
  }),
}));

// Schemas
export const insertUserSchema = createInsertSchema(users).omit({
  createdAt: true,
  updatedAt: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  landlordId: true,
  createdAt: true,
  updatedAt: true,
}).extend({
  bathrooms: z.union([z.string(), z.number()]).transform((val) => {
    if (typeof val === 'number') return val.toString();
    return val;
  }),
});

export const insertSwipeSchema = createInsertSchema(swipes).omit({
  id: true,
  createdAt: true,
});

export const insertMatchSchema = createInsertSchema(matches).omit({
  id: true,
  createdAt: true,
});

export const insertMessageSchema = createInsertSchema(messages).omit({
  id: true,
  createdAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;
export type InsertSwipe = z.infer<typeof insertSwipeSchema>;
export type Swipe = typeof swipes.$inferSelect;
export type InsertMatch = z.infer<typeof insertMatchSchema>;
export type Match = typeof matches.$inferSelect;
export type InsertMessage = z.infer<typeof insertMessageSchema>;
export type Message = typeof messages.$inferSelect;
