# TownLoop 🏘️

**The Heartbeat of Your Community** - A modern event discovery platform connecting communities through local events, built with Next.js, Supabase, and Tailwind CSS.

![TownLoop](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

## 🌟 Features

### 🎯 Core Features
- **Event Discovery**: Browse and search local events by category, date, and location
- **Town-Based Organization**: Events organized by towns/municipalities  
- **Real-time Updates**: Live event data with Supabase real-time subscriptions
- **Responsive Design**: Optimized for mobile, tablet, and desktop experiences
- **User Profiles**: Personal event tracking and community engagement

### 🔐 Security & Authentication
- **Multi-Factor Authentication (MFA)**: TOTP-based 2FA for enhanced security
- **Row Level Security (RLS)**: Database-level security policies
- **hCaptcha Integration**: Bot protection for authentication
- **Password Protection**: Secure user authentication with Supabase Auth
- **Role-Based Access Control**: Admin, user, and partner role management

### 👨‍💼 Admin Dashboard
- **Event Management**: Approve/reject submitted events with bulk operations
- **User Management**: View, edit, ban users, and manage roles
- **Real-time Analytics**: User growth, event statistics, and engagement metrics
- **Live Monitoring**: Activity logs, system health metrics, and admin alerts
- **Platform Settings**: System configuration and data export capabilities

### 🎮 Gamification
- **XP Points System**: Earn points for community engagement
- **Achievement Badges**: Unlock badges for various activities
- **Community Levels**: Progress through community involvement
- **Leaderboards**: Community engagement rankings

## 🚀 Tech Stack

### Frontend
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Custom component library
- **State Management**: React Context API
- **Maps**: Leaflet with React-Leaflet

### Backend
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth with MFA
- **Real-time**: Supabase Realtime
- **Storage**: Supabase Storage (for event images/flyers)
- **Functions**: Supabase Edge Functions

### DevOps & Tools
- **Deployment**: Vercel (recommended)
- **Version Control**: Git
- **Package Manager**: npm/yarn
- **Linting**: ESLint
- **Formatting**: Prettier

## 📋 Prerequisites

Before you begin, ensure you have:
- **Node.js** 18.0 or higher
- **npm** or **yarn** package manager
- **Supabase** account and project
- **hCaptcha** account (for bot protection)

## 🛠️ Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/townloop.git
cd townloop
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
```

### 3. Environment Configuration
Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# hCaptcha Configuration
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=your_hcaptcha_site_key
HCAPTCHA_SECRET_KEY=your_hcaptcha_secret_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Database Setup

#### Apply Migrations
```bash
# Install Supabase CLI
npm install -g supabase

# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref your-project-ref

# Apply all migrations
supabase db push
```

#### Seed Data (Optional)
```bash
node scripts/seed-events.js
```

### 5. Configure Supabase

#### Enable Required Extensions
In your Supabase SQL Editor, run:
```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis";
```

#### Configure Authentication
1. **Enable MFA**: Go to Authentication > Settings and enable TOTP
2. **Configure Captcha**: Add your hCaptcha keys in Authentication > Settings
3. **Set Password Policy**: Configure minimum password requirements

#### Configure Storage
1. Create a `event-images` bucket
2. Set appropriate RLS policies for public/private access

### 6. Start Development Server
```bash
npm run dev
# or
yarn dev
```

Visit `http://localhost:3000` to see your application running!

## 📁 Project Structure

```
townloop/
├── app/                          # Next.js App Router
│   ├── (main)/                   # Main public pages
│   ├── (dashboards)/             # Admin/partner dashboards
│   ├── account/                  # User account pages
│   ├── api/                      # API routes
│   └── auth/                     # Authentication pages
├── components/                   # React components
│   ├── admin/                    # Admin dashboard components
│   ├── auth/                     # Authentication components
│   ├── community/                # Community features
│   ├── events/                   # Event-related components
│   ├── forms/                    # Form components
│   ├── layout/                   # Layout components
│   ├── map/                      # Map components
│   ├── search/                   # Search functionality
│   └── ui/                       # UI primitives
├── constants/                    # App constants
├── lib/                          # Utilities and configurations
│   ├── context/                  # React contexts
│   ├── db/                       # Database utilities
│   ├── hooks/                    # Custom React hooks
│   ├── supabase/                 # Supabase client
│   ├── types/                    # TypeScript types
│   └── utils/                    # Utility functions
├── public/                       # Static assets
├── scripts/                      # Build/deployment scripts
├── supabase/                     # Supabase configuration
│   └── migrations/               # Database migrations
└── styles/                       # Global styles
```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | ✅ |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous key | ✅ |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | ✅ |
| `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` | hCaptcha site key | ✅ |
| `HCAPTCHA_SECRET_KEY` | hCaptcha secret key | ✅ |
| `NEXT_PUBLIC_APP_URL` | Application URL | ✅ |

### Supabase Configuration

#### Row Level Security (RLS) Policies
The application uses comprehensive RLS policies:
- **Events**: Public read access, authenticated write access
- **Profiles**: Users can read/update own profile, admins can manage all
- **Comments**: Public read, authenticated write with ownership checks
- **Admin tables**: Admin-only access with role verification

#### Database Functions
Custom PostgreSQL functions for:
- Event management and search
- User analytics and statistics
- Admin operations and monitoring
- Real-time activity logging

## 🚀 Deployment

### Vercel (Recommended)

1. **Connect Repository**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   
   # Deploy
   vercel
   ```

2. **Configure Environment Variables**
   Add all environment variables in the Vercel dashboard

3. **Configure Domains**
   Set up custom domain and update `NEXT_PUBLIC_APP_URL`

### Manual Deployment

1. **Build the Application**
   ```bash
   npm run build
   ```

2. **Start Production Server**
   ```bash
   npm start
   ```

## 🔒 Security Features

### Authentication Security
- **Password Policies**: Configurable minimum requirements
- **Multi-Factor Authentication**: TOTP-based 2FA
- **Session Management**: Secure token handling
- **Bot Protection**: hCaptcha integration

### Database Security
- **Row Level Security**: Enabled on all tables
- **Function Security**: `SECURITY DEFINER` with explicit search paths
- **Input Validation**: Parameterized queries and validation
- **Role-Based Access**: Granular permission system

### Application Security
- **CSRF Protection**: Built-in Next.js protection
- **XSS Prevention**: Input sanitization and validation
- **Secure Headers**: Security headers configuration
- **Rate Limiting**: API endpoint protection

## 📊 Admin Features

### Event Management
- View all submitted events
- Approve/reject events with reasons
- Bulk operations for multiple events
- Event analytics and statistics

### User Management
- View all registered users
- Edit user profiles and roles
- Ban/unban user accounts
- User activity monitoring

### System Monitoring
- Real-time activity logs
- System health metrics
- Performance monitoring
- Automated alert system

### Analytics Dashboard
- User growth statistics
- Event submission trends
- Community engagement metrics
- Custom date range analysis

## 🤝 Contributing

1. **Fork the Repository**
2. **Create Feature Branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit Changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
4. **Push to Branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open Pull Request**

### Development Guidelines
- Follow TypeScript best practices
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages
- Test thoroughly before submitting PRs
- Update documentation as needed

## 📝 API Documentation

### Public Endpoints
- `GET /api/events` - Fetch public events
- `GET /api/events/[id]` - Get specific event
- `POST /api/events` - Submit new event (authenticated)

### Admin Endpoints
- `GET /api/admin/users` - Get all users (admin only)
- `POST /api/admin/events/approve` - Approve events (admin only)
- `GET /api/admin/analytics` - Get system analytics (admin only)

## 🐛 Troubleshooting

### Common Issues

**Database Connection Issues**
```bash
# Check Supabase connection
supabase status
```

**Migration Errors**
```bash
# Reset and reapply migrations
supabase db reset
supabase db push
```

**Authentication Issues**
- Verify hCaptcha keys are correct
- Check Supabase Auth configuration
- Ensure RLS policies are properly configured

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** for the excellent backend-as-a-service platform
- **Next.js** team for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework
- **React-Leaflet** for mapping functionality
- **hCaptcha** for bot protection services

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/townloop/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/townloop/discussions)
- **Email**: support@townloop.com

---

**Built with ❤️ for communities everywhere**