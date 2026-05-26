<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold gradient-text mb-2">Analytics Dashboard</h1>
        <p class="text-gray-400">Track your performance and insights</p>
      </div>
      <select
        v-model="timeRange"
        class="px-4 py-2 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500"
      >
        <option value="7d">Last 7 days</option>
        <option value="30d">Last 30 days</option>
        <option value="90d">Last 90 days</option>
        <option value="1y">Last year</option>
      </select>
    </div>

    <!-- Key Metrics -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card-premium">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">Total Revenue</span>
          <TrendingUp :size="20" class="text-emerald-400" />
        </div>
        <p class="text-3xl font-bold gradient-text">${{ metrics.revenue.toLocaleString() }}</p>
        <div class="flex items-center gap-1 mt-2">
          <ArrowUp :size="14" class="text-emerald-400" />
          <span class="text-xs text-emerald-400">+{{ metrics.revenueGrowth }}%</span>
          <span class="text-xs text-gray-500">vs last period</span>
        </div>
      </div>

      <div class="card-premium">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">Content Generated</span>
          <FileText :size="20" class="text-blue-400" />
        </div>
        <p class="text-3xl font-bold text-white">{{ metrics.contentCount }}</p>
        <div class="flex items-center gap-1 mt-2">
          <ArrowUp :size="14" class="text-emerald-400" />
          <span class="text-xs text-emerald-400">+{{ metrics.contentGrowth }}%</span>
          <span class="text-xs text-gray-500">vs last period</span>
        </div>
      </div>

      <div class="card-premium">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">Conversion Rate</span>
          <Target :size="20" class="text-purple-400" />
        </div>
        <p class="text-3xl font-bold text-white">{{ metrics.conversionRate }}%</p>
        <div class="flex items-center gap-1 mt-2">
          <ArrowUp :size="14" class="text-emerald-400" />
          <span class="text-xs text-emerald-400">+{{ metrics.conversionGrowth }}%</span>
          <span class="text-xs text-gray-500">vs last period</span>
        </div>
      </div>

      <div class="card-premium">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">Active Users</span>
          <Users :size="20" class="text-yellow-400" />
        </div>
        <p class="text-3xl font-bold text-white">{{ metrics.activeUsers }}</p>
        <div class="flex items-center gap-1 mt-2">
          <ArrowUp :size="14" class="text-emerald-400" />
          <span class="text-xs text-emerald-400">+{{ metrics.userGrowth }}%</span>
          <span class="text-xs text-gray-500">vs last period</span>
        </div>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Revenue Chart -->
      <div class="card-premium">
        <h2 class="text-xl font-bold text-white mb-4">Revenue Overview</h2>
        <div class="h-64 flex items-end justify-between gap-2">
          <div
            v-for="(value, index) in revenueData"
            :key="index"
            class="flex-1 rounded-t-lg gradient-primary relative group cursor-pointer"
            :style="{ height: `${(value / Math.max(...revenueData)) * 100}%` }"
          >
            <div class="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 px-2 py-1 rounded text-xs text-white whitespace-nowrap">
              ${{ value.toLocaleString() }}
            </div>
          </div>
        </div>
        <div class="flex justify-between mt-4 text-xs text-gray-400">
          <span>Mon</span>
          <span>Tue</span>
          <span>Wed</span>
          <span>Thu</span>
          <span>Fri</span>
          <span>Sat</span>
          <span>Sun</span>
        </div>
      </div>

      <!-- Content Performance -->
      <div class="card-premium">
        <h2 class="text-xl font-bold text-white mb-4">Content Performance</h2>
        <div class="space-y-4">
          <div
            v-for="platform in platformStats"
            :key="platform.name"
            class="flex items-center gap-4"
          >
            <div class="w-12 h-12 rounded-xl gradient-primary flex items-center justify-center">
              <span class="text-sm font-bold text-white">{{ platform.name.slice(0, 2).toUpperCase() }}</span>
            </div>
            <div class="flex-1">
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm font-medium text-white">{{ platform.name }}</span>
                <span class="text-sm font-bold gradient-text">{{ platform.count }}</span>
              </div>
              <div class="h-2 bg-gray-700 rounded-full overflow-hidden">
                <div
                  class="h-full gradient-primary"
                  :style="{ width: `${(platform.count / totalContent) * 100}%` }"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Tables -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Content -->
      <div class="card-premium">
        <h2 class="text-xl font-bold text-white mb-4">🔥 Top Performing Content</h2>
        <div class="space-y-3">
          <div
            v-for="content in topContent"
            :key="content.id"
            class="p-3 rounded-xl glass hover:bg-white/5 transition-colors"
          >
            <div class="flex items-start justify-between gap-3">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 text-xs font-medium">
                    {{ content.platform }}
                  </span>
                  <span class="px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 text-xs font-medium">
                    {{ content.type }}
                  </span>
                </div>
                <p class="text-sm text-gray-300 line-clamp-2">{{ content.preview }}</p>
              </div>
              <div class="flex items-center gap-1 text-yellow-400">
                <Zap :size="16" />
                <span class="text-sm font-bold">{{ content.score }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Traffic Sources -->
      <div class="card-premium">
        <h2 class="text-xl font-bold text-white mb-4">📊 Traffic Sources</h2>
        <div class="space-y-4">
          <div
            v-for="source in trafficSources"
            :key="source.name"
            class="flex items-center justify-between"
          >
            <div class="flex items-center gap-3">
              <div :class="[
                'w-10 h-10 rounded-lg flex items-center justify-center',
                source.color
              ]">
                <component :is="source.icon" :size="20" class="text-white" />
              </div>
              <div>
                <p class="text-sm font-medium text-white">{{ source.name }}</p>
                <p class="text-xs text-gray-400">{{ source.visitors.toLocaleString() }} visitors</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold text-white">{{ source.percentage }}%</p>
              <p class="text-xs text-gray-500">{{ source.conversions }} conversions</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Insights & Recommendations -->
    <div class="card-premium">
      <h2 class="text-xl font-bold text-white mb-4">💡 Insights & Recommendations</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div
          v-for="insight in insights"
          :key="insight.title"
          :class="[
            'p-4 rounded-xl border',
            insight.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30' :
            insight.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/30' :
            'bg-blue-500/10 border-blue-500/30'
          ]"
        >
          <div class="flex items-start gap-3">
            <component
              :is="insight.icon"
              :size="20"
              :class="[
                insight.type === 'success' ? 'text-emerald-400' :
                insight.type === 'warning' ? 'text-yellow-400' :
                'text-blue-400'
              ]"
            />
            <div>
              <h3 class="text-sm font-semibold text-white mb-1">{{ insight.title }}</h3>
              <p class="text-xs text-gray-400">{{ insight.description }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  TrendingUp,
  FileText,
  Target,
  Users,
  ArrowUp,
  Zap,
  Instagram,
  Mail,
  Globe,
  Share2,
  TrendingUp as TrendIcon,
  AlertCircle,
  CheckCircle,
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useAnalyticsStore } from '~/stores/analytics'

definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()
const analyticsStore = useAnalyticsStore()
const timeRange = ref('30d')
const loading = ref(true)

// Load analytics data on mount
onMounted(async () => {
  if (authStore.userProfile) {
    loading.value = true
    try {
      await analyticsStore.loadAnalytics(authStore.userProfile.id, timeRange.value)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      loading.value = false
    }
  }
})

// Watch for time range changes
watch(timeRange, async (newRange) => {
  if (authStore.userProfile) {
    loading.value = true
    try {
      await analyticsStore.loadAnalytics(authStore.userProfile.id, newRange)
    } catch (error) {
      console.error('Error loading analytics:', error)
    } finally {
      loading.value = false
    }
  }
})

// Use store data
const metrics = computed(() => analyticsStore.metrics || {
  revenue: 0,
  revenueGrowth: 0,
  contentCount: 0,
  contentGrowth: 0,
  conversionRate: 0,
  conversionGrowth: 0,
  activeUsers: 0,
  userGrowth: 0,
})

const revenueData = computed(() => analyticsStore.revenueData)

const platformStats = computed(() => analyticsStore.platformStats.map((stat) => ({
  name: stat.platform,
  count: stat.count,
})))

const totalContent = computed(() =>
  platformStats.value.reduce((sum: number, p: any) => sum + p.count, 0)
)

const topContent = computed(() => analyticsStore.topContent.map((content) => ({
  id: content.id,
  platform: content.platform,
  type: content.type,
  preview: content.preview,
  score: content.score,
})))

const trafficSources = computed(() => analyticsStore.trafficSources.map((source) => ({
  name: source.name,
  visitors: source.visitors,
  percentage: source.percentage,
  conversions: source.conversions,
  icon: getIconForSource(source.name),
  color: getColorForSource(source.name),
})))

function getIconForSource(name: string) {
  const iconMap: Record<string, any> = {
    'Instagram': Instagram,
    'Email': Mail,
    'Direct': Globe,
    'Referral': Share2,
  }
  return iconMap[name] || Globe
}

function getColorForSource(name: string) {
  const colorMap: Record<string, string> = {
    'Instagram': 'bg-gradient-to-r from-purple-500 to-pink-500',
    'Email': 'bg-blue-500',
    'Direct': 'bg-emerald-500',
    'Referral': 'bg-yellow-500',
  }
  return colorMap[name] || 'bg-gray-500'
}

const insights = ref([
  {
    type: 'success',
    icon: CheckCircle,
    title: 'Strong Performance',
    description: 'Your TikTok content is performing 34% above average',
  },
  {
    type: 'warning',
    icon: AlertCircle,
    title: 'Attention Needed',
    description: 'LinkedIn engagement dropped 12% this week',
  },
  {
    type: 'info',
    icon: TrendIcon,
    title: 'Growth Opportunity',
    description: 'Consider posting more reels - they get 2.3x engagement',
  },
])
</script>
