# Teamify AI - Installation Guide

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js**: v18.0.0 or higher
- **pnpm**: v8.0.0 or higher (recommended) or npm
- **Git**: Latest version
- **Firebase CLI**: v12.0.0 or higher
- **Code Editor**: VS Code recommended

### Check Prerequisites

```bash
# Check Node.js version
node --version  # Should be v18+

# Check pnpm version
pnpm --version  # Should be v8+

# Check Git
git --version

# Install Firebase CLI globally
npm install -g firebase-tools

# Check Firebase CLI
firebase --version
```

## Quick Start (5 Minutes)

### 1. Clone & Install

```bash
# Clone the repository
git clone https://github.com/your-org/teamify-ai.git
cd teamify-ai

# Install dependencies
pnpm install
```

### 2. Environment Setup

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
nano .env  # or use your preferred editor
```

### 3. Start Development Server

```bash
# Run development server
pnpm dev

# Open browser at http://localhost:3000
```

## Detailed Installation

### Step 1: Install Node.js & pnpm

#### macOS (using Homebrew)
```bash
# Install Node.js
brew install node

# Install pnpm
npm install -g pnpm
```

#### Windows (using Chocolatey)
```bash
# Install Node.js
choco install nodejs

# Install pnpm
npm install -g pnpm
```

#### Linux (Ubuntu/Debian)
```bash
# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Install pnpm
npm install -g pnpm
```

### Step 2: Clone Repository

```bash
# Clone via HTTPS
git clone https://github.com/your-org/teamify-ai.git

# Or via SSH
git clone git@github.com:your-org/teamify-ai.git

# Navigate to directory
cd teamify-ai
```

### Step 3: Install Dependencies

```bash
# Using pnpm (recommended)
pnpm install

# Or using npm
npm install

# Or using yarn
yarn install
```

### Dependencies Installed:

**Framework & Core:**
- `nuxt` - Nuxt 4 framework
- `vue` - Vue 3
- `typescript` - TypeScript support

**UI & Styling:**
- `@nuxt/ui` - Nuxt UI component library
- `tailwindcss` - TailwindCSS
- `@tailwindcss/forms` - Form styles
- `@tailwindcss/typography` - Typography styles
- `lucide-vue-next` - Icon library

**State & Data:**
- `pinia` - State management
- `@pinia/nuxt` - Pinia Nuxt module
- `@vueuse/core` - Vue composition utilities
- `@vueuse/nuxt` - VueUse Nuxt module

**Firebase:**
- `firebase` - Firebase SDK
- `vuefire` - Vue Firebase integration
- `nuxt-vuefire` - Nuxt Firebase module

**AI & API:**
- `openai` - OpenAI API client
- `zod` - Schema validation

**Utilities:**
- `dayjs` - Date manipulation
- `defu` - Deep merge
- `ofetch` - HTTP client

**Development:**
- `@nuxtjs/eslint-config-typescript` - ESLint config
- `eslint` - Linting
- `prettier` - Code formatting
- `vitest` - Testing framework
- `@vue/test-utils` - Vue testing utilities

### Step 4: Firebase Setup

#### 4.1 Create Firebase Project

```bash
# Login to Firebase
firebase login

# Initialize Firebase
firebase init

# Select these services:
# - Firestore
# - Authentication
# - Hosting
# - Storage
```

#### 4.2 Get Firebase Configuration

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click on "Project Settings" (gear icon)
4. Scroll to "Your apps" → Click "Web" icon
5. Copy the configuration object

#### 4.3 Configure Environment Variables

Create `.env` file in the root directory:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:

```env
# ====================================
# FIREBASE CONFIGURATION
# ====================================
NUXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NUXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NUXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NUXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NUXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abcdef

# ====================================
# OPENAI CONFIGURATION
# ====================================
OPENAI_API_KEY=sk-your_openai_api_key_here
OPENAI_ORG_ID=org-your_org_id_here  # Optional

# ====================================
# APP CONFIGURATION
# ====================================
NUXT_PUBLIC_APP_URL=http://localhost:3000
NUXT_PUBLIC_APP_NAME="Teamify AI"
NUXT_PUBLIC_APP_DESCRIPTION="AI-Powered SaaS for TikTok Affiliate Marketers"

# ====================================
# STRIPE CONFIGURATION (Optional)
# ====================================
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret

# ====================================
# EMAIL CONFIGURATION (Optional)
# ====================================
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM="Teamify AI <noreply@teamifyai.com>"

# ====================================
# ANALYTICS (Optional)
# ====================================
GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
```

### Step 5: Firebase Security Setup

#### 5.1 Enable Authentication

```bash
# Go to Firebase Console
# Authentication → Get Started
# Enable Email/Password
# Enable Google Sign-In
```

#### 5.2 Set up Firestore Database

```bash
# Go to Firebase Console
# Firestore Database → Create Database
# Start in Test Mode (we'll add security rules later)
# Choose your region (e.g., us-central1)
```

#### 5.3 Deploy Security Rules

```bash
# Deploy Firestore security rules
firebase deploy --only firestore:rules

# Deploy Storage security rules
firebase deploy --only storage
```

### Step 6: OpenAI API Setup

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign up or log in
3. Go to API Keys section
4. Create new secret key
5. Copy the key to your `.env` file

**Important**: Never commit your `.env` file to version control!

### Step 7: Database Initialization

Run the database seeding script to create initial collections:

```bash
# Seed initial data (optional)
pnpm run seed

# Or manually run the seed script
node scripts/seed-data.ts
```

## Development Commands

### Start Development Server

```bash
# Start dev server with hot reload
pnpm dev

# Start on specific port
pnpm dev --port 3001

# Start with specific host
pnpm dev --host 0.0.0.0
```

### Build for Production

```bash
# Build the application
pnpm build

# Preview production build
pnpm preview
```

### Code Quality

```bash
# Run linter
pnpm lint

# Fix linting issues
pnpm lint:fix

# Format code with Prettier
pnpm format

# Type check
pnpm typecheck
```

### Testing

```bash
# Run all tests
pnpm test

# Run unit tests
pnpm test:unit

# Run tests in watch mode
pnpm test:watch

# Run E2E tests
pnpm test:e2e

# Generate coverage report
pnpm test:coverage
```

### Firebase Commands

```bash
# Login to Firebase
firebase login

# List projects
firebase projects:list

# Use specific project
firebase use your-project-id

# Deploy to Firebase
firebase deploy

# Deploy specific services
firebase deploy --only hosting
firebase deploy --only firestore
firebase deploy --only functions

# View logs
firebase logs

# Start Firebase emulators
firebase emulators:start
```

### Database Operations

```bash
# Export Firestore data
firebase firestore:export gs://your-bucket/backup-$(date +%Y%m%d)

# Import Firestore data
firebase firestore:import gs://your-bucket/backup-20240101

# Delete all Firestore data (careful!)
firebase firestore:delete --all-collections
```

## Package Scripts Reference

```json
{
  "scripts": {
    // Development
    "dev": "nuxt dev",
    "dev:host": "nuxt dev --host 0.0.0.0",

    // Build
    "build": "nuxt build",
    "generate": "nuxt generate",
    "preview": "nuxt preview",

    // Testing
    "test": "vitest",
    "test:unit": "vitest run",
    "test:watch": "vitest watch",
    "test:coverage": "vitest run --coverage",
    "test:e2e": "playwright test",

    // Code Quality
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "typecheck": "nuxt typecheck",

    // Firebase
    "firebase:deploy": "firebase deploy",
    "firebase:emulators": "firebase emulators:start",

    // Database
    "seed": "node scripts/seed-data.ts",

    // Utilities
    "clean": "rm -rf .nuxt node_modules .output",
    "postinstall": "nuxt prepare"
  }
}
```

## Automated Setup Script

We've created an automated setup script for convenience:

```bash
# Make script executable
chmod +x scripts/setup-firebase.sh

# Run setup script
./scripts/setup-firebase.sh
```

The script will:
1. Check prerequisites
2. Install dependencies
3. Set up Firebase
4. Configure environment variables
5. Initialize database
6. Run first-time setup

## Troubleshooting

### Issue: Port 3000 already in use

```bash
# Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or use a different port
pnpm dev --port 3001
```

### Issue: Firebase Authentication Error

```bash
# Re-login to Firebase
firebase logout
firebase login
```

### Issue: Module not found

```bash
# Clear node_modules and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### Issue: TypeScript errors

```bash
# Regenerate Nuxt types
rm -rf .nuxt
pnpm dev
```

### Issue: Firebase Emulator Connection Refused

```bash
# Check if emulators are running
firebase emulators:start

# Check port availability
lsof -i :8080  # Firestore emulator
lsof -i :9099  # Auth emulator
```

### Issue: Build fails

```bash
# Clear cache and rebuild
rm -rf .nuxt .output node_modules
pnpm install
pnpm build
```

## VS Code Setup

### Recommended Extensions

Install these VS Code extensions for the best experience:

```bash
# Vue Language Features
code --install-extension Vue.volar

# TypeScript
code --install-extension ms-vscode.vscode-typescript-next

# ESLint
code --install-extension dbaeumer.vscode-eslint

# Prettier
code --install-extension esbenp.prettier-vscode

# Tailwind CSS IntelliSense
code --install-extension bradlc.vscode-tailwindcss

# Firebase
code --install-extension toba.vsfire
```

### VS Code Settings

Create `.vscode/settings.json`:

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true,
  "tailwindCSS.experimental.classRegex": [
    ["cva\\(([^)]*)\\)", "[\"'`]([^\"'`]*).*?[\"'`]"]
  ]
}
```

## Docker Setup (Optional)

If you prefer Docker:

```bash
# Build Docker image
docker build -t teamify-ai .

# Run container
docker run -p 3000:3000 --env-file .env teamify-ai

# Using Docker Compose
docker-compose up -d
```

## Next Steps

After installation:

1. ✅ Read the [ARCHITECTURE.md](./ARCHITECTURE.md) to understand the system
2. ✅ Check [COMPONENTS.md](./docs/COMPONENTS.md) for UI component usage
3. ✅ Review [API.md](./docs/API.md) for API documentation
4. ✅ Start building features!

## Support

If you encounter issues:

1. Check this documentation
2. Search existing GitHub issues
3. Create a new issue with detailed information
4. Join our Discord community

## Resources

- [Nuxt 4 Documentation](https://nuxt.com/)
- [Vue 3 Documentation](https://vuejs.org/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [OpenAI API Documentation](https://platform.openai.com/docs)

---

**Happy coding! 🚀**
