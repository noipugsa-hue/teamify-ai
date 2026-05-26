<template>
  <div class="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
    <!-- Background Effects -->
    <div class="absolute inset-0 -z-10">
      <div class="absolute top-20 left-1/4 w-96 h-96 gradient-primary opacity-20 blur-[120px] rounded-full"></div>
      <div class="absolute bottom-20 right-1/4 w-96 h-96 gradient-secondary opacity-20 blur-[120px] rounded-full"></div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center">
      <div class="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
      <p class="text-gray-400">Processing your referral...</p>
    </div>

    <!-- Success State -->
    <div v-else-if="!error" class="max-w-2xl w-full text-center">
      <div class="card-premium p-8 md:p-12">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full gradient-primary flex items-center justify-center">
          <CheckCircle :size="40" class="text-white" />
        </div>

        <h1 class="text-4xl md:text-5xl font-bold gradient-text mb-4">
          Welcome to Teamify AI!
        </h1>

        <p class="text-xl text-gray-300 mb-2">
          You've been invited by <span class="font-semibold text-white">{{ referrerName }}</span>
        </p>

        <p class="text-gray-400 mb-8">
          Join thousands of network marketers using AI to grow their business
        </p>

        <!-- Features -->
        <div class="grid md:grid-cols-3 gap-4 mb-8 text-left">
          <div class="p-4 rounded-xl glass">
            <Sparkles :size="24" class="text-purple-400 mb-2" />
            <h3 class="font-semibold text-white mb-1">AI Content Generator</h3>
            <p class="text-sm text-gray-400">Create viral posts in seconds</p>
          </div>

          <div class="p-4 rounded-xl glass">
            <Users :size="24" class="text-blue-400 mb-2" />
            <h3 class="font-semibold text-white mb-1">Team Management</h3>
            <p class="text-sm text-gray-400">Track your downline growth</p>
          </div>

          <div class="p-4 rounded-xl glass">
            <TrendingUp :size="24" class="text-emerald-400 mb-2" />
            <h3 class="font-semibold text-white mb-1">Analytics Dashboard</h3>
            <p class="text-sm text-gray-400">Monitor your performance</p>
          </div>
        </div>

        <!-- CTA Buttons -->
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <UiGradientButton
            variant="primary"
            size="lg"
            @click="goToSignup"
            class="flex-1 sm:flex-none"
          >
            Get Started - It's Free
          </UiGradientButton>

          <button
            @click="goToLogin"
            class="flex-1 sm:flex-none px-8 py-3 rounded-xl glass hover:bg-white/10 transition-colors text-white font-semibold"
          >
            Already have an account?
          </button>
        </div>

        <!-- Trust Indicators -->
        <div class="mt-8 pt-6 border-t border-white/10">
          <div class="flex items-center justify-center gap-6 text-sm text-gray-400">
            <div class="flex items-center gap-2">
              <CheckCircle :size="16" class="text-emerald-400" />
              <span>No credit card required</span>
            </div>
            <div class="flex items-center gap-2">
              <CheckCircle :size="16" class="text-emerald-400" />
              <span>Free 14-day trial</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else class="max-w-md w-full text-center">
      <div class="card-premium p-8">
        <div class="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
          <AlertCircle :size="40" class="text-red-400" />
        </div>

        <h1 class="text-3xl font-bold text-white mb-4">
          Invalid Referral Link
        </h1>

        <p class="text-gray-400 mb-8">
          {{ error }}
        </p>

        <UiGradientButton
          variant="primary"
          @click="goToHome"
          class="w-full"
        >
          Go to Homepage
        </UiGradientButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { CheckCircle, AlertCircle, Sparkles, Users, TrendingUp } from 'lucide-vue-next'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const loading = ref(true)
const error = ref<string | null>(null)
const referrerName = ref('a team member')

onMounted(async () => {
  const code = route.params.code as string
  const source = route.query.source as string | undefined

  if (!code) {
    error.value = 'No referral code provided'
    loading.value = false
    return
  }

  try {
    // Store referral data in localStorage for signup process
    const referralData = {
      code,
      source,
      timestamp: new Date().toISOString(),
    }
    localStorage.setItem('referral_data', JSON.stringify(referralData))

    // Optional: Track the click via API
    try {
      await $fetch('/api/affiliate/track-click', {
        method: 'POST',
        body: { referralCode: code, source },
      })
    } catch (trackError) {
      console.warn('Failed to track click:', trackError)
      // Don't block the user flow if tracking fails
    }

    // Optional: Fetch referrer info to personalize the page
    try {
      const referrer = await $fetch<{ displayName?: string; referralCode: string }>(`/api/affiliate/referrer/${code}`)
      if (referrer && referrer.displayName) {
        referrerName.value = referrer.displayName
      }
    } catch (fetchError) {
      console.warn('Failed to fetch referrer info:', fetchError)
      // Use default name if fetch fails
    }

    loading.value = false
  } catch (err: any) {
    error.value = err.message || 'An error occurred processing your referral'
    loading.value = false
  }
})

function goToSignup() {
  router.push('/auth/register')
}

function goToLogin() {
  router.push('/auth/login')
}

function goToHome() {
  router.push('/')
}
</script>
