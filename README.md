# 🚀 Teamify AI - AI-Powered SaaS for Network Marketers

A production-grade AI SaaS platform built for affiliate marketers, network marketers, creators, and online sellers. Generate viral content, manage leads, track commissions, and grow your team with AI assistance.

## ✨ Features

### 🤖 AI Content Generator
- **Viral Content Creation**: Generate TikTok captions, Instagram posts, Facebook content, and more
- **Multiple Content Types**: Captions, hooks, scripts, CTAs, hashtags, stories
- **Platform-Specific**: Optimized for TikTok, Instagram, Facebook, LinkedIn, Twitter, YouTube
- **Viral Score**: AI-powered scoring system for content performance prediction
- **Variations**: Generate multiple versions and pick the best

### 💬 AI Closing Assistant
- **Sales Coach**: AI-powered sales chat for handling objections
- **Smart Responses**: Soft-sell techniques and follow-up suggestions
- **Lead Intelligence**: Automated lead scoring and insights
- **Conversation Context**: Maintains context across interactions

### 🎯 CRM & Lead Management
- **Lead Tracking**: Capture, organize, and track leads across platforms
- **Pipeline Management**: Visual lead status and progression
- **Notes & Interactions**: Detailed activity tracking
- **Smart Follow-ups**: AI-suggested next actions

### 💰 Affiliate System
- **Referral Links**: Generate and track affiliate links
- **Commission Tracking**: Real-time commission calculations
- **Team Tree**: Visual downline and team structure
- **Rank System**: Progress tracking and achievements
- **Leaderboards**: Team performance rankings

### 👥 Team Management
- **Team Dashboard**: Overview of team performance
- **Missions & Goals**: Set and track team objectives
- **Activity Tracking**: Monitor team member engagement
- **AI Coaching**: Automated team motivation and tips

### 🎮 Gamification
- **XP System**: Earn experience for actions
- **Badges & Achievements**: Unlock rewards for milestones
- **Daily Tasks**: Engaging daily missions
- **Ranking System**: Competitive leaderboards
- **Streaks**: Maintain activity streaks for bonuses

### 📊 Analytics Dashboard
- **Revenue Tracking**: Real-time financial metrics
- **Conversion Charts**: Visualize performance trends
- **Viral Score Analytics**: Content performance insights
- **Team Performance**: Group analytics and insights
- **AI Insights**: Automated recommendations

### 🎨 Design Features
- **Dark Mode**: Beautiful dark theme with glassmorphism
- **Gradient Elements**: Premium gradient buttons and cards
- **Animations**: Smooth, engaging animations
- **Mobile-First**: Fully responsive design
- **Modern UI**: Inspired by Notion, Canva, Linear, and Shopify

## 🛠️ Tech Stack

- **Frontend**: Nuxt 4, Vue 3, TypeScript
- **Styling**: TailwindCSS, Nuxt UI, Custom glassmorphism
- **State Management**: Pinia
- **Backend**: Nitro Server API
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth (Email, Google)
- **AI**: OpenAI GPT-4
- **Icons**: Lucide Vue
- **Utilities**: VueUse, Day.js, Zod

## 📁 Project Structure

```
teamify-ai/
├── app/
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   ├── dashboard/             # Dashboard-specific components
│   │   ├── content/               # Content generation components
│   │   ├── crm/                   # CRM components
│   │   ├── affiliate/             # Affiliate system components
│   │   ├── team/                  # Team management components
│   │   └── gamification/          # Gamification components
│   ├── composables/               # Vue composables
│   ├── layouts/
│   │   └── default.vue            # Main app layout with sidebar
│   ├── middleware/
│   │   └── auth.ts                # Authentication middleware
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── login.vue          # Login page
│   │   │   └── register.vue       # Registration page
│   │   ├── dashboard/
│   │   │   └── index.vue          # Main dashboard
│   │   ├── ai-content/
│   │   │   └── index.vue          # AI content generator
│   │   ├── ai-closing/            # AI closing assistant
│   │   ├── crm/                   # CRM & leads
│   │   ├── affiliate/             # Affiliate dashboard
│   │   ├── team/                  # Team management
│   │   ├── analytics/             # Analytics dashboard
│   │   ├── automation/            # TikTok automation
│   │   └── settings/              # Settings page
│   ├── stores/
│   │   ├── auth.ts                # Authentication store
│   │   ├── content.ts             # Content generation store
│   │   ├── team.ts                # Team management store
│   │   └── crm.ts                 # CRM store
│   ├── types/
│   │   └── index.ts               # TypeScript definitions
│   ├── utils/                     # Utility functions
│   └── app.vue                    # Root component
├── server/
│   ├── api/
│   │   ├── ai/                    # AI generation endpoints
│   │   ├── auth/                  # Authentication endpoints
│   │   ├── content/               # Content management endpoints
│   │   ├── crm/                   # CRM endpoints
│   │   ├── affiliate/             # Affiliate system endpoints
│   │   ├── analytics/             # Analytics endpoints
│   │   └── team/                  # Team management endpoints
│   ├── services/
│   │   └── ai.service.ts          # AI service layer (OpenAI)
│   └── utils/                     # Server utilities
├── firebase/
│   ├── index.ts                   # Firebase initialization
│   └── collections.ts             # Collection names and helpers
├── prompts/
│   ├── system.ts                  # System prompts for AI
│   └── content.ts                 # Content generation prompts
├── assets/
│   └── css/
│       └── main.css               # Global styles
├── public/                        # Static assets
├── nuxt.config.ts                 # Nuxt configuration
├── package.json                   # Dependencies
├── tsconfig.json                  # TypeScript config
├── .env.example                   # Environment variables template
└── README.md                      # This file
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and pnpm
- Firebase project
- OpenAI API key

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd teamify-ai
```

2. **Install dependencies**
```bash
pnpm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# Firebase Configuration
NUXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NUXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# OpenAI Configuration
OPENAI_API_KEY=sk-your_openai_api_key

# App Configuration
NUXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Set up Firebase**

- Go to [Firebase Console](https://console.firebase.google.com/)
- Create a new project or use existing
- Enable Authentication (Email/Password, Google)
- Create a Firestore database
- Copy your config to `.env`

5. **Set up OpenAI**

- Get API key from [OpenAI Platform](https://platform.openai.com/)
- Add to `.env` file

### Development

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
pnpm build
pnpm preview
```

## 🔥 Firebase Collections

The app uses the following Firestore collections:

- `users` - User profiles and stats
- `teams` - Team information
- `leads` - CRM leads and interactions
- `generated_content` - AI-generated content
- `ai_chats` - AI conversation history
- `affiliate_links` - Referral/affiliate links
- `commissions` - Commission tracking
- `landing_pages` - Custom landing pages
- `tiktok_scripts` - TikTok video scripts
- `notifications` - User notifications
- `analytics` - Analytics data
- `campaigns` - Marketing campaigns

See `firebase/collections.ts` for full list.

## 🎨 UI Components

### Core Components

- `StatCard.vue` - Animated statistics cards with glassmorphism
- `GradientButton.vue` - Premium gradient buttons with loading states
- `Layout (default.vue)` - Sidebar navigation with responsive design

### Component Usage

```vue
<StatCard
  :icon="DollarSign"
  label="Total Revenue"
  :value="formatCurrency(12450)"
  :change="12.5"
  subtitle="vs last month"
/>

<GradientButton
  variant="primary"
  :loading="loading"
  @click="handleAction"
>
  Generate Content
</GradientButton>
```

## 🤖 AI Features

### Content Generation

The AI service supports:

- **7 Content Types**: Caption, Hook, Script, Post, CTA, Hashtags, Story
- **6 Platforms**: TikTok, Instagram, Facebook, LinkedIn, Twitter, YouTube
- **Customization**: Tone, length, niche, target audience
- **Viral Scoring**: 0-100 score based on engagement factors
- **Variations**: Generate multiple versions simultaneously

### Prompt Engineering

Advanced prompt templates in `prompts/`:

- Platform-specific optimizations
- Emotional triggers
- Storytelling frameworks
- Call-to-action formulas
- Viral hook patterns

## 🔐 Authentication

### Features

- Email/Password authentication
- Google OAuth
- Protected routes with middleware
- Session management
- User profile system

### Usage

```typescript
// In any component
const authStore = useAuthStore()

// Sign in
await authStore.signIn(email, password)

// Sign up
await authStore.signUp(email, password, displayName)

// Sign out
await authStore.signOut()

// Check authentication
if (authStore.isAuthenticated) {
  // User is logged in
}
```

## 📊 State Management (Pinia)

### Stores

1. **Auth Store** (`stores/auth.ts`)
   - User authentication
   - Profile management
   - Session handling

2. **Content Store** (`stores/content.ts`)
   - AI content generation
   - Content history
   - Variations and rewrites

3. **Team Store** (`stores/team.ts`)
   - Team management
   - Member tracking
   - Team tree structure

4. **CRM Store** (`stores/crm.ts`)
   - Lead management
   - Interactions
   - Notes and follow-ups

## 🎯 Key Pages

### Dashboard
- Overview stats with animated cards
- Quick actions for common tasks
- Recent content and team performance
- Real-time metrics

### AI Content Generator
- Multi-platform content creation
- Viral score prediction
- Copy, rewrite, and save features
- Content history and analytics

### AI Closing Assistant
- Conversational AI for sales
- Objection handling
- Follow-up suggestions
- Lead context awareness

### CRM
- Lead pipeline management
- Interaction tracking
- Notes and tags
- Status updates

### Affiliate Dashboard
- Referral link generation
- Commission tracking
- Team tree visualization
- Rank progress

## 🚀 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Netlify

```bash
pnpm build
# Upload .output/public directory
```

### Firebase Hosting

```bash
pnpm build
firebase init hosting
firebase deploy
```

## 🔧 Configuration

### Nuxt Config

Key configurations in `nuxt.config.ts`:

- Modules: Nuxt UI, Pinia, VueUse, VueFire
- Firebase integration
- Dark mode default
- API routes
- TypeScript strict mode

### Tailwind Config

Custom styles in `assets/css/main.css`:

- Glassmorphism utilities
- Premium gradients
- Custom animations
- Scrollbar styling

## 📝 Environment Variables

Required variables:

```env
NUXT_PUBLIC_FIREBASE_API_KEY       # Firebase API key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN   # Firebase auth domain
NUXT_PUBLIC_FIREBASE_PROJECT_ID    # Firebase project ID
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET # Firebase storage bucket
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID # Firebase sender ID
NUXT_PUBLIC_FIREBASE_APP_ID        # Firebase app ID
OPENAI_API_KEY                     # OpenAI API key
NUXT_PUBLIC_APP_URL                # App URL
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support:
- Open an issue on GitHub
- Contact: support@teamifyai.com
- Documentation: https://docs.teamifyai.com

## 🎉 Acknowledgments

- Built with [Nuxt 4](https://nuxt.com/)
- Powered by [OpenAI GPT-4](https://openai.com/)
- UI components from [Nuxt UI](https://ui.nuxt.com/)
- Icons by [Lucide](https://lucide.dev/)

---

**Made with ❤️ for network marketers and online entrepreneurs**
