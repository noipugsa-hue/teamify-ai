<template>
  <div class="space-y-6 md:space-y-8 px-4 sm:px-0">
    <!-- Header -->
    <div>
      <h1 class="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
        {{ t.dashboard.welcomeBack }}, <span class="gradient-text break-words">{{ user?.displayName }}</span>
      </h1>
      <p class="text-sm sm:text-base text-gray-400">{{ t.dashboard.whatIsHappening }}</p>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      <UiStatCard
        :icon="DollarSign"
        :label="t.dashboard.totalRevenue"
        :value="formatCurrency(stats.revenue)"
        :change="stats.revenueChange"
        :subtitle="t.dashboard.vsLastMonth"
      />

      <UiStatCard
        :icon="Users"
        :label="t.dashboard.totalLeads"
        :value="stats.totalLeads"
        :change="stats.leadsChange"
        :subtitle="t.dashboard.activeLeads"
      />

      <UiStatCard
        :icon="TrendingUp"
        :label="t.dashboard.conversionRate"
        :value="`${stats.conversionRate}%`"
        :change="stats.conversionChange"
        :subtitle="t.dashboard.vsLastMonth"
      />

      <UiStatCard
        :icon="Zap"
        :label="t.dashboard.viralScore"
        :value="stats.viralScore"
        :change="stats.viralScoreChange"
        :subtitle="t.dashboard.averageContentScore"
      />
    </div>

    <!-- Quick Actions -->
    <div class="card-premium">
      <h2 class="text-lg sm:text-xl font-bold text-white mb-4">{{ t.dashboard.quickActions }}</h2>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
        <button
          @click="router.push('/ai-content')"
          class="p-4 sm:p-6 rounded-xl glass hover:bg-white/10 transition-all text-left group"
        >
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-primary flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
            <Sparkles :size="20" class="sm:w-6 sm:h-6 text-white" />
          </div>
          <h3 class="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">{{ t.dashboard.generateContent }}</h3>
          <p class="text-xs sm:text-sm text-gray-400 line-clamp-2">{{ t.dashboard.generateContentDesc }}</p>
        </button>

        <button
          @click="router.push('/ai-closing')"
          class="p-4 sm:p-6 rounded-xl glass hover:bg-white/10 transition-all text-left group"
        >
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-secondary flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
            <MessageSquare :size="20" class="sm:w-6 sm:h-6 text-white" />
          </div>
          <h3 class="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">{{ t.dashboard.aiClosingAssistant }}</h3>
          <p class="text-xs sm:text-sm text-gray-400 line-clamp-2">{{ t.dashboard.aiClosingAssistantDesc }}</p>
        </button>

        <button
          @click="router.push('/crm')"
          class="p-4 sm:p-6 rounded-xl glass hover:bg-white/10 transition-all text-left group sm:col-span-2 md:col-span-1"
        >
          <div class="w-10 h-10 sm:w-12 sm:h-12 rounded-xl gradient-success flex items-center justify-center mb-3 sm:mb-4 group-hover:scale-110 transition-transform">
            <Users :size="20" class="sm:w-6 sm:h-6 text-white" />
          </div>
          <h3 class="text-base sm:text-lg font-semibold text-white mb-1 sm:mb-2">{{ t.dashboard.manageLeads }}</h3>
          <p class="text-xs sm:text-sm text-gray-400 line-clamp-2">{{ t.dashboard.manageLeadsDesc }}</p>
        </button>
      </div>
    </div>

    <!-- Recent Activity & Performance -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
      <!-- Recent Content -->
      <div class="card-premium">
        <h2 class="text-lg sm:text-xl font-bold text-white mb-4">{{ t.dashboard.recentContent }}</h2>

        <div v-if="recentContent.length > 0" class="space-y-3">
          <div
            v-for="content in recentContent"
            :key="content.id"
            class="p-4 rounded-xl glass hover:bg-white/10 transition-colors cursor-pointer"
          >
            <div class="flex items-start justify-between mb-2">
              <div class="flex items-center gap-2">
                <span class="px-2 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-medium">
                  {{ content.platform }}
                </span>
                <span class="px-2 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium">
                  {{ content.type }}
                </span>
              </div>
              <div class="flex items-center gap-1 text-yellow-400">
                <Zap :size="16" />
                <span class="text-sm font-medium">{{ content.viralScore }}</span>
              </div>
            </div>
            <p class="text-sm text-gray-300 line-clamp-2">{{ content.content }}</p>
          </div>
        </div>

        <div v-else class="text-center py-8 text-gray-400">
          <Sparkles :size="48" class="mx-auto mb-4 opacity-50" />
          <p>{{ t.dashboard.noContentYet }}</p>
          <p class="text-sm mt-1">{{ t.dashboard.startCreatingContent }}</p>
        </div>
      </div>

      <!-- Team Performance -->
      <div class="card-premium">
        <h2 class="text-xl font-bold text-white mb-4">{{ t.dashboard.teamPerformance }}</h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <span class="text-gray-400">{{ t.dashboard.teamSize }}</span>
            <span class="text-2xl font-bold text-white">{{ stats.teamSize }}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-gray-400">{{ t.dashboard.activeToday }}</span>
            <span class="text-2xl font-bold text-emerald-400">{{ stats.activeToday }}</span>
          </div>

          <div class="flex items-center justify-between">
            <span class="text-gray-400">{{ t.dashboard.totalCommissions }}</span>
            <span class="text-2xl font-bold gradient-text">{{ formatCurrency(stats.commissions) }}</span>
          </div>

          <div class="pt-4 border-t border-white/10">
            <UiGradientButton
              variant="secondary"
              class="w-full"
              @click="router.push('/team')"
            >
              {{ t.dashboard.viewTeamDashboard }}
            </UiGradientButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  DollarSign,
  Users,
  TrendingUp,
  Zap,
  Sparkles,
  MessageSquare,
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useContentStore } from '~/stores/content'
import { useCRMStore } from '~/stores/crm'
import { useAffiliateStore } from '~/stores/affiliate'
import { useTeamStore } from '~/stores/team'
import { useLocale } from '~/composables/useLocale'

definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()
const contentStore = useContentStore()
const crmStore = useCRMStore()
const affiliateStore = useAffiliateStore()
const teamStore = useTeamStore()
const router = useRouter()
const { t } = useLocale()

const loading = ref(true)
const user = computed(() => authStore.userProfile)

// Calculate stats from actual data
const stats = computed(() => {
  const totalRevenue = affiliateStore.totalRevenue
  const totalLeads = crmStore.leads.length
  const wonLeads = crmStore.leads.filter((l) => l.status === 'won').length
  const conversionRate = totalLeads > 0 ? (wonLeads / totalLeads) * 100 : 0

  // Calculate average viral score from content
  const avgViralScore = contentStore.contents.length > 0
    ? contentStore.contents.reduce((sum, c) => sum + c.viralScore, 0) / contentStore.contents.length
    : 0

  return {
    revenue: totalRevenue,
    revenueChange: 12.5, // Calculate from historical data in production
    totalLeads,
    leadsChange: 8.2, // Calculate from historical data in production
    conversionRate: Math.round(conversionRate * 10) / 10,
    conversionChange: 3.1, // Calculate from historical data in production
    viralScore: Math.round(avgViralScore),
    viralScoreChange: 5.5, // Calculate from historical data in production
    teamSize: teamStore.teamMembers.length,
    activeToday: teamStore.activeMembers.length,
    commissions: affiliateStore.paidCommissions,
  }
})

const recentContent = computed(() => contentStore.contents.slice(0, 5))

onMounted(async () => {
  if (user.value) {
    loading.value = true
    try {
      // Load all data in parallel
      await Promise.all([
        contentStore.loadUserContent(user.value.id, 10),
        crmStore.loadLeads(user.value.id),
        affiliateStore.loadAffiliateLinks(user.value.id),
        affiliateStore.loadCommissions(user.value.id),
        user.value.teamId ? teamStore.loadTeam(user.value.teamId) : Promise.resolve(),
      ])
    } catch (error) {
      console.error('Error loading dashboard data:', error)
    } finally {
      loading.value = false
    }
  }
})

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(value)
}
</script>
