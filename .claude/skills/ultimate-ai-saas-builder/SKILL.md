---
name: ultimate-ai-saas-builder
description: Build production-ready AI-powered SaaS applications with best practices for network marketing, affiliate systems, CRM, content generation, and gamification. Use when building AI SaaS platforms, implementing affiliate/MLM systems, creating AI content generators, setting up CRM systems, or developing SaaS with Firebase + Nuxt + OpenAI. This skill covers architecture patterns, database design, authentication, AI integration, and modern UI/UX design.
license: MIT
metadata:
  author: Teamify AI
  version: "1.0.0"
  homepage: https://github.com/teamify-ai
  tags: ["ai-saas", "nuxt", "firebase", "openai", "crm", "affiliate", "network-marketing"]
---

# Ultimate AI SaaS Builder

## Overview

This skill provides comprehensive guidance for building production-ready AI-powered SaaS applications using modern web technologies. It's specifically designed for platforms that serve network marketers, affiliate marketers, content creators, and online entrepreneurs.

## Tech Stack

### Frontend
- **Framework**: Nuxt 4 with Vue 3 and TypeScript
- **Styling**: TailwindCSS + Nuxt UI
- **State Management**: Pinia stores
- **Utilities**: VueUse composables, Day.js, Zod validation

### Backend
- **API**: Nuxt Nitro server API routes
- **Database**: Firebase Firestore (NoSQL)
- **Authentication**: Firebase Auth (Email + OAuth providers)
- **AI**: OpenAI GPT-4 for content generation

### Infrastructure
- **Hosting**: Vercel, Netlify, or Firebase Hosting
- **Environment**: Environment variables via `.env`
- **Version Control**: Git with conventional commits

## Project Structure

```
project/
├── app/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Base components (buttons, cards)
│   │   ├── dashboard/      # Dashboard-specific
│   │   ├── content/        # Content generation
│   │   ├── crm/            # CRM components
│   │   ├── affiliate/      # Affiliate system
│   │   ├── team/           # Team management
│   │   └── gamification/   # Gamification elements
│   ├── composables/        # Vue composables
│   ├── layouts/
│   │   └── default.vue     # Main layout with sidebar
│   ├── middleware/
│   │   └── auth.ts         # Route protection
│   ├── pages/              # File-based routing
│   ├── stores/             # Pinia state management
│   ├── types/              # TypeScript definitions
│   ├── utils/              # Helper functions
│   └── app.vue             # Root component
├── server/
│   ├── api/                # API endpoints
│   │   ├── ai/            # AI generation
│   │   ├── auth/          # Authentication
│   │   ├── content/       # Content management
│   │   ├── crm/           # CRM operations
│   │   ├── affiliate/     # Affiliate tracking
│   │   └── analytics/     # Analytics
│   ├── services/           # Business logic
│   └── utils/              # Server utilities
├── firebase/
│   ├── index.ts            # Firebase initialization
│   └── collections.ts      # Collection helpers
├── prompts/                # AI prompt templates
│   ├── system.ts           # System prompts
│   └── content.ts          # Content generation prompts
└── assets/css/             # Global styles
```

## Core Features to Implement

### 1. Authentication System

**Setup Firebase Auth:**
```typescript
// firebase/index.ts
import { initializeApp } from 'firebase/app'
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: process.env.NUXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NUXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NUXT_PUBLIC_FIREBASE_APP_ID
}

export const firebaseApp = initializeApp(firebaseConfig)
export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
```

**Auth Store Pattern:**
```typescript
// stores/auth.ts
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null as User | null,
    loading: false,
    error: null as string | null
  }),

  getters: {
    isAuthenticated: (state) => !!state.user,
    userProfile: (state) => state.user
  },

  actions: {
    async signUp(email: string, password: string, displayName: string) {
      // Implementation
    },

    async signIn(email: string, password: string) {
      // Implementation
    },

    async signInWithGoogle() {
      // Implementation
    },

    async signOut() {
      // Implementation
    },

    async initAuth() {
      // Firebase auth state listener
    }
  }
})
```

**Protected Routes Middleware:**
```typescript
// middleware/auth.ts
export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  const publicPages = ['/auth/login', '/auth/register']
  const authRequired = !publicPages.includes(to.path)

  if (authRequired && !authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }

  if (!authRequired && authStore.isAuthenticated) {
    return navigateTo('/dashboard')
  }
})
```

### 2. AI Content Generation

**OpenAI Service Layer:**
```typescript
// server/services/ai.service.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
})

export async function generateContent(params: {
  contentType: string
  platform: string
  niche: string
  tone: string
  targetAudience: string
  productInfo?: string
}) {
  const systemPrompt = buildSystemPrompt(params)
  const userPrompt = buildUserPrompt(params)

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt }
    ],
    temperature: 0.9,
    max_tokens: 1000
  })

  return {
    content: completion.choices[0].message.content,
    viralScore: calculateViralScore(completion.choices[0].message.content),
    usage: completion.usage
  }
}
```

**Prompt Engineering Best Practices:**
```typescript
// prompts/content.ts
export const contentPrompts = {
  tiktok_caption: `You are a viral TikTok content creator...
    - Use emotional triggers
    - Include trending hooks
    - Add call-to-action
    - Optimize for engagement`,

  instagram_post: `You are an Instagram marketing expert...
    - Craft compelling stories
    - Use power words
    - Include hashtag strategy
    - Drive conversions`,

  // More platform-specific prompts
}
```

### 3. CRM & Lead Management

**Firestore Data Model:**
```typescript
// types/index.ts
export interface Lead {
  id: string
  userId: string
  name: string
  email: string
  phone?: string
  status: 'cold' | 'warm' | 'hot' | 'converted' | 'lost'
  source: string
  notes: string
  tags: string[]
  score: number
  lastContact?: Date
  nextFollowUp?: Date
  interactions: Interaction[]
  createdAt: Date
  updatedAt: Date
}

export interface Interaction {
  id: string
  type: 'call' | 'email' | 'message' | 'meeting' | 'note'
  content: string
  timestamp: Date
  outcome?: string
}
```

**CRM Store Pattern:**
```typescript
// stores/crm.ts
export const useCrmStore = defineStore('crm', {
  state: () => ({
    leads: [] as Lead[],
    loading: false,
    filters: {
      status: 'all',
      search: ''
    }
  }),

  getters: {
    filteredLeads: (state) => {
      // Filter and sort logic
    },

    leadsByStatus: (state) => {
      // Group by status
    }
  },

  actions: {
    async fetchLeads() {
      // Firestore query
    },

    async createLead(lead: Partial<Lead>) {
      // Add to Firestore
    },

    async updateLead(id: string, updates: Partial<Lead>) {
      // Update in Firestore
    },

    async deleteLead(id: string) {
      // Delete from Firestore
    }
  }
})
```

### 4. Affiliate System

**Referral System Schema:**
```typescript
export interface AffiliateLink {
  id: string
  userId: string
  code: string
  url: string
  clicks: number
  signups: number
  conversions: number
  revenue: number
  createdAt: Date
}

export interface Commission {
  id: string
  userId: string
  affiliateId: string
  amount: number
  type: 'direct' | 'indirect' | 'override'
  level: number
  status: 'pending' | 'approved' | 'paid'
  transactionId: string
  createdAt: Date
  paidAt?: Date
}

export interface TeamMember {
  id: string
  parentId: string
  level: number
  rank: string
  totalSales: number
  teamSize: number
  joinedAt: Date
}
```

**Commission Calculation:**
```typescript
// server/utils/affiliate.ts
export function calculateCommission(
  saleAmount: number,
  level: number,
  plan: CommissionPlan
): number {
  const rate = plan.rates[level] || 0
  return saleAmount * (rate / 100)
}

export async function processAffiliateCommissions(
  userId: string,
  saleAmount: number,
  maxLevels: number = 5
) {
  const commissions: Commission[] = []
  let currentUser = await getUserById(userId)
  let level = 1

  while (currentUser.referrerId && level <= maxLevels) {
    const commission = calculateCommission(saleAmount, level, plan)
    commissions.push({
      userId: currentUser.referrerId,
      affiliateId: userId,
      amount: commission,
      level,
      type: level === 1 ? 'direct' : 'indirect'
    })

    currentUser = await getUserById(currentUser.referrerId)
    level++
  }

  return commissions
}
```

### 5. Gamification System

**XP & Badge System:**
```typescript
export interface UserStats {
  userId: string
  xp: number
  level: number
  badges: Badge[]
  streak: number
  lastActivity: Date
  achievements: Achievement[]
}

export interface Badge {
  id: string
  name: string
  description: string
  icon: string
  unlockedAt: Date
}

export const ACTIONS = {
  CREATE_CONTENT: { xp: 10, name: 'Create Content' },
  ADD_LEAD: { xp: 5, name: 'Add Lead' },
  CLOSE_SALE: { xp: 50, name: 'Close Sale' },
  DAILY_LOGIN: { xp: 2, name: 'Daily Login' },
  REFERRAL: { xp: 25, name: 'Referral' }
}

export function calculateLevel(xp: number): number {
  return Math.floor(Math.sqrt(xp / 100)) + 1
}
```

### 6. Analytics & Reporting

**Analytics Data Model:**
```typescript
export interface Analytics {
  userId: string
  date: string
  metrics: {
    revenue: number
    conversions: number
    clicks: number
    contentGenerated: number
    leadsAdded: number
    teamGrowth: number
  }
}

// Real-time dashboard metrics
export async function getDashboardMetrics(userId: string) {
  return {
    revenue: await getTotalRevenue(userId),
    commissions: await getTotalCommissions(userId),
    leads: await getLeadCount(userId),
    teamSize: await getTeamSize(userId),
    contentCreated: await getContentCount(userId),
    conversionRate: await getConversionRate(userId)
  }
}
```

## UI/UX Design Patterns

### Modern SaaS Design

**Glassmorphism Effect:**
```css
.glass-card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
}
```

**Premium Gradients:**
```css
.gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.gradient-success {
  background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);
}

.gradient-warning {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}
```

**Component Library:**
```vue
<!-- StatCard.vue -->
<template>
  <div class="glass-card p-6 hover:scale-105 transition-transform">
    <div class="flex items-center justify-between">
      <component :is="icon" class="w-8 h-8 text-primary-500" />
      <span v-if="change" class="text-sm" :class="changeColor">
        {{ change > 0 ? '+' : '' }}{{ change }}%
      </span>
    </div>
    <h3 class="text-3xl font-bold mt-4">{{ value }}</h3>
    <p class="text-gray-400 text-sm mt-1">{{ label }}</p>
  </div>
</template>
```

## Database Design

### Firestore Collections

**Users Collection:**
```typescript
users/{userId}
├── profile (document)
├── stats (document)
├── settings (document)
└── subscription (document)
```

**Teams Collection:**
```typescript
teams/{teamId}
├── members (subcollection)
├── missions (subcollection)
└── analytics (subcollection)
```

**Content Collection:**
```typescript
generated_content/{contentId}
├── type: string
├── platform: string
├── content: string
├── viralScore: number
├── userId: string
├── createdAt: timestamp
└── stats: object
```

### Firestore Security Rules

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read/write their own data
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }

    // Leads are private to the owner
    match /leads/{leadId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }

    // Content is private to the creator
    match /generated_content/{contentId} {
      allow read, write: if request.auth != null &&
        resource.data.userId == request.auth.uid;
    }
  }
}
```

## API Design Patterns

### RESTful API Structure

```typescript
// server/api/ai/generate-content.post.ts
export default defineEventHandler(async (event) => {
  try {
    // Verify authentication
    const userId = await verifyAuth(event)

    // Parse and validate request
    const body = await readBody(event)
    const validated = validateContentRequest(body)

    // Check rate limits
    await checkRateLimit(userId)

    // Generate content
    const result = await generateContent(validated)

    // Save to database
    await saveGeneratedContent({
      ...result,
      userId,
      timestamp: new Date()
    })

    // Return response
    return {
      success: true,
      data: result
    }
  } catch (error) {
    return {
      success: false,
      error: error.message
    }
  }
})
```

## Environment Configuration

### Required Environment Variables

```env
# Firebase Configuration
NUXT_PUBLIC_FIREBASE_API_KEY=
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NUXT_PUBLIC_FIREBASE_PROJECT_ID=
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NUXT_PUBLIC_FIREBASE_APP_ID=

# OpenAI Configuration
OPENAI_API_KEY=

# App Configuration
NUXT_PUBLIC_APP_URL=
NUXT_PUBLIC_APP_NAME=

# Stripe (Optional for payments)
STRIPE_SECRET_KEY=
STRIPE_PUBLISHABLE_KEY=

# Email (Optional)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
```

## Deployment Checklist

### Pre-Deployment
- [ ] Set all environment variables in hosting platform
- [ ] Configure Firebase Security Rules
- [ ] Set up Firestore indexes
- [ ] Enable Firebase Authentication providers
- [ ] Test all API endpoints
- [ ] Verify AI content generation
- [ ] Test payment integration (if applicable)
- [ ] Check mobile responsiveness
- [ ] Run security audit
- [ ] Set up error tracking (Sentry)

### Vercel Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Environment variables
vercel env add OPENAI_API_KEY
vercel env add NUXT_PUBLIC_FIREBASE_API_KEY
# ... add all other env vars
```

### Firebase Hosting
```bash
# Build the app
pnpm build

# Initialize Firebase
firebase init hosting

# Deploy
firebase deploy --only hosting
```

## Performance Optimization

### Code Splitting
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  build: {
    optimization: {
      splitChunks: {
        chunks: 'all'
      }
    }
  }
})
```

### Lazy Loading Components
```vue
<script setup>
const HeavyComponent = defineAsyncComponent(() =>
  import('~/components/HeavyComponent.vue')
)
</script>
```

### Firestore Query Optimization
```typescript
// Use compound indexes for complex queries
const q = query(
  collection(db, 'leads'),
  where('userId', '==', userId),
  where('status', '==', 'hot'),
  orderBy('score', 'desc'),
  limit(10)
)
```

## Security Best Practices

### API Security
- Always verify authentication in server routes
- Validate and sanitize all user inputs
- Implement rate limiting
- Use HTTPS only
- Never expose API keys in client code
- Implement CORS properly

### Firebase Security
```typescript
// Verify Firebase tokens in API routes
import { getAuth } from 'firebase-admin/auth'

async function verifyAuth(event) {
  const token = getHeader(event, 'authorization')?.replace('Bearer ', '')
  if (!token) throw new Error('Unauthorized')

  const decoded = await getAuth().verifyIdToken(token)
  return decoded.uid
}
```

### Data Validation
```typescript
import { z } from 'zod'

const leadSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().optional(),
  status: z.enum(['cold', 'warm', 'hot', 'converted', 'lost'])
})

// Use in API routes
const validated = leadSchema.parse(body)
```

## Testing Strategy

### Unit Tests
```typescript
// tests/utils/affiliate.test.ts
import { describe, it, expect } from 'vitest'
import { calculateCommission } from '~/server/utils/affiliate'

describe('calculateCommission', () => {
  it('should calculate correct commission', () => {
    const result = calculateCommission(1000, 1, { rates: [10, 5, 3] })
    expect(result).toBe(100)
  })
})
```

### E2E Tests
```typescript
// tests/e2e/auth.spec.ts
import { test, expect } from '@playwright/test'

test('user can sign up and login', async ({ page }) => {
  await page.goto('/auth/register')
  await page.fill('[name="email"]', 'test@example.com')
  await page.fill('[name="password"]', 'password123')
  await page.click('button[type="submit"]')
  await expect(page).toHaveURL('/dashboard')
})
```

## Common Patterns

### Composables
```typescript
// composables/useContentGenerator.ts
export function useContentGenerator() {
  const loading = ref(false)
  const error = ref<string | null>(null)

  async function generate(params: ContentParams) {
    loading.value = true
    error.value = null

    try {
      const response = await $fetch('/api/ai/generate-content', {
        method: 'POST',
        body: params
      })
      return response.data
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }

  return {
    generate,
    loading: readonly(loading),
    error: readonly(error)
  }
}
```

### Error Handling
```typescript
// Global error handler
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, context) => {
    console.error('Global error:', error)
    // Send to error tracking service
  }
})
```

## What Good Looks Like

- Clean, modular code with single responsibility
- Type-safe APIs with TypeScript
- Responsive design that works on all devices
- Fast page loads (< 2 seconds)
- Secure authentication and authorization
- Proper error handling and user feedback
- Comprehensive testing coverage
- Well-documented code and APIs
- Scalable architecture
- Professional UI/UX with modern design

## Common Pitfalls to Avoid

- **Don't** expose API keys in client-side code
- **Don't** skip input validation
- **Don't** ignore Firebase Security Rules
- **Don't** forget to handle loading states
- **Don't** make excessive Firestore reads
- **Don't** skip error handling
- **Don't** ignore mobile responsiveness
- **Don't** commit `.env` files
- **Don't** use `any` type in TypeScript
- **Don't** skip rate limiting for AI endpoints

## Troubleshooting Guide

### Firebase Connection Issues
- Verify environment variables are set correctly
- Check Firebase console for service status
- Ensure Firestore Security Rules allow your queries
- Verify authentication is working

### AI Generation Failures
- Check OpenAI API key is valid
- Verify API quota hasn't been exceeded
- Review prompt structure
- Check for rate limiting

### Build Errors
- Clear `.nuxt` directory and rebuild
- Verify all dependencies are installed
- Check for TypeScript type errors
- Review `nuxt.config.ts` for misconfigurations

### Authentication Issues
- Verify Firebase Auth providers are enabled
- Check auth middleware is properly configured
- Ensure redirect URLs are whitelisted
- Review browser console for errors

## Resources

### Official Documentation
- [Nuxt 3](https://nuxt.com/)
- [Vue 3](https://vuejs.org/)
- [Firebase](https://firebase.google.com/docs)
- [OpenAI API](https://platform.openai.com/docs)
- [TailwindCSS](https://tailwindcss.com/)

### UI/UX Inspiration
- [Dribbble - SaaS Designs](https://dribbble.com/tags/saas)
- [Behance - Dashboard Designs](https://www.behance.net/search/projects?search=dashboard)
- [Mobbin - App Designs](https://mobbin.com/)

### Learning Resources
- [Full Stack Nuxt](https://masteringnuxt.com/)
- [Firebase Mastery](https://fireship.io/)
- [OpenAI Cookbook](https://github.com/openai/openai-cookbook)

### Community
- [Nuxt Discord](https://discord.com/invite/nuxt)
- [Vue Land Discord](https://discord.com/invite/vue)
- [Firebase Community](https://firebase.community/)

## Next Steps

After implementing the core features:

1. **Add Payment Integration** (Stripe/Paddle)
2. **Implement Email Notifications** (SendGrid/Resend)
3. **Add Analytics Tracking** (Google Analytics/Mixpanel)
4. **Create Mobile Apps** (React Native/Flutter)
5. **Build Admin Dashboard**
6. **Add Multi-language Support** (i18n)
7. **Implement Real-time Chat** (Firebase Realtime Database)
8. **Add Social Media Integration**
9. **Create API Documentation** (Swagger/OpenAPI)
10. **Set up CI/CD Pipeline** (GitHub Actions)

## Agent Usage Tips

When assisting users with this skill:

1. **Start with structure** - Set up project folders and core files first
2. **Configure environment** - Ensure all env vars are set correctly
3. **Implement incrementally** - Build feature by feature, test as you go
4. **Follow patterns** - Use the code patterns shown in this guide
5. **Prioritize security** - Always implement auth and validation first
6. **Test thoroughly** - Verify each feature works before moving on
7. **Document as you go** - Add comments for complex logic
8. **Keep it DRY** - Create reusable components and utilities
9. **Think mobile-first** - Design responsive from the start
10. **Optimize for performance** - Lazy load, code split, cache wisely

## License

This skill documentation is provided under the MIT License.

---

**Built for network marketers, affiliate marketers, and online entrepreneurs who want to build powerful AI-powered SaaS platforms.**
