
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

##Seeding - Run this script in supabase Console 
```-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clear existing data (if needed)
-- CAUTION: This will delete all existing data
-- Comment out if you want to preserve existing data
TRUNCATE TABLE user_badges CASCADE;
TRUNCATE TABLE badges CASCADE;
TRUNCATE TABLE comments CASCADE;
TRUNCATE TABLE posts CASCADE;
TRUNCATE TABLE event_participants CASCADE;
TRUNCATE TABLE events CASCADE;
TRUNCATE TABLE community_members CASCADE;
TRUNCATE TABLE communities CASCADE;
TRUNCATE TABLE profiles CASCADE;
-- Note: We don't truncate auth.users here as it's managed by Supabase Auth

-- Seed Users (this assumes you've already created users via Supabase Auth)
-- We'll create profiles for these users
DO $$
DECLARE
    user_id1 UUID := '5f8cfd66-89a8-4d22-a2a3-b79d460fd300'; -- Replace with actual user IDs
    user_id2 UUID := '6a9bcf77-90b9-5c33-b3b4-c80d571fe411'; -- from your auth.users table
    user_id3 UUID := '7b0cde88-01c0-6d44-c4c5-d91e682gf522'; -- or use uuid_generate_v4() for random IDs
    user_id4 UUID := '8c1def99-12d1-7e55-d5d6-e02f793hg633';
    user_id5 UUID := '9d2efg00-23e2-8f66-e6e7-f13g804ih744';
BEGIN
    -- Create profiles for users
    INSERT INTO profiles (id, username, full_name, avatar_url, bio, reputation_points, onboarding_completed, role)
    VALUES
        (user_id1, 'ecohero', 'Alex Green', '/placeholder.svg?height=200&width=200&query=person', 'Passionate about conservation and sustainable living.', 150, true, 'admin'),
        (user_id2, 'earthguardian', 'Sam Rivers', '/placeholder.svg?height=200&width=200&query=person', 'Working to protect our planet one step at a time.', 120, true, 'user'),
        (user_id3, 'greenactivist', 'Jordan Woods', '/placeholder.svg?height=200&width=200&query=person', 'Environmental activist and community organizer.', 200, true, 'user'),
        (user_id4, 'sustainableliving', 'Taylor Fields', '/placeholder.svg?height=200&width=200&query=person', 'Advocate for sustainable living and zero waste.', 180, true, 'user'),
        (user_id5, 'oceanprotector', 'Morgan Waves', '/placeholder.svg?height=200&width=200&query=person', 'Dedicated to ocean conservation and marine life protection.', 160, true, 'user');
END $$;

-- Seed Communities
DO $$
DECLARE
    user_ids UUID[] := ARRAY(SELECT id FROM profiles LIMIT 5);
    user_id UUID;
    community_id UUID;
    post_id UUID;
    comment_id UUID;
    i INT;
    j INT;
    k INT;
    community_categories TEXT[] := ARRAY['Environment', 'Climate Action', 'Sustainability', 'Conservation', 'Renewable Energy', 'Zero Waste', 'Eco-Friendly Living', 'Wildlife Protection', 'Ocean Conservation', 'Urban Gardening'];
    community_names TEXT[] := ARRAY['Green Earth Alliance', 'Climate Guardians', 'Sustainable Future Collective', 'Nature Defenders', 'Clean Energy Advocates', 'Zero Waste Warriors', 'Eco Living Network', 'Wildlife Protectors', 'Ocean Cleanup Crew', 'Urban Garden Community'];
    community_descriptions TEXT[] := ARRAY[
        'A community dedicated to protecting our planet through collective action and awareness.',
        'Join us in the fight against climate change through education, advocacy, and direct action.',
        'Building a sustainable future through innovative practices and community engagement.',
        'Protecting natural habitats and biodiversity through conservation efforts and education.',
        'Advocating for clean, renewable energy solutions to combat climate change.',
        'Working towards a zero waste lifestyle and promoting circular economy principles.',
        'Sharing tips and resources for eco-friendly living and sustainable consumption.',
        'Dedicated to the protection and conservation of wildlife and their habitats.',
        'Focused on cleaning and protecting our oceans from pollution and exploitation.',
        'Creating green spaces in urban environments through community gardening initiatives.'
    ];
    post_titles TEXT[] := ARRAY[
        'Join our weekend cleanup event!',
        'New study on climate impact released',
        'Tips for reducing your carbon footprint',
        'Local conservation success story',
        'Solar panel installation workshop',
        'Zero waste shopping guide',
        'DIY eco-friendly cleaning products',
        'Wildlife photography contest',
        'Beach cleanup results - we collected 500 lbs of trash!',
        'Community garden harvest celebration'
    ];
    post_contents TEXT[] := ARRAY[
        'We''re organizing a cleanup event this weekend at the local park. Bring gloves and join us!',
        'A new study shows that our collective efforts are making a difference. Check out the details!',
        'Here are 10 simple ways you can reduce your carbon footprint today.',
        'Our local conservation project has successfully protected the endangered species in our area.',
        'Learn how to install solar panels at our upcoming workshop. Registration is now open!',
        'Check out our comprehensive guide to zero waste shopping in the local area.',
        'Save money and reduce waste with these simple DIY eco-friendly cleaning product recipes.',
        'Show off your wildlife photography skills and win prizes in our upcoming contest.',
        'Thanks to all volunteers who participated in our beach cleanup. We collected 500 lbs of trash!',
        'Join us for our community garden harvest celebration. Bring a dish to share!'
    ];
    comment_contents TEXT[] := ARRAY[
        'Great initiative! I''ll be there.',
        'Thanks for sharing this important information.',
        'I''ve been using these tips and they really work!',
        'So proud of our community for this achievement.',
        'I attended last year''s workshop and it was very informative.',
        'This guide is so helpful! I''ve already started implementing these practices.',
        'I made the all-purpose cleaner and it works great!',
        'Looking forward to participating in the contest.',
        'Proud to have been part of this cleanup effort.',
        'Can''t wait for the celebration! I''ll bring my famous vegan dish.'
    ];
BEGIN
    -- Only proceed if we have users
    IF array_length(user_ids, 1) > 0 THEN
        -- Create communities
        FOR i IN 1..10 LOOP
            -- Select a random user as creator
            user_id := user_ids[1 + (i % array_length(user_ids, 1))];
            
            -- Insert community
            INSERT INTO communities (
                name, 
                description, 
                creator_id, 
                category, 
                image_url, 
                is_private, 
                member_count
            ) VALUES (
                community_names[i],
                community_descriptions[i],
                user_id,
                community_categories[i],
                '/placeholder.svg?height=200&width=200&query=' || community_names[i],
                FALSE,
                (random() * 50 + 5)::INT
            ) RETURNING id INTO community_id;
            
            -- Add creator as admin member
            INSERT INTO community_members (
                community_id,
                user_id,
                role
            ) VALUES (
                community_id,
                user_id,
                'admin'
            );
            
            -- Add some random members
            FOR j IN 1..5 LOOP
                -- Skip if it's the creator
                IF user_ids[1 + (j % array_length(user_ids, 1))] <> user_id THEN
                    INSERT INTO community_members (
                        community_id,
                        user_id,
                        role
                    ) VALUES (
                        community_id,
                        user_ids[1 + (j % array_length(user_ids, 1))],
                        'member'
                    ) ON CONFLICT (community_id, user_id) DO NOTHING;
                END IF;
            END LOOP;
            
            -- Create posts for this community
            FOR j IN 1..3 LOOP
                -- Select a random user as post creator
                user_id := user_ids[1 + ((i+j) % array_length(user_ids, 1))];
                
                -- Insert post
                INSERT INTO posts (
                    user_id,
                    title,
                    content,
                    community_id,
                    tags
                ) VALUES (
                    user_id,
                    post_titles[1 + ((i+j) % array_length(post_titles, 1))],
                    post_contents[1 + ((i+j) % array_length(post_contents, 1))],
                    community_id,
                    ARRAY['environment', 'community']
                ) RETURNING id INTO post_id;
                
                -- Add comments to the post
                FOR k IN 1..2 LOOP
                    -- Select a random user as commenter
                    user_id := user_ids[1 + ((i+j+k) % array_length(user_ids, 1))];
                    
                    -- Insert comment
                    INSERT INTO post_comments (
                        post_id,
                        user_id,
                        content
                    ) VALUES (
                        post_id,
                        user_id,
                        comment_contents[1 + ((i+j+k) % array_length(comment_contents, 1))]
                    );
                END LOOP;
            END LOOP;
        END LOOP;
    END IF;
END $$;

-- Seed Events
INSERT INTO events (
  id,
  title,
  description,
  location,
  is_virtual,
  start_time,
  end_time,
  max_attendees,
  category,
  tags,
  image_url,
  creator_id,
  attendee_count
)
VALUES
  (
    '9cd7d876-1972-4b1a-93c5-534d6d1a717b',
    'Beach Cleanup Day',
    'Join us for a day of cleaning up the local beach. Bring gloves and water!',
    'Sunset Beach, Main Entrance',
    false,
    (CURRENT_DATE + INTERVAL '7 days')::timestamp + '10:00:00'::time,
    (CURRENT_DATE + INTERVAL '7 days')::timestamp + '14:00:00'::time,
    50,
    'Cleanup',
    ARRAY['beach', 'ocean', 'plastic', 'volunteer'],
    'https://images.unsplash.com/photo-1618477461853-cf6ed80faba5?auto=format&fit=crop&q=80&w=1000',
    (SELECT id FROM profiles LIMIT 1),
    0
  ),
  (
    'a7c53eb1-79c2-4a0a-8f5e-21d67bc6eb94',
    'Tree Planting Initiative',
    'Help us restore the local forest by planting native trees. Tools and saplings provided!',
    'Green Valley Park',
    false,
    (CURRENT_DATE + INTERVAL '14 days')::timestamp + '09:00:00'::time,
    (CURRENT_DATE + INTERVAL '14 days')::timestamp + '15:00:00'::time,
    30,
    'Conservation',
    ARRAY['trees', 'forest', 'planting', 'nature'],
    'https://images.unsplash.com/photo-1513028894927-8ea2341d8b68?auto=format&fit=crop&q=80&w=1000',
    (SELECT id FROM profiles OFFSET 1 LIMIT 1),
    0
  ),
  (
    'b9e8d5f2-3a7c-4e1d-9f6b-8c2e4a5d6b7c',
    'Sustainable Living Workshop',
    'Learn practical tips for reducing your environmental footprint at home.',
    'Community Center, Room 203',
    false,
    (CURRENT_DATE + INTERVAL '21 days')::timestamp + '18:00:00'::time,
    (CURRENT_DATE + INTERVAL '21 days')::timestamp + '20:00:00'::time,
    25,
    'Education',
    ARRAY['sustainability', 'workshop', 'eco-friendly', 'lifestyle'],
    'https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&q=80&w=1000',
    (SELECT id FROM profiles OFFSET 2 LIMIT 1),
    0
  ),
  (
    'c1d2e3f4-5a6b-7c8d-9e0f-1a2b3c4d5e6f',
    'Virtual Climate Action Meeting',
    'Join our online discussion about local climate initiatives and how you can get involved.',
    NULL,
    true,
    (CURRENT_DATE + INTERVAL '5 days')::timestamp + '19:00:00'::time,
    (CURRENT_DATE + INTERVAL '5 days')::timestamp + '20:30:00'::time,
    100,
    'Advocacy',
    ARRAY['climate', 'action', 'virtual', 'community'],
    'https://images.unsplash.com/photo-1516937941344-00b4e0337589?auto=format&fit=crop&q=80&w=1000',
    (SELECT id FROM profiles OFFSET 3 LIMIT 1),
    0
  ),
  (
    'd4e5f6g7-8h9i-0j1k-2l3m-4n5o6p7q8r9s',
    'Farmers Market Volunteer Day',
    'Help support local sustainable farmers by volunteering at the weekly farmers market.',
    'Downtown Square',
    false,
    (CURRENT_DATE + INTERVAL '3 days')::timestamp + '08:00:00'::time,
    (CURRENT_DATE + INTERVAL '3 days')::timestamp + '13:00:00'::time,
    15,
    'Volunteer',
    ARRAY['food', 'local', 'sustainable', 'community'],
    'https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&q=80&w=1000',
    (SELECT id FROM profiles OFFSET 4 LIMIT 1),
    0
  );

-- Add some participants to events
DO $$
DECLARE
    user_ids UUID[] := ARRAY(SELECT id FROM profiles LIMIT 5);
    event_ids UUID[] := ARRAY(SELECT id FROM events LIMIT 5);
    i INT;
    j INT;
BEGIN
    FOR i IN 1..array_length(event_ids, 1) LOOP
        FOR j IN 1..3 LOOP
            -- Add random users as participants to each event
            -- Skip if user is the creator
            IF (SELECT creator_id FROM events WHERE id = event_ids[i]) <> user_ids[j] THEN
                INSERT INTO event_participants (
                    event_id,
                    user_id,
                    status
                ) VALUES (
                    event_ids[i],
                    user_ids[j],
                    'confirmed'
                ) ON CONFLICT DO NOTHING;
                
                -- Update attendee count
                UPDATE events
                SET attendee_count = attendee_count + 1
                WHERE id = event_ids[i];
                
                -- Add impact history
                INSERT INTO impact_history (
                    user_id,
                    event_id,
                    activity_type,
                    points_earned,
                    description,
                    verified
                ) VALUES (
                    user_ids[j],
                    event_ids[i],
                    'Event Participation',
                    50,
                    'Joined an environmental event',
                    true
                );
                
                -- Update reputation points
                UPDATE profiles
                SET reputation_points = reputation_points + 50
                WHERE id = user_ids[j];
            END IF;
        END LOOP;
    END LOOP;
END $$;

-- Seed Badges
INSERT INTO badges (
    id,
    name,
    description,
    image_url,
    criteria
) VALUES
    (
        uuid_generate_v4(),
        'Eco Warrior',
        'Awarded for participating in 5 or more environmental events',
        '/placeholder.svg?height=200&width=200&query=eco+warrior+badge',
        '{"events_participated": 5}'
    ),
    (
        uuid_generate_v4(),
        'Community Builder',
        'Awarded for creating an active community with 10+ members',
        '/placeholder.svg?height=200&width=200&query=community+builder+badge',
        '{"community_members": 10}'
    ),
    (
        uuid_generate_v4(),
        'Cleanup Champion',
        'Awarded for participating in 3 or more cleanup events',
        '/placeholder.svg?height=200&width=200&query=cleanup+champion+badge',
        '{"cleanup_events": 3}'
    ),
    (
        uuid_generate_v4(),
        'Knowledge Sharer',
        'Awarded for creating 10 or more educational posts',
        '/placeholder.svg?height=200&width=200&query=knowledge+sharer+badge',
        '{"educational_posts": 10}'
    ),
    (
        uuid_generate_v4(),
        'Green Thumb',
        'Awarded for participating in 3 or more planting events',
        '/placeholder.svg?height=200&width=200&query=green+thumb+badge',
        '{"planting_events": 3}'
    );

-- Award some badges to users
DO $$
DECLARE
    user_ids UUID[] := ARRAY(SELECT id FROM profiles LIMIT 5);
    badge_ids UUID[] := ARRAY(SELECT id FROM badges LIMIT 5);
    i INT;
BEGIN
    FOR i IN 1..array_length(user_ids, 1) LOOP
        -- Award each user a badge
        INSERT INTO user_badges (
            user_id,
            badge_id,
            awarded_at
        ) VALUES (
            user_ids[i],
            badge_ids[i],
            NOW() - (random() * INTERVAL '30 days')
        );
    END LOOP;
END $$;

-- Create some impact history entries
DO $$
DECLARE
    user_ids UUID[] := ARRAY(SELECT id FROM profiles LIMIT 5);
    activity_types TEXT[] := ARRAY['Tree Planting', 'Beach Cleanup', 'Recycling Drive', 'Community Garden', 'Educational Workshop'];
    descriptions TEXT[] := ARRAY[
        'Planted 5 trees in the local park',
        'Collected 10 lbs of trash from the beach',
        'Collected and sorted 50 lbs of recyclables',
        'Helped maintain the community garden for 3 hours',
        'Led a workshop on sustainable living practices'
    ];
    i INT;
    j INT;
BEGIN
    FOR i IN 1..array_length(user_ids, 1) LOOP
        FOR j IN 1..3 LOOP
            -- Create impact history entries for each user
            INSERT INTO impact_history (
                user_id,
                activity_type,
                points_earned,
                description,
                verified,
                created_at
            ) VALUES (
                user_ids[i],
                activity_types[1 + ((i+j) % array_length(activity_types, 1))],
                (random() * 50 + 10)::INT,
                descriptions[1 + ((i+j) % array_length(descriptions, 1))],
                TRUE,
                NOW() - (random() * INTERVAL '60 days')
            );
            
            -- Update reputation points
            UPDATE profiles
            SET reputation_points = reputation_points + 25
            WHERE id = user_ids[i];
        END LOOP;
    END LOOP;
END $$;```
---

## 📄 License

This project is licensed under the [MIT License](LICENSE) © 2025 Krish Shroff and the Environmentalist Group.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)

