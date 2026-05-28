#!/bin/bash

# Teamify AI - Firebase Setup Script
# This script automates the initial setup process

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠ $1${NC}"
}

# Print banner
echo -e "${BLUE}"
cat << "EOF"
╔════════════════════════════════════════╗
║                                        ║
║         TEAMIFY AI SETUP               ║
║     Firebase Configuration Script      ║
║                                        ║
╚════════════════════════════════════════╝
EOF
echo -e "${NC}"

# Check if running in project directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the project root directory"
    exit 1
fi

# Step 1: Check Prerequisites
print_info "Step 1/7: Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version must be 18 or higher. Current: $(node -v)"
    exit 1
fi
print_success "Node.js $(node -v) is installed"

# Check pnpm
if ! command -v pnpm &> /dev/null; then
    print_warning "pnpm is not installed. Installing pnpm..."
    npm install -g pnpm
fi
print_success "pnpm $(pnpm -v) is installed"

# Check Firebase CLI
if ! command -v firebase &> /dev/null; then
    print_warning "Firebase CLI is not installed. Installing..."
    npm install -g firebase-tools
fi
print_success "Firebase CLI $(firebase --version) is installed"

# Step 2: Install Dependencies
print_info "Step 2/7: Installing project dependencies..."
if pnpm install; then
    print_success "Dependencies installed successfully"
else
    print_error "Failed to install dependencies"
    exit 1
fi

# Step 3: Set up Environment Variables
print_info "Step 3/7: Setting up environment variables..."

if [ ! -f ".env" ]; then
    if [ -f ".env.example" ]; then
        cp .env.example .env
        print_success "Created .env file from .env.example"
        print_warning "Please edit .env file with your Firebase and OpenAI credentials"
        print_info "Required variables:"
        echo "  - NUXT_PUBLIC_FIREBASE_API_KEY"
        echo "  - NUXT_PUBLIC_FIREBASE_AUTH_DOMAIN"
        echo "  - NUXT_PUBLIC_FIREBASE_PROJECT_ID"
        echo "  - OPENAI_API_KEY"
        echo ""
        read -p "Press Enter to continue after editing .env file..."
    else
        print_error ".env.example file not found"
        exit 1
    fi
else
    print_success ".env file already exists"
fi

# Step 4: Firebase Login
print_info "Step 4/7: Firebase authentication..."

if firebase login:list &> /dev/null; then
    print_success "Already logged in to Firebase"
else
    print_info "Please log in to Firebase..."
    firebase login
    if [ $? -eq 0 ]; then
        print_success "Successfully logged in to Firebase"
    else
        print_error "Failed to log in to Firebase"
        exit 1
    fi
fi

# Step 5: Select Firebase Project
print_info "Step 5/7: Configuring Firebase project..."

read -p "Do you want to create a new Firebase project? (y/n): " create_project

if [ "$create_project" = "y" ] || [ "$create_project" = "Y" ]; then
    read -p "Enter project ID (e.g., teamify-ai-prod): " project_id
    print_info "Creating Firebase project: $project_id"

    # Note: Firebase project creation via CLI requires additional setup
    print_warning "Please create the project manually at https://console.firebase.google.com/"
    print_info "Then run: firebase use $project_id"
    read -p "Press Enter after creating the project..."

    firebase use "$project_id"
else
    print_info "Available Firebase projects:"
    firebase projects:list
    read -p "Enter project ID to use: " project_id
    firebase use "$project_id"
fi

if [ $? -eq 0 ]; then
    print_success "Firebase project configured: $project_id"
else
    print_error "Failed to configure Firebase project"
    exit 1
fi

# Step 6: Initialize Firebase Services
print_info "Step 6/7: Initializing Firebase services..."

# Check if firebase.json exists
if [ ! -f "firebase.json" ]; then
    print_info "Running firebase init..."
    firebase init firestore hosting storage
    print_success "Firebase services initialized"
else
    print_success "firebase.json already exists"
fi

# Create Firestore indexes
print_info "Creating Firestore indexes..."
if [ -f "firebase/indexes.json" ]; then
    firebase deploy --only firestore:indexes
    print_success "Firestore indexes deployed"
fi

# Deploy Security Rules
print_info "Deploying security rules..."
firebase deploy --only firestore:rules,storage
print_success "Security rules deployed"

# Step 7: Enable Firebase Services in Console
print_info "Step 7/7: Final configuration..."

print_warning "Please enable the following in Firebase Console:"
echo "  1. Authentication → Email/Password provider"
echo "  2. Authentication → Google provider"
echo "  3. Firestore Database → Create database"
echo "  4. Storage → Create storage bucket"
echo ""
read -p "Press Enter after enabling these services..."

# Test Firebase connection
print_info "Testing Firebase connection..."
firebase firestore:indexes &> /dev/null

if [ $? -eq 0 ]; then
    print_success "Firebase connection successful!"
else
    print_warning "Could not verify Firebase connection. Please check your configuration."
fi

# Final Steps
echo ""
print_success "═══════════════════════════════════════"
print_success "    Setup Complete! 🎉"
print_success "═══════════════════════════════════════"
echo ""
print_info "Next steps:"
echo "  1. Verify .env file has all required credentials"
echo "  2. Add your OpenAI API key to .env"
echo "  3. Run 'pnpm dev' to start development server"
echo "  4. Visit http://localhost:3000"
echo ""
print_info "Useful commands:"
echo "  pnpm dev              - Start development server"
echo "  pnpm build            - Build for production"
echo "  firebase deploy       - Deploy to Firebase Hosting"
echo "  firebase emulators:start - Start Firebase emulators"
echo ""
print_success "Happy coding! 🚀"
