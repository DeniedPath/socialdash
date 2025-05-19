# EchoPulse – Social Media Analytics Dashboard

**EchoPulse** is a modern, full-stack web platform for managing and analyzing social media performance across multiple platforms. It features real-time analytics, OAuth-based account connections, responsive data visualizations, and a professional user experience built with Next.js 13 App Router.

## 🧰 Tech Stack
- **Frontend**: Next.js (App Router), React, Tailwind CSS, Recharts
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js (Credentials + OAuth)
- **AI Integration**: OpenAI API for smart suggestions
- **Deployment**: Vercel

## 🚀 Getting Started
Run the development server:
```bash
npm run dev
# or
yarn dev
```
Visit [http://localhost:3000](http://localhost:3000) to view the app.

## 📦 Features
- Secure login with email/password and social OAuth (Google, GitHub)
- Realtime analytics: followers, likes, shares, engagement trends
- Multi-platform support: Instagram, Twitter, Facebook, TikTok (OAuth-ready)
- Fully responsive UI with pages for:
  - Dashboard
  - Analytics
  - Reports
  - Content Hub
  - Audience Insights
  - Settings
  - User Profile
  - About Page
- AI-powered content suggestions (OpenAI)
- Editable profile with secure password change flow

## 📁 Project Structure
- `app/` - Next.js App Router pages
- `components/` - Reusable layout/UI components
- `lib/` - Database connect, API helpers
- `models/` - Mongoose schema definitions
- `public/` - Assets and images

## 🧬 Database Schema
Includes collections for:
- Users
- Posts
- Reports
- Notifications
- SocialAccounts

With proper validation, relationships, and indexing for:
- Time-series metrics
- OAuth token handling
- Platform/user-specific lookups

## 🧪 Testing + Mock Data
- Uses mock JSON files and sample API endpoints (e.g. `/api/analytics/[platform]`) for UI development
- Pages like Dashboard, Analytics, and Content support real-time data once integrated

## 🛡️ Authentication
- Credential login with bcrypt password validation
- OAuth login with Google/GitHub
- Protected routes using NextAuth middleware
- User sessions and secure profile management

## 📄 Deployment
Deployed via [Vercel](https://vercel.com). Ready for CI/CD and scalable production deployment.

## 📚 Resources
- [Next.js Docs](https://nextjs.org/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [MongoDB Docs](https://www.mongodb.com/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [OpenAI API](https://platform.openai.com/docs)

---

## 🔍 Development Summary (Frontend)
The application includes all core user-facing views with consistent design and navigation. Pages include:
- **Dashboard** with dynamic stat cards and platform selector
- **Analytics** for trend exploration and engagement graphs
- **Reports** with generation UI and filter-ready logic
- **Content Hub** with post status tabs and management
- **Audience Insights** with demographic stat cards
- **Profile** with editable name/password form
- **Settings** for account linking and preferences

✅ **Auth Flow:** Functional login/signup, password reset scaffolded, session integration with NextAuth and OAuth.
✅ **API Ready:** Client fetch logic set for all key data pages (currently uses mock data).
✅ **Design System:** Sidebar nav, header, buttons, and charts follow consistent component styling.

---

## 📌 Next Steps
- Backend API development (fetching real social metrics via stored tokens)
- Dynamic data integration replacing mocks
- Advanced filtering and post creation flows
- Session-aware dynamic platform selectors and disconnect logic

EchoPulse is built to be a scalable, smart dashboard for creators, marketers, and teams managing multi-platform accounts — all from one place. ✨
