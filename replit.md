# LeaseLink - Property Discovery Platform

## Overview

LeaseLink is a modern property discovery platform that combines a Tinder-like swiping interface for property browsing with a comprehensive landlord management system. The application enables buyers/renters to swipe through property listings and connect with landlords upon mutual matches, facilitating seamless property discovery and communication.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type-safe component development
- **Routing**: Wouter for lightweight client-side navigation
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Styling**: Tailwind CSS with custom design system and CSS variables
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent design
- **Animation**: Framer Motion for smooth swipe interactions and gesture handling
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Google OAuth 2.0 with secure session management
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple
- **Real-time Communication**: WebSocket support for instant messaging
- **API Design**: RESTful API with TypeScript validation using Zod schemas

### Development Environment
- **Monorepo Structure**: Shared TypeScript types between client and server in `/shared` directory
- **Development Server**: Vite dev server with Express API proxy for seamless development
- **Hot Module Replacement**: Enabled for rapid development cycles
- **TypeScript**: Strict mode enabled across all modules for type safety

## Key Components

### Data Models
- **Users**: Supports both buyers/renters and landlords with role-based features and preferences
- **Properties**: Complete property listings with images, amenities, location data, and pricing
- **Swipes**: Tracks user interactions with properties (like/dislike) for matching algorithm
- **Matches**: Created when both user and landlord express mutual interest
- **Messages**: Real-time chat system for matched users and landlords
- **Sessions**: PostgreSQL-backed session storage for authentication persistence

### Authentication System
- **Provider**: Google OAuth 2.0 integration with fallback for development
- **Session Management**: Express sessions with PostgreSQL storage for scalability
- **User Roles**: Differentiation between buyer/renter and landlord with role-specific dashboards
- **Protected Routes**: Authentication middleware protecting API endpoints
- **Development Mode**: Dummy credentials support for local development

### Swipe Interface
- **Technology**: Framer Motion for smooth gesture-based interactions
- **Matching Logic**: Automatic match creation on mutual interest between user and landlord
- **Real-time Feedback**: Instant notifications for successful matches via WebSocket
- **Mobile-First**: Touch-optimized interface with responsive design

### Landlord Dashboard
- **Property Management**: CRUD operations for property listings with image upload
- **Application Review**: Interface for reviewing and managing buyer applications
- **Match Management**: Approve/reject functionality for incoming applications
- **Analytics**: Property performance metrics and interested buyer counts

## Data Flow

### Property Discovery Flow
1. User authenticates via Google OAuth
2. System fetches user preferences and browsing history
3. AI recommendation service (optional) scores properties based on user data
4. Frontend displays properties in swipeable interface
5. User swipes trigger API calls to record interactions
6. Mutual interest creates matches and triggers real-time notifications

### Communication Flow
1. Match creation enables chat functionality
2. WebSocket connection established for real-time messaging
3. Messages stored in PostgreSQL for persistence
4. Real-time updates delivered to both parties
5. Chat history maintained across sessions

### Property Management Flow
1. Landlords create/edit properties through dashboard interface
2. Address validation via Google Maps API (optional)
3. Image uploads processed and stored
4. Properties become available in swipe interface
5. Interest tracking and analytics updated in real-time

## External Dependencies

### Required Services
- **PostgreSQL Database**: Primary data storage (recommend Neon for serverless deployment)
- **Google OAuth**: Authentication provider requiring client ID and secret
- **Node.js Runtime**: Version 18+ for server execution

### Optional Services
- **Google Maps API**: Address validation and embedded maps (graceful fallback if unavailable)
- **OpenAI API**: AI-powered property recommendations (uses fallback algorithm if unavailable)
- **WebSocket Support**: Real-time chat functionality (degrades gracefully if unavailable)

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `GOOGLE_CLIENT_ID`: OAuth client identifier
- `GOOGLE_CLIENT_SECRET`: OAuth client secret
- `SESSION_SECRET`: Session encryption key
- `GOOGLE_MAPS_API_KEY`: Optional for address validation
- `VITE_GOOGLE_MAPS_API_KEY`: Client-side maps integration
- `OPENAI_API_KEY`: Optional for AI recommendations
- `NODE_ENV`: Environment setting (development/production)

## Deployment Strategy

### Database Setup
- Uses Drizzle ORM with PostgreSQL-compatible databases
- Automatic schema migrations via `npm run db:push`
- Session table creation handled automatically
- **Production**: Neon PostgreSQL database configured and ready

### Build Process
- Frontend: Vite builds React app to `dist/public`
- Backend: Express serverless function in `/api/server.ts`
- Shared types: Compiled and included in both builds
- Assets: Static files served from build directory

### Vercel Deployment (READY)
- **Serverless Configuration**: `/api/server.ts` handles all API routes
- **Build Command**: `npm run build`
- **Output Directory**: `dist/public`
- **Framework Preset**: "Other" (not Vite)
- **Custom Domain**: Ready for leaselink.pro

### Production Environment
- ✅ Neon PostgreSQL database with all tables
- ✅ Google OAuth configuration ready
- ✅ Serverless function architecture
- ✅ All TypeScript errors resolved
- ✅ Environment variables documented

### Recent Changes (August 5, 2025)
- Removed all Vercel deployment configurations (no longer using Vercel)
- Fixed Google OAuth callback URL for Replit deployment
- Cleaned up deployment files and configurations
- **RESOLVED: Google OAuth authentication is now fully functional**
- **CONFIRMED: User authentication working - Purabh Singh successfully logged in**
- Added comprehensive OAuth error logging and debugging
- Confirmed database connectivity and user creation process works
- OAuth callback URL routing verified and working correctly
- **Note: OAuth only works via direct link, not in Replit preview pane (iframe security)**
- App ready for Google authentication on Replit deployment