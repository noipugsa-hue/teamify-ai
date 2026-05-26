# 🚀 Quick Start Guide - Teamify AI

## ⚡ 5-Minute Setup

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Set Up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication**:
   - Email/Password provider
   - Google provider
4. Create **Firestore Database**:
   - Start in production mode
   - Choose your region
5. Get your config from **Project Settings → General**

### 3. Set Up OpenAI

1. Go to [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create a new API key
3. Copy the key (starts with `sk-`)

### 4. Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Firebase (from Firebase Console)
NUXT_PUBLIC_FIREBASE_API_KEY=AIzaSy...
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NUXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123

# OpenAI
OPENAI_API_KEY=sk-proj-...

# App
NUXT_PUBLIC_APP_URL=http://localhost:3000
```

### 5. Run Development Server

```bash
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 📱 First Steps in the App

### 1. Create Account

- Click "Sign up for free"
- Use email/password or Google
- Complete registration

### 2. Generate Your First Content

- Go to **AI Content** page
- Select platform (TikTok, Instagram, etc.)
- Choose content type (Caption, Hook, Script)
- Enter what you want to create
- Click "Generate Content"

### 3. Explore Features

- **Dashboard**: View stats and quick actions
- **AI Content**: Generate viral content
- **AI Closing**: Get sales help
- **CRM**: Manage leads (coming soon in additional pages)
- **Team**: Manage your team (coming soon in additional pages)

---

## 🎯 Key Features Built

### ✅ Completed Core Features

1. **Authentication System**
   - Email/Password login
   - Google OAuth
   - Protected routes
   - User profiles

2. **AI Content Generator**
   - 7 content types (Caption, Hook, Script, Post, CTA, Hashtags, Story)
   - 6 platforms (TikTok, Instagram, Facebook, LinkedIn, Twitter, YouTube)
   - Viral score prediction
   - Content variations
   - Rewrite functionality

3. **Dashboard**
   - Statistics cards
   - Quick actions
   - Recent content
   - Team performance

4. **Database Architecture**
   - Complete TypeScript types
   - Firestore collections structure
   - Pinia stores for state management

5. **AI Service Layer**
   - OpenAI GPT-4 integration
   - Advanced prompt templates
   - Platform-specific prompts
   - Viral scoring system

6. **Beautiful UI**
   - Glassmorphism design
   - Dark mode
   - Premium gradients
   - Smooth animations
   - Mobile-responsive

---

## 🔨 To Build Next (Additional Pages)

### Pages to Add

1. **AI Closing Assistant** (`app/pages/ai-closing/index.vue`)
   - Chat interface
   - Conversation history
   - Objection handling
   - Smart suggestions

2. **CRM Page** (`app/pages/crm/index.vue`)
   - Lead list with filters
   - Lead details view
   - Add/edit lead forms
   - Status pipeline

3. **Affiliate Dashboard** (`app/pages/affiliate/index.vue`)
   - Referral links
   - Commission tracking
   - Team tree visualization
   - Earnings stats

4. **Team Management** (`app/pages/team/index.vue`)
   - Team members list
   - Team goals
   - Missions
   - Activity tracking

5. **Analytics** (`app/pages/analytics/index.vue`)
   - Charts and graphs
   - Performance metrics
   - Export reports

6. **Settings** (`app/pages/settings/index.vue`)
   - Profile settings
   - Subscription management
   - Notification preferences
   - Account settings

### Additional Components

The following can be built using the same patterns:

- Chat components for AI Closing
- Lead cards for CRM
- Team tree visualization
- Charts for analytics
- Forms for settings

---

## 📚 Development Tips

### Using the AI Service

```typescript
// In any component
const contentStore = useContentStore()

// Generate content
const content = await contentStore.generateContent({
  type: 'caption',
  platform: 'tiktok',
  prompt: 'Create a caption about...',
  tone: 'conversational',
  length: 'medium',
})

// Generate variations
const variations = await contentStore.generateVariations(request, 3)

// Rewrite content
const rewritten = await contentStore.rewriteContent(contentId, 'more_engaging')
```

### Using Firebase

```typescript
// Get Firestore
const { db } = useFirebase()

// Add document
const docRef = await addDoc(collection(db, 'users'), userData)

// Query documents
const q = query(
  collection(db, 'leads'),
  where('userId', '==', userId),
  orderBy('createdAt', 'desc')
)
const snapshot = await getDocs(q)
```

### Using Auth

```typescript
const authStore = useAuthStore()

// Check if authenticated
if (authStore.isAuthenticated) {
  // User is logged in
  const user = authStore.userProfile
}

// Sign out
await authStore.signOut()
```

---

## 🎨 Styling Guidelines

### Use Built-in Classes

```vue
<!-- Glassmorphism card -->
<div class="card-premium">
  <!-- Content -->
</div>

<!-- Gradient button -->
<GradientButton variant="primary">
  Click Me
</GradientButton>

<!-- Stats card -->
<StatCard
  :icon="DollarSign"
  label="Revenue"
  :value="$12,450"
  :change="12.5"
/>
```

### Custom Gradients

- `gradient-primary` - Purple/Pink gradient
- `gradient-secondary` - Blue/Purple gradient
- `gradient-success` - Emerald/Teal gradient
- `gradient-text` - Gradient text effect

### Animations

- `animate-float` - Floating animation
- `animate-glow` - Glowing effect
- `animate-pulse` - Pulse effect

---

## 🐛 Troubleshooting

### Firebase Auth Not Working

- Check Firebase Console → Authentication is enabled
- Verify `.env` variables are correct
- Make sure you copied all 6 Firebase variables

### OpenAI API Errors

- Verify API key is correct in `.env`
- Check you have credits in OpenAI account
- Ensure `OPENAI_API_KEY` starts with `sk-`

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules .nuxt
pnpm install
pnpm dev
```

### TypeScript Errors

- Auto-imports may show errors in IDE but work at runtime
- Run `pnpm dev` to see if app actually works
- Most Nuxt auto-imports don't need explicit imports

---

## 🚀 Deployment

### Vercel (Easiest)

1. Push code to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy

### Firebase Hosting

```bash
pnpm build
firebase init hosting
firebase deploy
```

---

## 📞 Support

Need help? Check:

- README.md for detailed documentation
- Code comments for inline help
- Firebase docs: https://firebase.google.com/docs
- Nuxt docs: https://nuxt.com/docs
- OpenAI docs: https://platform.openai.com/docs

---

**Happy Building! 🎉**

Your Teamify AI foundation is ready. Build the remaining pages using the existing patterns, and you'll have a complete production-grade SaaS platform.
