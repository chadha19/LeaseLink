# LeaseLink 🏠

A modern property discovery platform that combines Tinder-like swiping for property browsing with comprehensive landlord management tools.

## What is LeaseLink?

LeaseLink revolutionizes property hunting by letting you **swipe through curated property listings** that match your preferences. When both you and a landlord express interest, you get matched and can start chatting about your next home.

### For Renters/Buyers
- 📱 **Swipe Interface**: Browse properties with simple left/right swipes
- 🎯 **Smart Matching**: Get matched when both parties show interest
- 💬 **Direct Chat**: Message landlords instantly after matching
- 🔍 **Personalized Feed**: Properties tailored to your preferences

### For Landlords
- 🏢 **Property Management**: Add, edit, and manage all your listings
- 👥 **Tenant Applications**: Review interested renters in one place
- ✅ **Match Approval**: Accept or decline applications efficiently
- 📊 **Insights**: Track property performance and interest levels

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database
- Google OAuth credentials

### 1. Clone & Install
```bash
git clone <repository-url>
cd leaselink
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and configure:

```env
# Database
DATABASE_URL=your_postgresql_connection_string

# Google OAuth (required)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Session Security
SESSION_SECRET=your_random_secret_key

# Optional: Google Maps
GOOGLE_MAPS_API_KEY=your_maps_api_key
VITE_GOOGLE_MAPS_API_KEY=your_maps_api_key
```

### 3. Database Setup
```bash
# Push schema to database
npm run db:push
```

### 4. Run Development Server
```bash
npm run dev
```

Visit `http://localhost:5000` and start swiping!

## Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Set application type to "Web application"
6. Add authorized redirect URI:
   - Development: `http://localhost:5000/api/auth/google/callback`
   - Production: `https://yourdomain.com/api/auth/google/callback`

## How It Works

### The Matching Process
1. **Browse**: Swipe right on properties you like, left on ones you don't
2. **Interest**: When you swipe right, landlords see your application
3. **Match**: If landlords approve your application, you get matched
4. **Chat**: Start conversations about rent, move-in dates, and details

### User Types
- **Renters/Buyers**: Browse and swipe on properties
- **Landlords**: List properties and review applications

## Architecture

### Frontend (React + TypeScript)
- **Framework**: Vite + React 18 with TypeScript
- **Routing**: Wouter for lightweight navigation  
- **UI**: Tailwind CSS + shadcn/ui components
- **Animations**: Framer Motion for swipe gestures
- **State**: TanStack Query for server state management

### Backend (Node.js + Express)
- **Server**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Auth**: Google OAuth 2.0 with secure sessions
- **Real-time**: WebSocket support for chat

### Key Features
- **Cross-platform**: Works on desktop, tablet, and mobile
- **Real-time Chat**: Instant messaging between matches
- **Image Uploads**: Property photos and profile pictures
- **Responsive Design**: Mobile-first interface
- **Secure Authentication**: Google OAuth with session management

## Deployment

### Railway (Recommended)
1. Connect your GitHub repository to Railway
2. Set environment variables in Railway dashboard
3. Railway automatically builds and deploys

### Vercel
1. Connect repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `dist/public`
4. Add environment variables

## API Endpoints

### Authentication
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/user` - Get current user
- `GET /api/logout` - Logout user

### Properties
- `GET /api/properties` - Browse properties (with user preferences)
- `POST /api/properties` - Create property (landlords only)
- `GET /api/properties/my` - Get my properties (landlords only)
- `PATCH /api/properties/:id` - Update property
- `DELETE /api/properties/:id` - Delete property

### Swipes & Matches
- `POST /api/swipes` - Swipe on property
- `GET /api/matches` - Get my matches
- `PATCH /api/matches/:id/status` - Approve/reject match (landlords)

### Chat
- `GET /api/messages/:matchId` - Get chat messages
- `POST /api/messages` - Send message

## Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run db:push` - Push database schema changes
- `npm run db:studio` - Open Drizzle Studio (database GUI)

### Project Structure
```
├── client/               # Frontend React app
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Route components
│   │   ├── hooks/        # Custom React hooks
│   │   └── lib/          # Utilities and configuration
├── server/               # Backend Express app
│   ├── routes.ts         # API route definitions
│   ├── storage.ts        # Database operations
│   └── googleAuth.ts     # Authentication setup
├── shared/               # Shared TypeScript types
│   └── schema.ts         # Database schema and types
└── public/               # Static assets
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Support

For questions or issues:
1. Check existing issues in the repository
2. Create a new issue with detailed description
3. Include error messages and steps to reproduce

## License

This project is licensed under the MIT License - see the LICENSE file for details.

---

**Happy house hunting! 🏠✨**