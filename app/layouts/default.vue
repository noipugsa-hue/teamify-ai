<template>
  <div class="min-h-screen bg-gray-950">
    <!-- Sidebar -->
    <aside
      :class="[
        'fixed top-0 left-0 h-screen glass border-r border-white/10 z-50 transition-all duration-300',
        sidebarOpen ? 'w-64' : 'w-20'
      ]"
    >
      <div class="flex flex-col h-full p-4">
        <!-- Logo -->
        <div class="flex items-center gap-3 mb-8">
          <div class="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
            <Sparkles :size="20" class="text-white" />
          </div>
          <h1 v-if="sidebarOpen" class="text-xl font-bold gradient-text">Teamify AI</h1>
        </div>

        <!-- Navigation -->
        <nav class="flex-1 space-y-2">
          <NuxtLink
            v-for="item in navigation"
            :key="item.path"
            :to="item.path"
            :class="[
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
              'hover:bg-white/10',
              $route.path === item.path ? 'bg-white/10 text-white' : 'text-gray-400'
            ]"
          >
            <component :is="item.icon" :size="20" />
            <span v-if="sidebarOpen" class="font-medium">{{ item.label }}</span>
          </NuxtLink>
        </nav>

        <!-- User Profile -->
        <div v-if="user" class="pt-4 border-t border-white/10 space-y-2">
          <div class="flex items-center gap-3 p-3 rounded-xl glass">
            <div class="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <span class="text-sm font-bold text-white">{{ userInitials }}</span>
            </div>
            <div v-if="sidebarOpen" class="flex-1 min-w-0">
              <p class="text-sm font-medium text-white truncate">{{ user.displayName }}</p>
              <p class="text-xs text-gray-400">{{ subscriptionLabel }}</p>
            </div>
          </div>

          <!-- Sign Out Button -->
          <button
            @click="handleSignOut"
            :class="[
              'w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
              'hover:bg-red-500/10 text-red-400 hover:text-red-300'
            ]"
          >
            <LogOut :size="20" />
            <span v-if="sidebarOpen" class="font-medium">{{ t.common.signOut }}</span>
          </button>
        </div>

        <!-- Toggle Sidebar -->
        <button
          class="mt-4 p-2 rounded-xl glass hover:bg-white/10 transition-colors"
          @click="sidebarOpen = !sidebarOpen"
        >
          <Menu :size="20" class="text-gray-400" />
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main :class="[
      'transition-all duration-300',
      sidebarOpen ? 'ml-64' : 'ml-20'
    ]">
      <div class="p-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  LayoutDashboard,
  Sparkles,
  MessageSquare,
  FileText,
  Users,
  Target,
  TrendingUp,
  Settings,
  Menu,
  Zap,
  LogOut,
  ImageIcon,
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useLocale } from '~/composables/useLocale'

const authStore = useAuthStore()
const router = useRouter()
const { t } = useLocale()
const sidebarOpen = ref(true)

const user = computed(() => authStore.userProfile)

const userInitials = computed(() => {
  if (!user.value?.displayName) return 'U'
  return user.value.displayName
    .split(' ')
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
})

const subscriptionLabel = computed(() => {
  if (!user.value?.subscription) return ''

  // Check if translations are loaded
  if (!t.value?.subscription) return user.value.subscription

  const tier = user.value.subscription as 'free' | 'starter' | 'pro' | 'enterprise'
  return t.value.subscription[tier] || user.value.subscription
})

const navigation = computed(() => [
  { path: '/dashboard', label: t.value.nav.dashboard, icon: LayoutDashboard },
  { path: '/ai-content', label: t.value.nav.aiContent, icon: Sparkles },
  { path: '/ai-image', label: t.value.nav.aiImage || 'AI Image', icon: ImageIcon },
  { path: '/ai-closing', label: t.value.nav.aiClosing, icon: MessageSquare },
  { path: '/crm', label: t.value.nav.crm, icon: Users },
  { path: '/affiliate', label: t.value.nav.affiliate, icon: Target },
  { path: '/team', label: t.value.nav.team, icon: Users },
  { path: '/analytics', label: t.value.nav.analytics, icon: TrendingUp },
  { path: '/automation', label: t.value.nav.automation, icon: Zap },
  { path: '/settings', label: t.value.nav.settings, icon: Settings },
])

async function handleSignOut() {
  try {
    await authStore.signOut()
    router.push('/auth/login')
  } catch (error) {
    console.error('Sign out error:', error)
  }
}
</script>
