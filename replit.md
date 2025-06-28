# LeaseLink - Replit Development Guide

## Overview

LeaseLink is a modern property discovery platform that combines a Tinder-like swiping interface for property browsing with a comprehensive landlord management system. The application enables buyers/renters to swipe through property listings and connect with landlords through a matching system.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Animation**: Framer Motion for swipe interactions
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js server
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: Express sessions with PostgreSQL storage
- **Real-time Communication**: WebSocket support for instant messaging
- **API Design**: RESTful API with TypeScript validation using Zod

### Development Environment
- **Monorepo Structure**: Shared TypeScript types between client and server
- **Development Server**: Vite dev server with Express API proxy
- **Hot Module Replacement**: Enabled for rapid development
- **TypeScript**: Strict mode enabled across all modules

## Key Components

### Data Models
- **Users**: Support for both buyers/renters and landlords with role-based features
- **Properties**: Complete property listings with images, amenities, and location data
- **Swipes**: Track user interactions with properties (like/dislike)
- **Matches**: Created when both user and landlord express mutual interest
- **Messages**: Real-time chat system for matched users and landlords

### Authentication System
- **Provider**: Replit Auth integration
- **Session Storage**: PostgreSQL-backed session management
- **User Roles**: Buyer/renter and landlord role differentiation
- **Protected Routes**: Authentication middleware for API endpoints

### Swipe Interface
- **Technology**: Framer Motion for smooth gesture-based interactions
- **Matching Logic**: Automatic match creation on mutual interest
- **Real-time Feedback**: Instant notifications for successful matches
- **Property Filtering**: Location and preference-based filtering

### Real-time Features
- **WebSocket Connection**: Persistent connection for live updates
- **Chat System**: Instant messaging between matched users
- **Match Notifications**: Real-time match alerts
- **Connection Management**: Automatic reconnection handling

## Data Flow

### Property Discovery Flow
1. User authentication and profile setup
2. Property filtering based on user preferences
3. Swipe interface with gesture-based interactions
4. Match creation on mutual interest
5. Real-time notification delivery

### Landlord Management Flow
1. Property creation and management
2. Application review and approval
3. Match management and communication
4. Analytics and property performance tracking

### Communication Flow
1. Match establishment between user and landlord
2. WebSocket connection initialization
3. Real-time message exchange
4. Message persistence in database

## External Dependencies

### Database and ORM
- **Neon Database**: Serverless PostgreSQL hosting
- **Drizzle ORM**: Type-safe database operations
- **Connection Pooling**: Optimized database connections

### UI and Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling framework
- **Framer Motion**: Animation and gesture library
- **Lucide React**: Icon library

### Development Tools
- **Vite**: Fast build tool and dev server
- **ESBuild**: JavaScript bundling for production
- **TypeScript**: Static type checking
- **PostCSS**: CSS processing pipeline

## Deployment Strategy

### Production Build
- **Client**: Vite builds optimized React bundle
- **Server**: ESBuild creates Node.js bundle
- **Assets**: Static assets served from dist/public
- **Environment**: Production environment variables required

### Database Setup
- **Schema**: Automated with Drizzle migrations
- **Connection**: PostgreSQL connection string required
- **Sessions**: Automatic session table management

### Environment Configuration
- **DATABASE_URL**: PostgreSQL connection string
- **SESSION_SECRET**: Secure session encryption key
- **REPL_ID**: Replit environment identifier
- **NODE_ENV**: Environment mode (development/production)

## Changelog

```
Changelog:
- June 28, 2025. Initial setup
- June 28, 2025. Fixed database connection issues by switching from WebSocket to HTTP-based Neon connection
- June 28, 2025. Resolved property creation validation errors and landlordId assignment issues
- June 28, 2025. Increased Express payload limits to 50MB for image uploads
- June 28, 2025. Property creation functionality fully working with image upload support
- June 28, 2025. Added AI-powered property recommendations using OpenAI GPT-4o
- June 28, 2025. Implemented delete and "mark as sold" functionality for landlords
- June 28, 2025. Fixed property deletion to handle foreign key constraints properly
- June 28, 2025. Renamed application from SwipeHousing to LeaseLink
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```