
# 🌍 Environmentalist App

A community-driven platform for environmentalists to connect, share ideas, organize events, and make a positive impact on our planet.

---

## 📚 Table of Contents

- [Overview](#overview)
- [Contributors](#contributors)
- [User Guide](#user-guide)
- [Technology Stack](#technology-stack)
- [Setup Guide](#setup-guide)
- [Packages and APIs](#packages-and-apis)
- [Database Schema](#database-schema)
- [Project Structure](#project-structure)
- [License](#license)

---

## 🌐 Overview

Environmentalist is a full-stack web application designed to bring together people passionate about environmental causes. Users can join communities, create and participate in events, share posts, track their environmental impact, and earn badges for their contributions.

### 🔑 Key Features

- User authentication and profiles  
- Community creation and management  
- Event organization and RSVP  
- Social posting and commenting  
- Impact tracking and badge system  
- Interactive onboarding experience  

---

## 👥 Contributors

### Team Members

- **Krish Shroff** – *Project Lead & Backend Developer*
  - Implemented Supabase integration
  - Designed database schema
  - Created server-side authentication

- **Aminuz** – *Frontend Developer*
  - Designed and implemented UI components
  - Created responsive layouts
  - Managed client-side state

- **Awias** – *Full Stack Developer*
  - Developed event management system
  - Built community features
  - Created user onboarding flow

- **Ayon** – *UX/UI Designer*
  - Designed wireframes and branding
  - Built UI mockups
  - Led user testing

---

## 🧭 User Guide

### 📲 Installation

#### Mobile App *(Coming Soon)*
1. Open the App Store or Google Play  
2. Search for “Environmentalist”  
3. Download and follow onboarding  

#### Web App
1. Visit: [https://environmentalist-app.vercel.app](https://environmentalist-app.vercel.app)  
2. Sign up or log in  
3. Complete your onboarding process  

### 📌 How to Use

#### Create Account
- Click "Sign Up" → enter details → verify email → onboard

#### Join a Community
- Go to **Community** tab → Browse → Click “Join”

#### Create or Join Events
- Go to **Events** tab → Click “Create” or browse → RSVP

#### Create a Post
- Go to any community → Tap `+` → Add content → Share

#### Track Your Impact
- Visit **Profile** → Click “Impact History”  

---

## ⚙️ Technology Stack

### 💻 Hardware Requirements

#### Mobile:
- iOS 14+ / Android 8+  
- 2GB RAM minimum  

#### Desktop:
- Any modern browser-capable device  
- 4GB RAM recommended  

### 🧰 Software Requirements

- Node.js 18.x+  
- npm 8.x+  
- Git  
- VS Code  
- PostgreSQL or Supabase  

### 🌍 Deployment

- Vercel (Frontend)  
- Supabase (Backend/Auth/DB)  

### ✅ Supported Browsers

- Chrome 90+  
- Firefox 90+  
- Safari 14+  
- Edge 90+  

---

## 🔧 Setup Guide

### Development Setup

1. **Clone the Repo**
```bash
git clone https://github.com/krishcodes1/Enviromentalist_v1_React.js
cd environmentalist-app
```

2. **Install Dependencies**
```bash
npm install
```

3. **Add Environment Variables**
Create `.env.local` in the root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

4. **Set Up Supabase**
- Create a project in Supabase  
- Run all SQL scripts in `lib/supabase/` as listed in setup docs  

5. **Start Development Server**
```bash
npm run dev
```

6. **Visit App**
- Open: [http://localhost:3000](http://localhost:3000)

### Production Deployment

1. Deploy to Vercel:
```bash
npm install -g vercel
vercel
```

2. Add same environment variables in Vercel dashboard

---

## 📦 Packages and APIs

### Frontend

- **Next.js 14.x** – SSR + Routing  
- **React 18.x** – UI Library  
- **Tailwind CSS 3.x** – Styling  
- **Framer Motion 10.x** – Animations  

### Backend

- **Supabase 2.x** – Auth + DB + Storage  
- **PostgreSQL 14.x** – Relational DB  

### Key API Endpoints

#### 🔐 Auth
- `POST /api/auth/register`  
- `POST /api/auth/login`  
- `POST /api/auth/logout`  
- `POST /api/auth/reset-password`  

#### 🏘 Communities
- `GET /api/communities`  
- `POST /api/communities`  
- `POST /api/communities/join`  

#### 📅 Events
- `GET /api/events`  
- `POST /api/events`  
- `POST /api/events/join`  

#### 📝 Posts
- `GET /api/posts`  
- `POST /api/posts`  
- `POST /api/posts/:id/comments`  

#### 👤 Profile
- `GET /api/profile`  
- `PUT /api/profile/update`  
- `POST /api/profile/avatar`  

---

## 🗃️ Database Schema

### Tables

#### users
- `id`: UUID (primary key)  
- `email`: String (unique)  
- `created_at`: Timestamp  
- `updated_at`: Timestamp  

#### profiles
- `id`: UUID (primary key, references users.id)  
- `username`: String  
- `full_name`: String  
- `avatar_url`: String  
- `bio`: Text  
- `reputation`: Integer  
- `onboarding_completed`: Boolean  
- `created_at`: Timestamp  
- `updated_at`: Timestamp  

#### communities
- `id`: UUID (primary key)  
- `name`: String  
- `description`: Text  
- `image_url`: String  
- `created_by`: UUID (references users.id)  
- `member_count`: Integer  
- `created_at`: Timestamp  
- `updated_at`: Timestamp  

#### community_members
- `id`: UUID (primary key)  
- `community_id`: UUID (references communities.id)  
- `user_id`: UUID (references users.id)  
- `role`: String (enum: 'member', 'moderator', 'admin')  
- `created_at`: Timestamp  

#### events
- `id`: UUID (primary key)  
- `title`: String  
- `description`: Text  
- `image_url`: String  
- `location`: String  
- `start_date`: Timestamp  
- `end_date`: Timestamp  
- `created_by`: UUID (references users.id)  
- `community_id`: UUID (references communities.id)  
- `max_participants`: Integer  
- `created_at`: Timestamp  
- `updated_at`: Timestamp  

#### event_participants
- `id`: UUID (primary key)  
- `event_id`: UUID (references events.id)  
- `user_id`: UUID (references users.id)  
- `status`: String (enum: 'registered', 'attended', 'cancelled')  
- `created_at`: Timestamp  

#### posts
- `id`: UUID (primary key)  
- `title`: String  
- `content`: Text  
- `image_url`: String  
- `created_by`: UUID (references users.id)  
- `community_id`: UUID (references communities.id)  
- `likes_count`: Integer  
- `comments_count`: Integer  
- `created_at`: Timestamp  
- `updated_at`: Timestamp  

#### comments
- `id`: UUID (primary key)  
- `content`: Text  
- `post_id`: UUID (references posts.id)  
- `created_by`: UUID (references users.id)  
- `parent_id`: UUID (references comments.id, for nested comments)  
- `created_at`: Timestamp  
- `updated_at`: Timestamp  

#### badges
- `id`: UUID (primary key)  
- `name`: String  
- `description`: Text  
- `image_url`: String  
- `criteria`: JSON  
- `created_at`: Timestamp  

#### user_badges
- `id`: UUID (primary key)  
- `user_id`: UUID (references users.id)  
- `badge_id`: UUID (references badges.id)  
- `awarded_at`: Timestamp  

---

## 📁 Project Structure

```plaintext
environmentalist-app/
├── app/                    # Next.js app routes
│   ├── (main)/             # Main features
│   ├── admin/              # Admin section
│   ├── auth/               # Auth pages
│   ├── post/, events/, etc
├── components/             # React components
├── lib/                    # Supabase logic & functions
├── public/                 # Static assets
├── types/                  # TypeScript types
├── .env.example
├── next.config.js
├── README.md
└── tsconfig.json
```

---

## 📄 License

This project is licensed under the [MIT License](LICENSE) © 2025 Krish Shroff and the Environmentalist Group.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

