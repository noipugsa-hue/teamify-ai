<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-950">
    <div class="text-center">
      <div class="w-20 h-20 mx-auto mb-6 rounded-2xl gradient-primary flex items-center justify-center animate-pulse">
        <Sparkles :size="40" class="text-white" />
      </div>
      <p class="text-gray-400">Loading...</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { Sparkles } from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { definePageMeta } from '#imports'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: false,
})

const authStore = useAuthStore()
const router = useRouter()

onMounted(async () => {
  await authStore.initAuth()

  if (authStore.isAuthenticated) {
    router.push('/dashboard')
  } else {
    router.push('/auth/login')
  }
})
</script>
