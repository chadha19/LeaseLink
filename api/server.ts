// Complete Express server for Vercel serverless
import serverless from 'serverless-http';
import express from 'express';
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";

const app = express();

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
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

app.use(passport.initialize());
app.use(passport.session());

// Google OAuth Strategy
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || 'dummy-client-id';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || 'dummy-client-secret';

passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID,
  clientSecret: GOOGLE_CLIENT_SECRET,
  callbackURL: "https://leaselink.pro/api/auth/google/callback"
},
async (accessToken, refreshToken, profile, done) => {
  try {
    const email = profile.emails?.[0]?.value || '';
    
    // For now, just create a simple user object
    const user = {
      id: profile.id,
      email: email,
      firstName: profile.name?.givenName || '',
      lastName: profile.name?.familyName || '',
      profileImageUrl: profile.photos?.[0]?.value || null,
    };
    
    console.log('OAuth success for user:', email);
    return done(null, user);
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
    // For now, just return the user ID
    done(null, { id });
  } catch (error) {
    done(error, null);
  }
});

// Auth routes
app.get("/api/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get("/api/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/?auth=error" }),
  (req, res) => {
    // Successful authentication, redirect to home
    console.log('OAuth callback success, redirecting to homepage');
    res.redirect("/?auth=success");
  }
);

app.get("/api/auth/user", (req, res) => {
  if (req.isAuthenticated && req.isAuthenticated()) {
    res.json(req.user);
  } else {
    res.status(401).json({ message: "Unauthorized" });
  }
});

app.get("/api/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Logout failed" });
    }
    res.redirect("/");
  });
});

// Default route
app.get("/api/*", (req, res) => {
  res.json({ 
    message: 'LeaseLink API is running',
    path: req.path,
    authenticated: req.isAuthenticated ? req.isAuthenticated() : false
  });
});

export default serverless(app);