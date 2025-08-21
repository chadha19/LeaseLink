# LeaseLink Property Discovery Platform

## Overview

LeaseLink is a modern property discovery platform that revolutionizes the housing search experience by combining a Tinder-like swiping interface for property browsing with comprehensive landlord management capabilities. The application serves two primary user types: renters/buyers who browse properties through an intuitive swipe interface, and landlords who manage their property listings and review tenant applications. When both parties express mutual interest, they are matched and can communicate directly through an integrated chat system.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type-safe component development
- **Routing**: Wouter for lightweight client-side navigation
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Styling**: Tailwind CSS with custom design system using CSS variables for consistent theming
- **UI Components**: Radix UI primitives with shadcn/ui component library for accessible, consistent design patterns
- **Animation**: Framer Motion for smooth swipe interactions, gesture handling, and property card animations
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js server framework
- **Database**: PostgreSQL with Drizzle ORM for type-safe database operations and schema management
- **Authentication**: Google OAuth 2.0 integration with secure session management
- **Session Storage**: PostgreSQL-backed session store using connect-pg-simple for scalable session persistence
- **Real-time Communication**: WebSocket support for instant messaging between matched users
- **API Design**: RESTful API with TypeScript validation using Zod schemas for request/response validation

### Data Architecture
- **Users Table**: Supports role-based functionality for buyers/renters and landlords with preferences and profile data
- **Properties Table**: Complete property listings with images, amenities, location data, pricing, and landlord associations
- **Swipes Table**: Tracks user interactions with properties (like/dislike) for matching algorithm and recommendations
- **Matches Table**: Created when mutual interest is expressed, enabling communication between parties
- **Messages Table**: Real-time chat system for matched users with message history and delivery tracking
- **Sessions Table**: PostgreSQL-backed session storage for authentication persistence across requests

### Development Architecture
- **Monorepo Structure**: Shared TypeScript types between client and server in `/shared` directory for type consistency
- **Development Server**: Vite dev server with Express API proxy configuration for seamless full-stack development
- **Hot Module Replacement**: Enabled for rapid development cycles with instant feedback
- **TypeScript Configuration**: Strict mode enabled across all modules with path aliases for clean imports

## External Dependencies

### Core Technologies
- **Database**: PostgreSQL for primary data storage with Drizzle ORM as the database interface
- **Authentication Provider**: Google OAuth 2.0 for secure user authentication and profile management
- **Real-time Communication**: WebSocket server for instant messaging capabilities
- **Build & Development**: Vite for frontend tooling, esbuild for server bundling

### Optional Integrations
- **Google Maps API**: For address validation, geocoding, and property location mapping (gracefully degrades if not configured)
- **Image Storage**: Property images stored via URL references (external hosting service assumed)

### Deployment Platforms
- **Railway**: Primary deployment platform with specific startup scripts and configuration
- **Vercel**: Frontend deployment option with API proxy configuration to Railway backend

### UI & Styling Libraries
- **Radix UI**: Comprehensive primitive components for accessibility and functionality
- **Tailwind CSS**: Utility-first styling with custom design tokens and responsive design
- **Framer Motion**: Animation library for smooth user interactions and transitions
- **Lucide React**: Icon library for consistent iconography throughout the application