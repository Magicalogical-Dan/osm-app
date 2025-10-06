# OSM - Outside Sport Management

A comprehensive platform for rugby league and rugby union players built with Next.js and Supabase.

## Features

- **User Authentication**: Secure login with Supabase Auth (accounts created by administrators)
- **Role-based Access**: Admin and User roles with appropriate permissions
- **Player Profiles**: Manage club, position, bio, and sport preferences
- **News System**: Filtered rugby news by sport, league, club, and date
- **Social Media Integration**: Connect Instagram, TikTok, and Twitter accounts
- **Support System**: Direct messaging with agents and support team
- **Settings**: Customize app preferences, notifications, and privacy
- **Responsive Design**: Modern UI with OSM brand colors and smooth animations

## Tech Stack

- **Frontend**: Next.js 15, TypeScript, Tailwind CSS
- **Backend**: Supabase (Database, Auth, Real-time)
- **Deployment**: Vercel
- **Icons**: Lucide React
- **Styling**: Custom CSS with OSM brand colors

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd osm-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.local.example .env.local
```

4. Configure your Supabase project:
   - Create a new Supabase project
   - Run the SQL schema from `database-schema.sql`
   - Add your Supabase credentials to `.env.local`

5. Start the development server:
```bash
npm run dev
```

### Environment Variables

Create a `.env.local` file with the following variables:

```env
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=YOUR_SERVICE_ROLE_KEY
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-nextauth-secret-key-here
```

## Database Schema

The application uses the following main tables:

- **users**: Extended user information with roles
- **profiles**: Player profiles with club, position, bio, and preferences
- **news_articles**: Rugby news content with filtering options
- **support_messages**: Support tickets and messages

See `database-schema.sql` for the complete schema.

## Deployment

### Vercel Deployment

1. Push your code to a Git repository
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

The project includes a `vercel.json` configuration file for optimal deployment.

## Brand Colors

- **Primary Blue**: `rgb(40, 88, 200)`
- **Primary Green**: `rgb(101, 165, 44)`
- **Primary Red**: `rgb(234, 54, 36)`
- **Secondary Colors**: 20% opacity versions for backgrounds and accents

## Features Overview

### Home Page
- Welcome message for authenticated users
- Quick access to all main sections
- Recent activity feed
- Performance stats overview

### Profile Management
- Club and position information
- Bio and sport selection (Rugby League/Union)
- Social media links
- Tooltip preferences

### News System
- Sport-specific filtering
- League and club filters
- Date-based filtering
- Real-time updates

### Social Media
- Instagram, TikTok, Twitter integration
- Social analytics dashboard
- AI-powered engagement suggestions
- Social Info Pack download

### Support System
- Direct messaging with agents
- FAQ section
- Contact information
- Ticket management

### Settings
- Notification preferences
- Privacy controls
- Appearance customization
- Tooltip settings

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is proprietary software for OSM Ltd.

## Support

For technical support or questions, contact the development team or use the in-app support system.