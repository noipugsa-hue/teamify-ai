<template>
  <div class="min-h-screen flex items-center justify-center p-4 sm:p-6 md:p-8 bg-gray-950 relative overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute inset-0">
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-float" />
      <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-float" style="animation-delay: 1s" />
    </div>

    <!-- Register Card -->
    <div class="relative z-10 w-full max-w-md">
      <div class="card-premium p-8">
        <!-- Logo & Title -->
        <div class="text-center mb-8">
          <div class="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center animate-glow">
            <Sparkles :size="32" class="text-white" />
          </div>
          <h1 class="text-3xl font-bold gradient-text mb-2">{{ t.auth.createAccount }}</h1>
          <p class="text-gray-400">{{ t.auth.joinTeamify }}</p>
        </div>

        <!-- Error Message -->
        <div v-if="error" class="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20">
          <p class="text-sm text-red-400">{{ error }}</p>
        </div>

        <!-- Register Form -->
        <form @submit.prevent="handleRegister" class="space-y-6">
          <!-- Display Name -->
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">{{ t.auth.fullName }}</label>
            <input
              v-model="displayName"
              type="text"
              required
              :placeholder="t.auth.fullNamePlaceholder"
              class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>

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
              minlength="6"
              class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
            <p class="mt-1 text-xs text-gray-500">{{ t.auth.atLeast6Characters }}</p>
          </div>

          <!-- Terms -->
          <label class="flex items-start gap-2 text-sm text-gray-400 cursor-pointer">
            <input type="checkbox" class="mt-1 rounded" v-model="acceptTerms" required />
            <span>
              {{ t.auth.iAgreeToThe }}
              <a href="#" class="text-purple-400 hover:text-purple-300">{{ t.auth.termsOfService }}</a>
              {{ t.auth.and }}
              <a href="#" class="text-purple-400 hover:text-purple-300">{{ t.auth.privacyPolicy }}</a>
            </span>
          </label>

          <!-- Register Button -->
          <UiGradientButton
            type="submit"
            variant="primary"
            class="w-full"
            :loading="loading"
            :loading-text="t.auth.creatingAccount"
            :disabled="!acceptTerms"
          >
            {{ t.auth.createAccountBtn }}
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

        <!-- Google Sign Up -->
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

        <!-- Login Link -->
        <p class="mt-6 text-center text-sm text-gray-400">
          {{ t.auth.alreadyHaveAccount }}
          <NuxtLink to="/auth/login" class="text-purple-400 hover:text-purple-300 font-medium">
            {{ t.auth.signInLink }}
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Sparkles } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  layout: false,
})

const authStore = useAuthStore()
const router = useRouter()
const { t } = useLocale()

const displayName = ref('')
const email = ref('')
const password = ref('')
const acceptTerms = ref(false)
const loading = ref(false)
const error = ref<string | null>(null)

async function handleRegister() {
  loading.value = true
  error.value = null

  try {
    await authStore.signUp(email.value, password.value, displayName.value)
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message || t.value.auth.failedToCreateAccount
  } finally {
    loading.value = false
  }
}

async function handleGoogleSignIn() {
  loading.value = true
  error.value = null

  try {
    await authStore.signInWithGoogle()
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err.message || t.value.auth.failedToSignInWithGoogle
  } finally {
    loading.value = false
  }
}
</script>
