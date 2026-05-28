<template>
  <div class="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-950 relative overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute inset-0">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-float" />
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-float" style="animation-delay: 1s" />
    </div>

    <!-- Login Card -->
    <div class="relative z-10 w-full max-w-md">
      <div class="card-premium p-8">
        <!-- Logo & Title -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center animate-glow">
            <Sparkles :size="32" class="text-white" />
          </div>
          <h1 class="text-3xl font-bold gradient-text mb-2">{{ t.auth.welcomeBack }}</h1>
          <p class="text-gray-400">{{ t.auth.signInToContinue }}</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <p class="text-sm text-red-400">{{ error }}</p>
        </div>

        <!-- Login Form -->
        <form @submit.prevent="handleLogin" class="space-y-6">
          <!-- Email -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">{{ t.auth.email }}</label>
            <input
              v-model="email"
              type="email"
              required
              :placeholder="t.auth.emailPlaceholder"
              class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <!-- Password -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">{{ t.auth.password }}</label>
            <input
              v-model="password"
              type="password"
              required
              :placeholder="t.auth.passwordPlaceholder"
              class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

          <!-- Remember & Forgot -->
          <div class="flex items-center justify-between text-sm">
            <label class="flex items-center gap-2 text-gray-400 cursor-pointer">
              <input type="checkbox" class="rounded" v-model="rememberMe" />
              <span>{{ t.auth.rememberMe }}</span>
            </label>
            <a href="#" class="text-purple-400 hover:text-purple-300">{{ t.auth.forgotPassword }}</a>
          </div>

          <!-- Login Button -->
          <UiGradientButton
            type="submit"
            variant="primary"
            class="w-full"
            :loading="loading"
            :loading-text="t.auth.signingIn"
          >
            {{ t.auth.signIn }}
          </UiGradientButton>
        </form>

        <!-- Divider -->
        <div class="relative my-6">
          <div class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-white/10" />
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-4 bg-gray-950 text-gray-400">{{ t.auth.orContinueWith }}</span>
          </div>
        </div>

        <!-- Google Sign In -->
        <button
          @click="handleGoogleSignIn"
          :disabled="loading"
          class="w-full flex items-center justify-center gap-3 px-6 py-3 rounded-xl glass hover:bg-white/10 transition-colors"
        >
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          <span class="text-white font-medium">{{ t.auth.continueWithGoogle }}</span>
        </button>

        <!-- Sign Up Link -->
        <p class="mt-6 text-center text-sm text-gray-400">
          {{ t.auth.dontHaveAccount }}
          <NuxtLink to="/auth/register" class="text-purple-400 hover:text-purple-300 font-medium">
            {{ t.auth.signUpForFree }}
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Sparkles } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  layout: false,
})

const authStore = useAuthStore()
const router = useRouter()
const { t } = useLocale()

const email = ref('')
const password = ref('')
const rememberMe = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

// Check if user is already authenticated after redirect
onMounted(async () => {
  console.log('Login page mounted, checking auth state...')

  // Wait for auth to initialize
  if (!authStore.initialized) {
    await authStore.initAuth()
  }

  // If user is already authenticated, redirect to dashboard
  if (authStore.isAuthenticated) {
    console.log('User already authenticated, redirecting to dashboard...')
    router.push('/dashboard')
  }
})

async function handleLogin() {
  loading.value = true
  error.value = null

  try {
    await authStore.signIn(email.value, password.value)
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message || t.value.auth.failedToSignIn
  } finally {
    loading.value = false
  }
}

async function handleGoogleSignIn() {
  loading.value = true
  error.value = null

  try {
    console.log('Starting Google Sign-In...')
    await authStore.signInWithGoogle()
    console.log('Google Sign-In successful')
    router.push('/dashboard')
  } catch (err: any) {
    console.error('Google Sign-In error:', err)
    error.value = err.message || t.value.auth.failedToSignInWithGoogle
  } finally {
    loading.value = false
  }
}
</script>
