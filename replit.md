# LeaseLink - Property Discovery Platform

## Overview

LeaseLink is a modern property discovery platform that combines a Tinder-like swiping interface for property browsing with a comprehensive landlord management system. The application enables buyers/renters to discover properties through an intuitive swipe interface and facilitates communication between potential tenants and landlords through a real-time chat system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side navigation
- **State Management**: TanStack Query (React Query) for efficient server state management and caching
- **Styling**: Tailwind CSS with custom design system and CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui component library for consistent, accessible components
- **Animation**: Framer Motion for smooth swipe interactions and gesture handling
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations
- **Authentication**: Google OAuth 2.0 with secure session management via connect-pg-simple
- **Real-time Communication**: WebSocket implementation for instant messaging
- **API Design**: RESTful API with comprehensive TypeScript validation using Zod schemas

### Development Environment
- **Monorepo Structure**: Shared TypeScript types between client and server in `/shared` directory
- **Hot Module Replacement**: Vite dev server with Express API proxy for seamless development
- **TypeScript**: Strict mode enabled across all modules for enhanced type safety

## Key Components

### Data Models
The application uses a comprehensive schema defined in `shared/schema.ts`:

- **Users**: Support for both buyers/renters and landlords with role-based features
- **Properties**: Complete property listings with images, amenities, location data, and pricing
- **Swipes**: Track user interactions with properties (like/dislike) for matching algorithm
- **Matches**: Created when both user and landlord express mutual interest
- **Messages**: Real-time chat system for matched users and landlords
- **Sessions**: PostgreSQL-backed session storage for secure authentication

### Authentication System
- **Provider**: Google OAuth 2.0 integration with fallback for development
- **Session Management**: Express sessions stored in PostgreSQL with automatic cleanup
- **User Roles**: Buyer/renter and landlord role differentiation with role-based routing
- **Protected Routes**: Authentication middleware protecting all API endpoints

### Swipe Interface
- **Technology**: Framer Motion for smooth gesture-based interactions with drag constraints
- **Matching Logic**: Automatic match creation when both parties show interest
- **Real-time Feedback**: Instant notifications for successful matches via toast system

### Real-time Chat System
- **WebSocket Implementation**: Custom WebSocket server for real-time message delivery
- **Message Storage**: All messages persisted in PostgreSQL with timestamp tracking
- **Connection Management**: Automatic reconnection with exponential backoff

## Data Flow

1. **User Authentication**: Google OAuth → Session Creation → User Profile Setup
2. **Property Discovery**: Fetch Properties → Swipe Interface → Record Swipe → Check for Matches
3. **Match Creation**: Mutual Interest Detected → Create Match → Notify Both Parties
4. **Real-time Communication**: WebSocket Connection → Message Exchange → Database Persistence
5. **Landlord Management**: Property CRUD Operations → Application Review → Match Approval/Rejection

## External Dependencies

### Required APIs
- **Google OAuth 2.0**: User authentication and profile data
- **Google Maps API** (Optional): Address validation and embedded maps for property locations
- **OpenAI API** (Optional): AI-powered property recommendations and matching

### Database Requirements
- **PostgreSQL**: Primary database for all application data
- **Connection Pooling**: Neon serverless PostgreSQL recommended for production

### Environment Configuration
The application requires the following environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: OAuth credentials
- `SESSION_SECRET`: Session encryption key
- `GOOGLE_MAPS_API_KEY` & `VITE_GOOGLE_MAPS_API_KEY`: Maps integration
- `OPENAI_API_KEY`: AI recommendations (optional)

## Deployment Strategy

### Platform Independence
The application has been architected to be completely independent of Replit's proprietary services and can be deployed on any Node.js-compatible hosting platform.

### Recommended Hosting Options
1. **Vercel**: Automatic deployments from GitHub with serverless functions
2. **Railway**: Simple deployment with built-in PostgreSQL
3. **Render**: Free tier available with automatic builds
4. **Traditional VPS**: DigitalOcean, Linode, or similar providers

### Build Process
- **Frontend**: Vite builds to `dist/public` directory
- **Backend**: esbuild bundles server code to `dist/index.js`
- **Database**: Drizzle migrations handle schema deployment
- **Assets**: Static assets served from build directory

### Production Considerations
- Environment variables must be configured on hosting platform
- PostgreSQL database must be provisioned (Neon recommended for serverless)
- Google OAuth redirect URIs must be updated for production domain
- WebSocket connections require proper proxy configuration for some hosting platforms

The application includes comprehensive deployment guides for multiple platforms and detailed setup instructions for all external services.