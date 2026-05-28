# Teamify AI - System Architecture

## Overview

Teamify AI is a production-grade AI-powered SaaS platform designed for TikTok affiliate marketers. The application follows a modern, scalable architecture with clear separation of concerns.

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  (Nuxt 4 + Vue 3 + TypeScript + TailwindCSS)               │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    Presentation Layer                        │
│  • Pages (File-based routing)                               │
│  • Components (Reusable UI)                                 │
│  • Layouts (App structure)                                  │
│  • Composables (Business logic)                             │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                    State Management                          │
│  • Pinia Stores (Global state)                              │
│  • Auth Store (User authentication)                         │
│  • Content Store (AI content)                               │
│  • Subscription Store (Billing)                             │
└─────────────────┬───────────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────────┐
│                      API Layer                               │
│  • Nitro Server API Routes                                  │
│  • Authentication handlers                                   │
│  • AI generation endpoints                                   │
│  • Webhook handlers                                         │
└──────────┬──────────────────────┬──────────────────────────┘
           │                      │
           ▼                      ▼
┌──────────────────┐    ┌──────────────────────┐
│  Firebase        │    │  OpenAI API          │
│  • Firestore     │    │  • GPT-4             │
│  • Auth          │    │  • Content Gen       │
│  • Storage       │    │  • Viral Scoring     │
│  • Functions     │    └──────────────────────┘
└──────────────────┘
```

## Technology Stack

### Frontend
- **Framework**: Nuxt 4 (Universal Vue 3 app)
- **Language**: TypeScript (Strict mode)
- **Styling**: TailwindCSS + Custom utilities
- **State Management**: Pinia
- **UI Components**: Nuxt UI + Custom components
- **Icons**: Lucide Vue
- **Utilities**: VueUse, Day.js, Zod

### Backend
- **Server**: Nitro (Nuxt server engine)
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth
- **Storage**: Firebase Storage
- **Functions**: Firebase Cloud Functions

### External Services
- **AI**: OpenAI GPT-4 API
- **Payments**: Stripe (optional)
- **Email**: SendGrid (optional)
- **Analytics**: Google Analytics

## Project Structure

```
teamify-ai/
├── app/                          # Application source code
│   ├── components/               # Vue components
│   │   ├── ui/                  # Base UI components
│   │   │   ├── Button.vue
│   │   │   ├── Card.vue
│   │   │   ├── Input.vue
│   │   │   ├── Modal.vue
│   │   │   └── Badge.vue
│   │   ├── dashboard/           # Dashboard components
│   │   │   ├── StatCard.vue
│   │   │   ├── Chart.vue
│   │   │   └── QuickActions.vue
│   │   ├── content/             # Content generation
│   │   │   ├── AIGenerator.vue
│   │   │   ├── ContentEditor.vue
│   │   │   └── ViralScoreCard.vue
│   │   ├── affiliate/           # Affiliate features
│   │   │   ├── LinkGenerator.vue
│   │   │   ├── StatsOverview.vue
│   │   │   └── CommissionTracker.vue
│   │   ├── landing/             # Landing page builder
│   │   │   ├── PageEditor.vue
│   │   │   ├── TemplateSelector.vue
│   │   │   └── PublishModal.vue
│   │   └── shared/              # Shared components
│   │       ├── Navbar.vue
│   │       ├── Sidebar.vue
│   │       └── Footer.vue
│   │
│   ├── composables/             # Vue composables
│   │   ├── useAuth.ts          # Authentication logic
│   │   ├── useAI.ts            # AI generation logic
│   │   ├── useNotifications.ts # Real-time notifications
│   │   ├── useSubscription.ts  # Subscription management
│   │   └── useAnalytics.ts     # Analytics tracking
│   │
│   ├── layouts/                 # Layout components
│   │   ├── default.vue         # Main app layout
│   │   ├── auth.vue            # Authentication layout
│   │   └── landing.vue         # Landing page layout
│   │
│   ├── middleware/              # Route middleware
│   │   ├── auth.ts             # Authentication guard
│   │   ├── subscription.ts     # Subscription check
│   │   └── admin.ts            # Admin access control
│   │
│   ├── pages/                   # File-based routes
│   │   ├── index.vue           # Landing page
│   │   ├── auth/
│   │   │   ├── login.vue
│   │   │   ├── register.vue
│   │   │   └── reset-password.vue
│   │   ├── dashboard/
│   │   │   └── index.vue
│   │   ├── ai-content/
│   │   │   └── index.vue
│   │   ├── affiliate/
│   │   │   └── index.vue
│   │   ├── landing-builder/
│   │   │   └── index.vue
│   │   ├── settings/
│   │   │   └── index.vue
│   │   └── admin/
│   │       └── index.vue
│   │
│   ├── stores/                  # Pinia stores
│   │   ├── auth.ts             # User authentication
│   │   ├── content.ts          # AI content management
│   │   ├── affiliate.ts        # Affiliate tracking
│   │   ├── subscription.ts     # Subscription state
│   │   └── notifications.ts    # Notifications state
│   │
│   ├── types/                   # TypeScript definitions
│   │   ├── index.ts
│   │   ├── user.ts
│   │   ├── content.ts
│   │   ├── affiliate.ts
│   │   └── subscription.ts
│   │
│   ├── utils/                   # Utility functions
│   │   ├── format.ts           # Formatting helpers
│   │   ├── validation.ts       # Input validation
│   │   ├── analytics.ts        # Analytics helpers
│   │   └── seo.ts              # SEO utilities
│   │
│   └── app.vue                  # Root component
│
├── server/                       # Server-side code
│   ├── api/                     # API routes
│   │   ├── ai/
│   │   │   ├── generate-content.post.ts
│   │   │   ├── generate-hook.post.ts
│   │   │   └── viral-score.post.ts
│   │   ├── auth/
│   │   │   ├── register.post.ts
│   │   │   └── verify.post.ts
│   │   ├── affiliate/
│   │   │   ├── create-link.post.ts
│   │   │   └── track-click.post.ts
│   │   ├── landing/
│   │   │   ├── create.post.ts
│   │   │   └── publish.post.ts
│   │   ├── subscription/
│   │   │   ├── create.post.ts
│   │   │   └── webhook.post.ts
│   │   └── notifications/
│   │       └── send.post.ts
│   │
│   ├── services/                # Business logic
│   │   ├── ai.service.ts       # OpenAI integration
│   │   ├── auth.service.ts     # Authentication service
│   │   ├── affiliate.service.ts # Affiliate logic
│   │   ├── payment.service.ts  # Payment processing
│   │   └── email.service.ts    # Email service
│   │
│   ├── middleware/              # Server middleware
│   │   ├── auth.ts             # JWT verification
│   │   ├── rate-limit.ts       # Rate limiting
│   │   └── cors.ts             # CORS configuration
│   │
│   └── utils/                   # Server utilities
│       ├── firebase-admin.ts   # Firebase Admin SDK
│       ├── validation.ts       # Schema validation
│       └── error-handler.ts    # Error handling
│
├── firebase/                     # Firebase configuration
│   ├── index.ts                 # Firebase initialization
│   ├── collections.ts           # Collection references
│   ├── security-rules.ts        # Security rules
│   └── indexes.json             # Firestore indexes
│
├── prompts/                      # AI prompts
│   ├── system.ts                # System prompts
│   ├── content.ts               # Content prompts
│   └── hooks.ts                 # Hook generation prompts
│
├── assets/                       # Static assets
│   ├── css/
│   │   └── main.css             # Global styles
│   └── images/
│
├── public/                       # Public files
│   ├── favicon.ico
│   └── robots.txt
│
├── docs/                         # Documentation
│   ├── API.md
│   ├── DEPLOYMENT.md
│   └── CONTRIBUTING.md
│
├── scripts/                      # Utility scripts
│   ├── setup-firebase.sh
│   └── generate-types.ts
│
├── tests/                        # Test files
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── .github/                      # GitHub configuration
│   └── workflows/
│       └── deploy.yml
│
├── nuxt.config.ts               # Nuxt configuration
├── tailwind.config.ts           # Tailwind configuration
├── tsconfig.json                # TypeScript configuration
├── package.json                 # Dependencies
├── .env.example                 # Environment template
├── .gitignore
├── firebase.json                # Firebase configuration
└── README.md
```

## Data Architecture

### Firebase Firestore Collections

```typescript
// Collection: users
users/{userId}
  - email: string
  - displayName: string
  - photoURL: string
  - plan: 'free' | 'pro' | 'enterprise'
  - credits: number
  - createdAt: timestamp
  - updatedAt: timestamp
  - subscription: {
      status: string
      planId: string
      currentPeriodEnd: timestamp
    }
  - stats: {
      totalContent: number
      totalHooks: number
      totalLandingPages: number
    }

// Collection: generated_content
generated_content/{contentId}
  - userId: string
  - type: 'caption' | 'hook' | 'script' | 'post'
  - platform: 'tiktok' | 'instagram' | 'youtube'
  - content: string
  - viralScore: number
  - prompt: string
  - metadata: object
  - createdAt: timestamp

// Collection: affiliate_links
affiliate_links/{linkId}
  - userId: string
  - code: string
  - url: string
  - clicks: number
  - conversions: number
  - revenue: number
  - createdAt: timestamp

// Collection: landing_pages
landing_pages/{pageId}
  - userId: string
  - title: string
  - slug: string
  - template: string
  - content: object
  - published: boolean
  - views: number
  - conversions: number
  - createdAt: timestamp

// Collection: notifications
notifications/{notificationId}
  - userId: string
  - type: string
  - title: string
  - message: string
  - read: boolean
  - createdAt: timestamp

// Collection: subscriptions
subscriptions/{subscriptionId}
  - userId: string
  - stripeCustomerId: string
  - stripeSubscriptionId: string
  - status: string
  - plan: string
  - currentPeriodEnd: timestamp
```

## Core Features Architecture

### 1. Authentication Flow
```
User → Login Page → Firebase Auth → Store User → Redirect to Dashboard
                                   ↓
                              Firestore (Create User Doc)
```

### 2. AI Content Generation Flow
```
User Input → Validation → API Route → OpenAI Service → Process Response
                                                     ↓
                                        Calculate Viral Score
                                                     ↓
                                        Save to Firestore → Return to Client
```

### 3. Affiliate Tracking Flow
```
Generate Link → Store in Firestore → User Clicks → Track Event
                                                  ↓
                                    Update Analytics → Calculate Commission
```

### 4. Real-time Notifications Flow
```
Event Triggered → Create Notification Doc → Firestore Listener
                                           ↓
                                    Update UI in Real-time
```

### 5. Subscription Management Flow
```
Select Plan → Stripe Checkout → Webhook → Update Firestore → Update UI
```

## Security Architecture

### Authentication
- Firebase Authentication (Email/Password, Google OAuth)
- JWT tokens for API authentication
- HTTP-only cookies for session management
- CSRF protection

### Authorization
- Role-based access control (RBAC)
- Firestore Security Rules
- API route middleware for permission checks
- Rate limiting per user/IP

### Data Security
- All data encrypted in transit (HTTPS)
- Firestore Security Rules for data access
- Environment variables for secrets
- API key rotation policy

### Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Content is private to creator
    match /generated_content/{contentId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    // Affiliate links are private
    match /affiliate_links/{linkId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## API Architecture

### RESTful API Design

```
POST   /api/ai/generate-content      Generate AI content
POST   /api/ai/generate-hook         Generate viral hooks
POST   /api/ai/viral-score           Calculate viral score

POST   /api/auth/register            User registration
POST   /api/auth/login               User login
POST   /api/auth/logout              User logout

GET    /api/affiliate/links          Get user's links
POST   /api/affiliate/create-link    Create affiliate link
POST   /api/affiliate/track-click    Track link click

GET    /api/landing/pages            Get landing pages
POST   /api/landing/create           Create landing page
PUT    /api/landing/:id              Update landing page
DELETE /api/landing/:id              Delete landing page

POST   /api/subscription/create      Create subscription
POST   /api/subscription/webhook     Stripe webhook
GET    /api/subscription/status      Get subscription status

GET    /api/notifications/list       Get notifications
POST   /api/notifications/mark-read  Mark as read
```

## Performance Optimization

### Frontend
- Code splitting and lazy loading
- Image optimization (WebP, lazy loading)
- Asset compression (Gzip/Brotli)
- Browser caching strategies
- CDN for static assets

### Backend
- Firestore query optimization
- API response caching (Redis optional)
- Rate limiting to prevent abuse
- Efficient Firestore indexes
- Batch operations where possible

### AI Generation
- Request debouncing
- Response streaming for long content
- Caching common prompts
- Rate limiting per user plan

## Scalability Considerations

### Horizontal Scaling
- Stateless API design
- Firebase auto-scaling
- CDN for global distribution
- Load balancing via hosting platform

### Database Optimization
- Composite indexes for complex queries
- Denormalization where appropriate
- Pagination for large datasets
- Real-time listeners only where needed

### Cost Optimization
- Efficient Firestore queries
- OpenAI API usage monitoring
- Automatic credit system
- Plan-based rate limiting

## Monitoring & Analytics

### Application Monitoring
- Error tracking (Sentry)
- Performance monitoring (Firebase Performance)
- User analytics (Google Analytics)
- API usage tracking

### Business Metrics
- User signups
- Content generation count
- Affiliate conversions
- Revenue tracking
- Churn rate

## Deployment Architecture

### Development
```
Local Dev → Git Push → GitHub → Vercel Preview
```

### Staging
```
Dev Branch → GitHub Actions → Run Tests → Deploy to Staging
```

### Production
```
Main Branch → GitHub Actions → Run Tests → Deploy to Vercel Production
                                        ↓
                            Update Firebase Config
```

## Error Handling Strategy

### Client-Side
- User-friendly error messages
- Retry logic for failed requests
- Offline mode support
- Loading states

### Server-Side
- Comprehensive error logging
- Graceful degradation
- Transaction rollbacks
- Alert system for critical errors

## Testing Strategy

### Unit Tests
- Component testing (Vitest)
- Composable testing
- Utility function testing
- Store testing

### Integration Tests
- API endpoint testing
- Firebase integration testing
- Authentication flow testing

### E2E Tests
- User journey testing (Playwright)
- Critical path testing
- Cross-browser testing

## Documentation Standards

- Code comments for complex logic
- JSDoc for functions
- README for each major feature
- API documentation (OpenAPI)
- Deployment guides

## Development Workflow

1. **Feature Branch**: Create from `main`
2. **Development**: Code + Tests
3. **Code Review**: Pull Request
4. **CI/CD**: Automated tests + build
5. **Staging Deploy**: Preview environment
6. **Production Deploy**: Merge to main

## Maintenance Plan

### Regular Tasks
- Dependency updates (monthly)
- Security patches (immediate)
- Performance audits (quarterly)
- User feedback reviews (weekly)
- Backup verification (daily)

### Monitoring
- Uptime monitoring (24/7)
- Error rate tracking
- API response times
- User engagement metrics

---

**This architecture is designed to be:**
- ✅ Scalable
- ✅ Secure
- ✅ Maintainable
- ✅ Production-ready
- ✅ Cost-effective
