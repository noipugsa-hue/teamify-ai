# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Teamify AI is a production-grade AI SaaS platform for TikTok affiliate marketers and network marketers. It provides AI content generation, CRM, affiliate tracking, team management, and gamification features.

**Tech Stack:**
- Nuxt 4 (SSR disabled), Vue 3, TypeScript (strict mode)
- Firebase (Firestore, Auth, Storage) via VueFire
- OpenAI GPT-4 + Gemini AI (configurable via `AI_PROVIDER` env var)
- TailwindCSS 4 + Nuxt UI
- Pinia for state management

## Development Commands

```bash
# Development
pnpm dev                    # Start dev server on localhost:3000

# Build & Preview
pnpm build                  # Build for production (Vercel preset)
pnpm preview                # Preview production build
pnpm generate               # Generate static site

# Setup
pnpm install                # Install dependencies
pnpm postinstall            # Runs automatically - prepares Nuxt types
```

## Architecture & Patterns

### Client-Server Architecture

**SSR is disabled** (`ssr: false` in `nuxt.config.ts`) to fix Firebase initialization issues. This is a SPA with client-side rendering only.

**Layer Separation:**
1. **Pages** (`app/pages/`) - File-based routing, use middleware for protection
2. **Components** (`app/components/`) - Organized by feature (ui, dashboard, content, crm, affiliate, team, gamification)
3. **Composables** (`app/composables/`) - Business logic extraction
4. **Stores** (`app/stores/`) - Pinia stores for global state
5. **Server API** (`server/api/`) - Nitro API routes
6. **Services** (`server/services/`) - Backend business logic

### State Management Pattern

**Pinia stores** handle all global state:

- `auth.ts` - User authentication & profile (Firebase Auth)
- `content.ts` - AI-generated content history
- `team.ts` - Team management & hierarchy
- `crm.ts` - Lead management

**Store initialization:** Auth store must be initialized before protected routes via `initAuth()` action. The `auth.ts` middleware handles this automatically.

**Pattern:**
```typescript
// In components
const authStore = useAuthStore()
await authStore.initAuth() // Wait for Firebase auth state

// Check state
if (authStore.isAuthenticated) { /* ... */ }
```

### Firebase Integration

**Two initialization approaches coexist:**

1. **VueFire module** (`nuxt-vuefire`) - Configured in `nuxt.config.ts` with `vuefire.config`
2. **Manual Firebase SDK** (`firebase/index.ts`) - Uses `useFirebase()` composable

**Collection references:** Centralized in `firebase/collections.ts` with constants:
```typescript
import { COLLECTIONS } from '~/firebase/collections'
// Access via COLLECTIONS.USERS, COLLECTIONS.GENERATED_CONTENT, etc.
```

**Key collections:**
- `users` - User profiles with role, stats, subscription info
- `generated_content` - AI-generated content with viralScore
- `affiliate_links` - Referral tracking with clicks/conversions
- `leads` - CRM leads with status pipeline
- `teams`, `team_members` - Team hierarchy

### Authentication Flow

**Google Sign-In on mobile uses redirect:**
```typescript
// Check redirect result on app initialization
const redirectResult = await getRedirectResult(auth)
```

**Middleware pattern:**
```typescript
// In pages that require auth
definePageMeta({
  middleware: 'auth'
})
```

The `auth.ts` middleware:
1. Waits for auth initialization
2. Redirects to `/auth/login` if not authenticated
3. Optionally checks onboarding completion

### AI Generation Architecture

**Dual AI provider support:**
- OpenAI GPT-4 (default for production)
- Gemini AI (Google)

**Configuration:**
```typescript
// In nuxt.config.ts
runtimeConfig: {
  openaiApiKey: process.env.OPENAI_API_KEY,
  geminiApiKey: process.env.GEMINI_API_KEY,
  aiProvider: process.env.AI_PROVIDER || 'gemini' // 'openai' or 'gemini'
}
```

**API routes:** All AI generation endpoints are in `server/api/ai/`:
- `generate.post.ts` - Main content generation
- `hooks.post.ts` - Viral hook generation
- `rewrite.post.ts` - Content rewriting
- `generate-variations.post.ts` - Multiple variations
- `chat.post.ts` - AI chat/conversation
- `analyze-image.post.ts` - Image analysis
- `generate-image.post.ts` - Image generation

**Prompt engineering:** System prompts and templates are in `prompts/` directory.

### UI Component System

**Glassmorphism design pattern:**
```css
.glass-card {
  background: rgba(17, 24, 39, 0.6);
  backdrop-filter: blur(16px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
```

**Base components in `app/components/ui/`:**
- `GradientButton.vue` - Premium gradient buttons with loading states and icons
- `Card.vue` - Glass effect cards with header/footer slots
- `Input.vue` - Form inputs with validation, icons, error states
- `Textarea.vue` - Multi-line with character count
- `Select.vue` - Dropdowns with custom styling
- `Badge.vue` - Status badges with variants
- `Modal.vue` - Dialog modals
- `StatCard.vue` - Dashboard statistics cards

**Component API pattern:**
All components use consistent props:
- `variant` - Color scheme (primary, secondary, success, danger, warning)
- `size` - Sizing (sm, md, lg, xl)
- `loading` - Loading states
- `disabled` - Disabled states
- `icon` - Icon from lucide-vue-next

### API Route Patterns

**Nitro server routes structure:**
```
server/api/
├── ai/              # AI generation endpoints
├── affiliate/       # Affiliate tracking
├── upload/          # File uploads
└── [feature]/       # Feature-specific APIs
```

**Route naming:** Use HTTP method suffixes (`.post.ts`, `.get.ts`, `.put.ts`, `.delete.ts`)

**CORS enabled:** All `/api/**` routes have CORS enabled via `routeRules` in config.

### Type Safety

**TypeScript strict mode enabled.** Type definitions in `app/types/`:
- User types (role, profile, stats)
- Content types (platform, contentType, viralScore)
- Affiliate types (links, commissions)
- Team types (members, goals)

**Import pattern:**
```typescript
import type { User, ContentType } from '~/types'
```

### Firebase Security Rules

**Rules files:**
- `firestore.rules` - Firestore security
- `storage.rules` - Storage security

**Security pattern:**
- Owner-based access (`userId` field matching)
- Role-based checks (admin, team_leader)
- Public read for published content

**Deploy rules:**
```bash
firebase deploy --only firestore:rules
firebase deploy --only storage
```

### Environment Variables

**Required for development:**
```env
# Firebase (all NUXT_PUBLIC_* are client-side accessible)
NUXT_PUBLIC_FIREBASE_API_KEY
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NUXT_PUBLIC_FIREBASE_PROJECT_ID
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NUXT_PUBLIC_FIREBASE_APP_ID

# AI (server-side only)
OPENAI_API_KEY
GEMINI_API_KEY
AI_PROVIDER=gemini  # or 'openai'

# App
NUXT_PUBLIC_APP_URL=http://localhost:3000
```

**Access patterns:**
```typescript
// Client-side (public vars)
const config = useRuntimeConfig()
config.public.firebaseApiKey

// Server-side (all vars)
const config = useRuntimeConfig()
config.openaiApiKey  // Server-only
```

## Code Conventions

### File Organization

**Feature-based components:** Group by domain (dashboard, content, crm, affiliate) not by type.

**API routes:** Match frontend features (`server/api/ai/` for AI generation, `server/api/affiliate/` for affiliate tracking).

**Composables:** Extract reusable logic to `app/composables/`, prefix with `use` (e.g., `useAI.ts`, `useAffiliate.ts`).

### Import Aliases

```typescript
'~/' or '@/'  // Root/app directory
'#app'        // Nuxt internal
'#imports'    // Auto-imports
```

### Component Naming

- PascalCase for components: `StatCard.vue`, `GradientButton.vue`
- Descriptive names that indicate purpose

### Store Actions

Async actions should:
1. Set `loading: true` at start
2. Set `error: null` to clear previous errors
3. Use try/catch for error handling
4. Set `loading: false` in finally block

### Error Handling

**Client-side:** Use store error state or composable error handling.

**Server-side:** Return proper HTTP status codes and error messages.

## Key Workflows

### Adding a New Protected Page

1. Create page in `app/pages/[feature]/`
2. Add `definePageMeta({ middleware: 'auth' })`
3. Use auth store to check user state
4. Create feature-specific components in `app/components/[feature]/`

### Adding New AI Generation Feature

1. Add prompt template in `prompts/`
2. Create API route in `server/api/ai/[feature].post.ts`
3. Handle both OpenAI and Gemini based on `config.aiProvider`
4. Store generated content in Firestore (`generated_content` collection)
5. Update content store if needed

### Adding New Firebase Collection

1. Add constant to `firebase/collections.ts`
2. Update Firestore security rules in `firestore.rules`
3. Create TypeScript type in `app/types/`
4. Add Firestore indexes if complex queries needed

## Critical Implementation Details

**Mobile Google Sign-In:** Uses redirect flow (`signInWithRedirect`) not popup. The app checks `getRedirectResult()` on initialization in `auth.ts` store.

**SSR Disabled:** Due to Firebase client SDK initialization issues. All Firebase calls happen client-side only.

**Nitro Preset:** Configured for Vercel deployment (`nitro.preset: 'vercel'`).

**Auto-imports:** Nuxt auto-imports composables, components, and Vue APIs. No need to manually import `ref`, `computed`, `defineComponent`, etc.

**VueUse:** Available for utility composables (e.g., `useLocalStorage`, `useEventListener`).

## Documentation References

- Full architecture: `ARCHITECTURE.md`
- Folder structure: `FOLDER_STRUCTURE.md`
- Installation guide: `INSTALLATION.md`
- Component library: `docs/COMPONENTS.md`
- Build summary: `BUILD_SUMMARY.md`
