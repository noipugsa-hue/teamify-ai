<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useTheme } from '~/composables/useTheme'
import { useLocale } from '~/composables/useLocale'

const authStore = useAuthStore()
const { loadTheme } = useTheme()
const { loadLocale } = useLocale()

// Initialize auth, theme, and locale on app mount
onMounted(async () => {
  // Load theme and locale from localStorage
  loadTheme()
  loadLocale()

  // Initialize auth
  await authStore.initAuth()
})
</script>
