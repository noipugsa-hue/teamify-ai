<template>
  <div>
    <!-- Loading Screen -->
    <div
      v-if="isInitializing"
      class="fixed inset-0 bg-gray-950 flex items-center justify-center z-50"
    >
      <div class="text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl gradient-primary flex items-center justify-center animate-pulse">
          <svg class="w-8 h-8 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
        <p class="text-white text-lg font-medium">Loading Teamify AI...</p>
        <p class="text-gray-400 text-sm mt-2">Initializing your workspace</p>
      </div>
    </div>

    <!-- Error Screen -->
    <div
      v-else-if="initError"
      class="fixed inset-0 bg-gray-950 flex items-center justify-center z-50 p-4"
    >
      <div class="card-premium max-w-md w-full p-8 text-center">
        <div class="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/20 flex items-center justify-center">
          <svg class="w-8 h-8 text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 class="text-xl font-bold text-white mb-2">Initialization Error</h2>
        <p class="text-gray-400 mb-6">{{ initError }}</p>
        <button
          @click="retryInitialization"
          class="px-6 py-3 rounded-xl gradient-primary text-white font-medium hover:opacity-90 transition-opacity"
        >
          Retry
        </button>
      </div>
    </div>

    <!-- Main App -->
    <div v-else>
      <NuxtRouteAnnouncer />
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useTheme } from '~/composables/useTheme'
import { useLocale } from '~/composables/useLocale'

const authStore = useAuthStore()
const { loadTheme } = useTheme()
const { loadLocale } = useLocale()

const isInitializing = ref(true)
const initError = ref<string | null>(null)

async function initializeApp() {
  try {
    console.log('🚀 Starting app initialization...')

    // Load theme and locale from localStorage
    loadTheme()
    loadLocale()

    // Initialize auth
    await authStore.initAuth()

    console.log('✅ App initialization complete')
    isInitializing.value = false
  } catch (error: any) {
    console.error('❌ App initialization failed:', error)
    initError.value = error.message || 'Failed to initialize app. Please check your connection and try again.'
    isInitializing.value = false
  }
}

function retryInitialization() {
  isInitializing.value = true
  initError.value = null
  initializeApp()
}

// Initialize auth, theme, and locale on app mount
onMounted(() => {
  initializeApp()
})
</script>
