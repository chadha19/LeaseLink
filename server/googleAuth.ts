import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// For development, use dummy values if credentials are not set
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'dummy-client-id';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret';

if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.warn("⚠️  Google OAuth credentials not found. Using dummy values for development.");
  console.warn("   Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET for production.");
}

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000; // 1 week
  const pgStore = connectPg(session);
  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl,
    tableName: "sessions",
  });
  
  return session({
    secret: process.env.SESSION_SECRET || 'your-session-secret-here',
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: false, // Set to false for Replit development
      maxAge: sessionTtl,
      sameSite: 'lax', // Allow cross-site requests for OAuth
    },
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  
  // Add CORS headers for OAuth
  app.use((req, res, next) => {
    res.header('X-Frame-Options', 'SAMEORIGIN');
    res.header('Access-Control-Allow-Credentials', 'true');
    next();
  });
  
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Google OAuth Strategy
  const callbackURL = process.env.REPLIT_DEV_DOMAIN 
    ? `https://${process.env.REPLIT_DEV_DOMAIN}/api/auth/google/callback`
    : "/api/auth/google/callback";
    
  console.log(`🔗 Google OAuth callback URL: ${callbackURL}`);
    
  passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: callbackURL
  },
  async (accessToken, refreshToken, profile, done) => {
    try {
      const email = profile.emails?.[0]?.value || '';
      
      // First, try to find existing user by email
      let user = await storage.getUserByEmail(email);
      
      if (user) {
        // User exists, update their Google profile info
        const updatedUser = await storage.updateUserProfile(user.id, {
          firstName: profile.name?.givenName || user.firstName,
          lastName: profile.name?.familyName || user.lastName,
          profileImageUrl: profile.photos?.[0]?.value || user.profileImageUrl,
        });
        return done(null, updatedUser);
      } else {
        // New user, create with Google profile data
        const userData = {
          id: profile.id,
          email: email,
          firstName: profile.name?.givenName || '',
          lastName: profile.name?.familyName || '',
          profileImageUrl: profile.photos?.[0]?.value || null,
        };
        
        const newUser = await storage.upsertUser(userData);
        return done(null, newUser);
      }
    } catch (error) {
      console.error('Google OAuth error:', error);
      return done(error, undefined);
    }
  }));

  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });

  // Auth routes
  app.get("/api/auth/google", (req, res, next) => {
    console.log("🚀 Starting Google OAuth flow");
    passport.authenticate("google", { scope: ["profile", "email"] })(req, res, next);
  });

  app.get("/api/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login-failed" }),
    (req, res) => {
      console.log("✅ Google OAuth callback successful");
      // Successful authentication, redirect to home
      res.redirect("/");
    }
  );
  
  app.get("/login-failed", (req, res) => {
    console.log("❌ Google OAuth failed");
    res.status(401).send(`
      <html>
        <body>
          <h2>Login Failed</h2>
          <p>There was an issue with Google authentication.</p>
          <a href="/">Try Again</a>
        </body>
      </html>
    `);
  });

  app.get("/api/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ message: "Logout failed" });
      }
      res.redirect("/");
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  next();
};