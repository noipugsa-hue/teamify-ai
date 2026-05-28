# Teamify AI - Folder Structure

## Complete Directory Tree

```
teamify-ai/
├── 📁 app/                                    # Application source code
│   ├── 📁 components/                         # Vue components
│   │   ├── 📁 ui/                            # Base UI components (reusable)
│   │   │   ├── Button.vue                    # Button component
│   │   │   ├── Card.vue                      # Card wrapper
│   │   │   ├── Input.vue                     # Input field
│   │   │   ├── Modal.vue                     # Modal dialog
│   │   │   ├── Badge.vue                     # Badge/tag
│   │   │   ├── Select.vue                    # Select dropdown
│   │   │   ├── Textarea.vue                  # Textarea
│   │   │   ├── Switch.vue                    # Toggle switch
│   │   │   ├── Tabs.vue                      # Tab navigation
│   │   │   └── Toast.vue                     # Toast notifications
│   │   │
│   │   ├── 📁 dashboard/                     # Dashboard components
│   │   │   ├── StatCard.vue                  # Statistics card
│   │   │   ├── Chart.vue                     # Chart wrapper
│   │   │   ├── QuickActions.vue              # Quick action buttons
│   │   │   ├── RecentActivity.vue            # Activity feed
│   │   │   └── WelcomeBanner.vue             # Welcome message
│   │   │
│   │   ├── 📁 content/                       # AI content generation
│   │   │   ├── AIGenerator.vue               # Main generator component
│   │   │   ├── ContentEditor.vue             # Content editor
│   │   │   ├── ViralScoreCard.vue            # Viral score display
│   │   │   ├── PlatformSelector.vue          # Platform chooser
│   │   │   ├── ContentHistory.vue            # Generated content list
│   │   │   └── SavedTemplates.vue            # Template library
│   │   │
│   │   ├── 📁 affiliate/                     # Affiliate dashboard
│   │   │   ├── LinkGenerator.vue             # Generate affiliate links
│   │   │   ├── StatsOverview.vue             # Affiliate statistics
│   │   │   ├── CommissionTracker.vue         # Commission tracking
│   │   │   ├── ClickAnalytics.vue            # Click analytics
│   │   │   └── PayoutHistory.vue             # Payout records
│   │   │
│   │   ├── 📁 landing/                       # Landing page builder
│   │   │   ├── PageEditor.vue                # Visual editor
│   │   │   ├── TemplateSelector.vue          # Template chooser
│   │   │   ├── PublishModal.vue              # Publish dialog
│   │   │   ├── SectionEditor.vue             # Section editor
│   │   │   └── PreviewPanel.vue              # Live preview
│   │   │
│   │   └── 📁 shared/                        # Shared components
│   │       ├── Navbar.vue                    # Top navigation
│   │       ├── Sidebar.vue                   # Side navigation
│   │       ├── Footer.vue                    # Footer
│   │       ├── Logo.vue                      # App logo
│   │       ├── UserMenu.vue                  # User dropdown
│   │       └── NotificationBell.vue          # Notifications
│   │
│   ├── 📁 composables/                        # Vue composables (business logic)
│   │   ├── useAuth.ts                        # Authentication logic
│   │   ├── useAI.ts                          # AI generation logic
│   │   ├── useNotifications.ts               # Real-time notifications
│   │   ├── useSubscription.ts                # Subscription management
│   │   ├── useAnalytics.ts                   # Analytics tracking
│   │   ├── useAffiliate.ts                   # Affiliate tracking
│   │   ├── useLandingPage.ts                 # Landing page management
│   │   └── useToast.ts                       # Toast notifications
│   │
│   ├── 📁 layouts/                            # Layout components
│   │   ├── default.vue                       # Main app layout (with sidebar)
│   │   ├── auth.vue                          # Authentication pages layout
│   │   └── landing.vue                       # Landing page layout
│   │
│   ├── 📁 middleware/                         # Route middleware
│   │   ├── auth.ts                           # Authentication guard
│   │   ├── subscription.ts                   # Subscription check
│   │   └── admin.ts                          # Admin access control
│   │
│   ├── 📁 pages/                              # File-based routing
│   │   ├── index.vue                         # Public landing page
│   │   │
│   │   ├── 📁 auth/                          # Authentication pages
│   │   │   ├── login.vue                     # Login page
│   │   │   ├── register.vue                  # Registration page
│   │   │   └── reset-password.vue            # Password reset
│   │   │
│   │   ├── 📁 dashboard/                     # Main dashboard
│   │   │   └── index.vue                     # Dashboard home
│   │   │
│   │   ├── 📁 ai-content/                    # AI content generator
│   │   │   └── index.vue                     # Content generator page
│   │   │
│   │   ├── 📁 affiliate/                     # Affiliate dashboard
│   │   │   └── index.vue                     # Affiliate dashboard page
│   │   │
│   │   ├── 📁 landing-builder/               # Landing page builder
│   │   │   ├── index.vue                     # Builder list
│   │   │   └── [id].vue                      # Edit specific page
│   │   │
│   │   ├── 📁 settings/                      # Settings
│   │   │   └── index.vue                     # Settings page
│   │   │
│   │   └── 📁 admin/                         # Admin dashboard
│   │       └── index.vue                     # Admin page
│   │
│   ├── 📁 stores/                             # Pinia state management
│   │   ├── auth.ts                           # User authentication state
│   │   ├── content.ts                        # AI content state
│   │   ├── affiliate.ts                      # Affiliate tracking state
│   │   ├── subscription.ts                   # Subscription state
│   │   ├── notifications.ts                  # Notifications state
│   │   └── landingPages.ts                   # Landing pages state
│   │
│   ├── 📁 types/                              # TypeScript type definitions
│   │   ├── index.ts                          # Main types export
│   │   ├── user.ts                           # User types
│   │   ├── content.ts                        # Content types
│   │   ├── affiliate.ts                      # Affiliate types
│   │   ├── subscription.ts                   # Subscription types
│   │   └── landing.ts                        # Landing page types
│   │
│   ├── 📁 utils/                              # Utility functions
│   │   ├── format.ts                         # Formatting helpers
│   │   ├── validation.ts                     # Input validation
│   │   ├── analytics.ts                      # Analytics helpers
│   │   ├── seo.ts                            # SEO utilities
│   │   └── constants.ts                      # App constants
│   │
│   └── app.vue                                # Root component
│
├── 📁 server/                                 # Server-side code (Nitro)
│   ├── 📁 api/                                # API routes
│   │   │
│   │   ├── 📁 ai/                            # AI generation endpoints
│   │   │   ├── generate-content.post.ts      # Generate content
│   │   │   ├── generate-hook.post.ts         # Generate viral hooks
│   │   │   ├── viral-score.post.ts           # Calculate viral score
│   │   │   └── analyze-content.post.ts       # Analyze content
│   │   │
│   │   ├── 📁 auth/                          # Authentication endpoints
│   │   │   ├── register.post.ts              # User registration
│   │   │   ├── login.post.ts                 # User login
│   │   │   ├── verify.post.ts                # Email verification
│   │   │   └── reset-password.post.ts        # Password reset
│   │   │
│   │   ├── 📁 affiliate/                     # Affiliate endpoints
│   │   │   ├── create-link.post.ts           # Create affiliate link
│   │   │   ├── track-click.post.ts           # Track click event
│   │   │   ├── get-stats.get.ts              # Get affiliate stats
│   │   │   └── get-links.get.ts              # Get user links
│   │   │
│   │   ├── 📁 landing/                       # Landing page endpoints
│   │   │   ├── create.post.ts                # Create landing page
│   │   │   ├── update.put.ts                 # Update landing page
│   │   │   ├── delete.delete.ts              # Delete landing page
│   │   │   ├── publish.post.ts               # Publish page
│   │   │   └── get-pages.get.ts              # Get user pages
│   │   │
│   │   ├── 📁 subscription/                  # Subscription endpoints
│   │   │   ├── create.post.ts                # Create subscription
│   │   │   ├── cancel.post.ts                # Cancel subscription
│   │   │   ├── webhook.post.ts               # Stripe webhook
│   │   │   └── status.get.ts                 # Get subscription status
│   │   │
│   │   └── 📁 notifications/                 # Notification endpoints
│   │       ├── send.post.ts                  # Send notification
│   │       ├── list.get.ts                   # List notifications
│   │       └── mark-read.post.ts             # Mark as read
│   │
│   ├── 📁 services/                           # Business logic services
│   │   ├── ai.service.ts                     # OpenAI integration
│   │   ├── auth.service.ts                   # Authentication service
│   │   ├── affiliate.service.ts              # Affiliate logic
│   │   ├── payment.service.ts                # Payment processing (Stripe)
│   │   ├── email.service.ts                  # Email service
│   │   └── analytics.service.ts              # Analytics service
│   │
│   ├── 📁 middleware/                         # Server middleware
│   │   ├── auth.ts                           # JWT verification
│   │   ├── rate-limit.ts                     # Rate limiting
│   │   ├── cors.ts                           # CORS configuration
│   │   └── error-handler.ts                  # Global error handler
│   │
│   └── 📁 utils/                              # Server utilities
│       ├── firebase-admin.ts                 # Firebase Admin SDK
│       ├── validation.ts                     # Schema validation (Zod)
│       ├── error-handler.ts                  # Error handling
│       └── logger.ts                         # Logging utility
│
├── 📁 firebase/                               # Firebase configuration
│   ├── index.ts                              # Firebase initialization
│   ├── collections.ts                        # Collection references
│   ├── security-rules.ts                     # Security rules
│   └── indexes.json                          # Firestore indexes
│
├── 📁 prompts/                                # AI prompt templates
│   ├── system.ts                             # System prompts
│   ├── content.ts                            # Content generation prompts
│   ├── hooks.ts                              # Hook generation prompts
│   └── landing.ts                            # Landing page prompts
│
├── 📁 assets/                                 # Static assets
│   ├── 📁 css/
│   │   └── main.css                          # Global styles + TailwindCSS
│   └── 📁 images/
│       └── logo.png
│
├── 📁 public/                                 # Public files
│   ├── favicon.ico                           # Favicon
│   ├── robots.txt                            # SEO robots file
│   └── sitemap.xml                           # SEO sitemap
│
├── 📁 docs/                                   # Documentation
│   ├── API.md                                # API documentation
│   ├── DEPLOYMENT.md                         # Deployment guide
│   ├── CONTRIBUTING.md                       # Contribution guide
│   └── COMPONENTS.md                         # Component library docs
│
├── 📁 scripts/                                # Utility scripts
│   ├── setup-firebase.sh                     # Firebase setup script
│   ├── generate-types.ts                     # Type generation
│   └── seed-data.ts                          # Database seeding
│
├── 📁 tests/                                  # Test files
│   ├── 📁 unit/                              # Unit tests
│   ├── 📁 integration/                       # Integration tests
│   └── 📁 e2e/                               # End-to-end tests
│
├── 📁 .github/                                # GitHub configuration
│   └── 📁 workflows/
│       ├── deploy.yml                        # Deployment workflow
│       └── test.yml                          # Testing workflow
│
├── 📄 nuxt.config.ts                          # Nuxt configuration
├── 📄 tailwind.config.ts                      # TailwindCSS configuration
├── 📄 tsconfig.json                           # TypeScript configuration
├── 📄 package.json                            # Dependencies and scripts
├── 📄 pnpm-lock.yaml                          # Lock file
├── 📄 .env.example                            # Environment variables template
├── 📄 .gitignore                              # Git ignore rules
├── 📄 firebase.json                           # Firebase configuration
├── 📄 .eslintrc                               # ESLint configuration
├── 📄 .prettierrc                             # Prettier configuration
├── 📄 vitest.config.ts                        # Vitest test configuration
├── 📄 README.md                               # Project README
├── 📄 ARCHITECTURE.md                         # Architecture documentation
├── 📄 FOLDER_STRUCTURE.md                     # This file
└── 📄 LICENSE                                 # License file
```

## Directory Purpose

### `/app` - Application Layer
Contains all client-side Vue 3 code including components, pages, stores, and composables.

### `/server` - Server Layer
Contains all server-side code including API routes, business logic services, and utilities.

### `/firebase` - Firebase Configuration
Firebase initialization, collection helpers, security rules, and indexes.

### `/prompts` - AI Prompts
Organized AI prompt templates for different content types.

### `/docs` - Documentation
Comprehensive documentation for the project.

### `/tests` - Testing
Unit, integration, and end-to-end tests.

## File Naming Conventions

### Components
- **PascalCase**: `Button.vue`, `StatCard.vue`, `AIGenerator.vue`
- **Descriptive**: Component name should describe its purpose

### Composables
- **camelCase with `use` prefix**: `useAuth.ts`, `useAI.ts`
- **Single responsibility**: Each composable should have one clear purpose

### Stores
- **camelCase**: `auth.ts`, `content.ts`, `subscription.ts`
- **Domain-based**: Named after the domain they manage

### API Routes
- **kebab-case**: `generate-content.post.ts`, `create-link.post.ts`
- **HTTP method suffix**: `.get.ts`, `.post.ts`, `.put.ts`, `.delete.ts`

### Types
- **camelCase**: `user.ts`, `content.ts`, `affiliate.ts`
- **Clear domain**: Group related types together

## Import Aliases

The project uses TypeScript path aliases for cleaner imports:

```typescript
// nuxt.config.ts already configures these:
'~/*'        // Root directory
'@/*'        // App directory
'#app'       // Nuxt internals
'#imports'   // Auto imports
```

### Example Usage:
```typescript
import { useAuth } from '~/composables/useAuth'
import { Button } from '~/components/ui/Button.vue'
import type { User } from '~/types/user'
```

## Code Organization Principles

1. **Separation of Concerns**: Each file/folder has a single, clear responsibility
2. **Feature-based Structure**: Related code is co-located
3. **Reusability**: UI components are atomic and composable
4. **Type Safety**: Strong TypeScript types throughout
5. **Testability**: Structure supports easy testing
6. **Scalability**: Easy to add new features without refactoring

## Next Steps

After folder structure is complete:
1. ✅ Create configuration files (`nuxt.config.ts`, `tailwind.config.ts`, etc.)
2. ✅ Set up Firebase configuration
3. ✅ Create base UI components
4. ✅ Implement composables
5. ✅ Build API routes
6. ✅ Create pages
7. ✅ Set up stores
8. ✅ Add tests

---

This structure follows **Nuxt 4 best practices** and is designed for **scalability** and **maintainability**.
