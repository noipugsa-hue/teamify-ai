<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-4xl font-bold gradient-text mb-2">Team Management</h1>
      <p class="text-gray-400">Build and manage your network marketing team</p>
    </div>

    <!-- Team Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card-premium">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">Team Size</span>
          <Users :size="20" class="text-blue-400" />
        </div>
        <p class="text-3xl font-bold text-white">{{ teamMembers.length }}</p>
        <p class="text-xs text-gray-500 mt-1">Total members</p>
      </div>

      <div class="card-premium">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">Active Today</span>
          <Activity :size="20" class="text-emerald-400" />
        </div>
        <p class="text-3xl font-bold text-emerald-400">{{ activeToday }}</p>
        <p class="text-xs text-gray-500 mt-1">Online now</p>
      </div>

      <div class="card-premium">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">This Month</span>
          <TrendingUp :size="20" class="text-purple-400" />
        </div>
        <p class="text-3xl font-bold text-white">{{ newMembersThisMonth }}</p>
        <p class="text-xs text-gray-500 mt-1">New members</p>
      </div>

      <div class="card-premium">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">Team Revenue</span>
          <DollarSign :size="20" class="text-yellow-400" />
        </div>
        <p class="text-3xl font-bold gradient-text">${{ totalRevenue.toLocaleString() }}</p>
        <p class="text-xs text-gray-500 mt-1">Total earnings</p>
      </div>
    </div>

    <!-- Team Members -->
    <div class="card-premium">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-bold text-white">Team Members</h2>
        <button
          @click="showInviteModal = true"
          class="px-4 py-2 rounded-xl glass hover:bg-white/10 transition-colors text-white text-sm font-medium"
        >
          <UserPlus :size="16" class="inline mr-2" />
          Invite Member
        </button>
      </div>

      <!-- Search & Filter -->
      <div class="mb-6">
        <div class="relative">
          <Search :size="20" class="absolute left-3 top-3 text-gray-400" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search team members..."
            class="w-full pl-10 pr-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>
      </div>

      <!-- Members Grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="member in filteredMembers"
          :key="member.id"
          class="p-4 rounded-xl glass hover:bg-white/10 transition-colors"
        >
          <div class="flex items-start gap-3">
            <div class="w-12 h-12 rounded-full gradient-primary flex items-center justify-center flex-shrink-0">
              <span class="text-sm font-bold text-white">{{ getInitials(member.name) }}</span>
            </div>

            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <h3 class="text-sm font-semibold text-white truncate">{{ member.name }}</h3>
                <span
                  v-if="member.isOnline"
                  class="w-2 h-2 rounded-full bg-emerald-400 flex-shrink-0"
                  title="Online"
                />
              </div>
              <p class="text-xs text-gray-400 mb-2">{{ member.role }}</p>

              <div class="flex items-center gap-3 text-xs text-gray-500">
                <div class="flex items-center gap-1">
                  <Users :size="12" />
                  <span>{{ member.referrals }} referrals</span>
                </div>
                <div class="flex items-center gap-1">
                  <DollarSign :size="12" />
                  <span>${{ member.revenue.toLocaleString() }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="filteredMembers.length === 0" class="text-center py-16">
        <Users :size="64" class="mx-auto mb-4 text-gray-600" />
        <p class="text-gray-400 mb-2">No team members found</p>
        <p class="text-sm text-gray-500">Start inviting people to build your team!</p>
      </div>
    </div>

    <!-- Team Performance -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Top Performers -->
      <div class="card-premium">
        <h2 class="text-xl font-bold text-white mb-4">🏆 Top Performers</h2>

        <div class="space-y-3">
          <div
            v-for="(performer, index) in topPerformers"
            :key="performer.id"
            class="flex items-center gap-3 p-3 rounded-xl glass"
          >
            <div class="flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 font-bold text-white text-sm">
              {{ index + 1 }}
            </div>

            <div class="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
              <span class="text-sm font-bold text-white">{{ getInitials(performer.name) }}</span>
            </div>

            <div class="flex-1">
              <p class="text-sm font-semibold text-white">{{ performer.name }}</p>
              <p class="text-xs text-gray-400">${{ performer.revenue.toLocaleString() }} revenue</p>
            </div>

            <Award :size="20" class="text-yellow-400" />
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="card-premium">
        <h2 class="text-xl font-bold text-white mb-4">📊 Recent Activity</h2>

        <div class="space-y-3">
          <div
            v-for="activity in recentActivity"
            :key="activity.id"
            class="flex items-start gap-3 p-3 rounded-xl glass"
          >
            <div :class="[
              'w-10 h-10 rounded-full flex items-center justify-center',
              activity.type === 'join' ? 'bg-blue-500/20' : activity.type === 'sale' ? 'bg-emerald-500/20' : 'bg-purple-500/20'
            ]">
              <component
                :is="activity.icon"
                :size="20"
                :class="[
                  activity.type === 'join' ? 'text-blue-400' : activity.type === 'sale' ? 'text-emerald-400' : 'text-purple-400'
                ]"
              />
            </div>

            <div class="flex-1">
              <p class="text-sm text-white">{{ activity.message }}</p>
              <p class="text-xs text-gray-500 mt-1">{{ activity.time }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Invite Member Modal -->
    <div
      v-if="showInviteModal"
      class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      @click.self="showInviteModal = false"
    >
      <div class="card-premium max-w-lg w-full" @click.stop>
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-2xl font-bold text-white">Invite Team Member</h3>
          <button
            @click="showInviteModal = false"
            class="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="text-gray-400">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Your Referral Link
            </label>
            <div class="flex gap-2">
              <input
                type="text"
                :value="referralLink"
                readonly
                class="flex-1 px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-gray-500 focus:outline-none"
              />
              <button
                @click="copyReferralLink"
                class="px-4 py-3 rounded-xl gradient-primary text-white font-medium hover:opacity-90 transition-opacity"
              >
                {{ copied ? 'Copied!' : 'Copy' }}
              </button>
            </div>
            <p class="text-xs text-gray-400 mt-2">
              Share this link with people you want to invite to your team
            </p>
          </div>

          <div class="pt-4 border-t border-white/10">
            <h4 class="text-sm font-medium text-white mb-3">Share via</h4>
            <div class="grid grid-cols-4 gap-3">
              <button
                @click="shareVia('facebook')"
                class="p-3 rounded-xl glass hover:bg-white/10 transition-colors text-center"
              >
                <div class="w-10 h-10 mx-auto mb-2 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <span class="text-blue-400 font-bold">f</span>
                </div>
                <span class="text-xs text-gray-400">Facebook</span>
              </button>
              <button
                @click="shareVia('twitter')"
                class="p-3 rounded-xl glass hover:bg-white/10 transition-colors text-center"
              >
                <div class="w-10 h-10 mx-auto mb-2 rounded-full bg-sky-500/20 flex items-center justify-center">
                  <span class="text-sky-400 font-bold">𝕏</span>
                </div>
                <span class="text-xs text-gray-400">Twitter</span>
              </button>
              <button
                @click="shareVia('tiktok')"
                class="p-3 rounded-xl glass hover:bg-white/10 transition-colors text-center"
              >
                <div class="w-10 h-10 mx-auto mb-2 rounded-full bg-pink-500/20 flex items-center justify-center">
                  <span class="text-pink-400 font-bold">♪</span>
                </div>
                <span class="text-xs text-gray-400">TikTok</span>
              </button>
              <button
                @click="shareVia('email')"
                class="p-3 rounded-xl glass hover:bg-white/10 transition-colors text-center"
              >
                <div class="w-10 h-10 mx-auto mb-2 rounded-full bg-gray-500/20 flex items-center justify-center">
                  <span class="text-gray-400 font-bold">✉</span>
                </div>
                <span class="text-xs text-gray-400">Email</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Users,
  Activity,
  TrendingUp,
  DollarSign,
  UserPlus,
  Search,
  Award,
  UserCheck,
  ShoppingCart,
  Zap,
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useTeamStore } from '~/stores/team'

definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()
const teamStore = useTeamStore()
const searchQuery = ref('')
const loading = ref(true)
const showInviteModal = ref(false)
const copied = ref(false)

// Load team data on mount
onMounted(async () => {
  if (authStore.userProfile?.teamId) {
    loading.value = true
    try {
      await teamStore.loadTeam(authStore.userProfile.teamId)
    } catch (error) {
      console.error('Error loading team:', error)
    } finally {
      loading.value = false
    }
  } else {
    loading.value = false
  }
})

function isUserOnline(lastActiveDate: any) {
  if (!lastActiveDate) return false
  const now = new Date()
  const lastActive = lastActiveDate.toDate ? lastActiveDate.toDate() : new Date(lastActiveDate)
  const diffMinutes = (now.getTime() - lastActive.getTime()) / (1000 * 60)
  return diffMinutes < 15 // Online if active in last 15 minutes
}

// Convert team members from store to display format
const teamMembers = computed(() => {
  return teamStore.teamMembers.map((member: any) => ({
    id: member.id,
    name: member.displayName,
    role: member.role === 'team_leader' ? 'Team Leader' : member.role === 'admin' ? 'Admin' : 'Affiliate',
    referrals: member.stats?.totalSales || 0,
    revenue: member.stats?.totalCommissions || 0,
    isOnline: isUserOnline(member.gamification?.lastActiveDate),
  }))
})

const filteredMembers = computed(() => {
  if (!searchQuery.value) return teamMembers.value

  const query = searchQuery.value.toLowerCase()
  return teamMembers.value.filter((member: any) =>
    member.name.toLowerCase().includes(query) ||
    member.role.toLowerCase().includes(query)
  )
})

const activeToday = computed(() =>
  teamMembers.value.filter((m: any) => m.isOnline).length
)

const newMembersThisMonth = computed(() => {
  const now = new Date()
  const oneMonthAgo = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate())

  return teamStore.teamMembers.filter((member: any) => {
    const createdAt = member.createdAt?.toDate ? member.createdAt.toDate() : new Date(member.createdAt)
    return createdAt >= oneMonthAgo
  }).length
})

const totalRevenue = computed(() =>
  teamMembers.value.reduce((sum: number, m: any) => sum + m.revenue, 0)
)

const topPerformers = computed(() =>
  [...teamMembers.value]
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5)
)

const recentActivity = ref([
  {
    id: '1',
    type: 'join',
    icon: UserCheck,
    message: 'Tom Anderson joined your team',
    time: '2 hours ago',
  },
  {
    id: '2',
    type: 'sale',
    icon: ShoppingCart,
    message: 'Emily Davis made a $450 sale',
    time: '5 hours ago',
  },
  {
    id: '3',
    type: 'achievement',
    icon: Zap,
    message: 'Sarah Johnson reached Silver rank',
    time: '1 day ago',
  },
])

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Referral Link
const referralLink = computed(() => {
  const baseUrl = window.location.origin
  const referralCode = authStore.userProfile?.referralCode || 'YOUR_CODE'
  return `${baseUrl}/ref/${referralCode}`
})

// Copy Referral Link
async function copyReferralLink() {
  try {
    await navigator.clipboard.writeText(referralLink.value)
    copied.value = true
    setTimeout(() => {
      copied.value = false
    }, 2000)
  } catch (error) {
    console.error('Failed to copy:', error)
  }
}

// Share via social media
function shareVia(platform: 'facebook' | 'twitter' | 'tiktok' | 'email') {
  const url = encodeURIComponent(referralLink.value)
  const text = encodeURIComponent('Join my team and start earning together!')

  if (platform === 'tiktok') {
    // TikTok doesn't have a direct share URL, so copy link and show instruction
    copyReferralLink()
    alert('Link copied! Open TikTok app and paste the link in your video description or bio.')
    return
  }

  const shareUrls = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
    twitter: `https://twitter.com/intent/tweet?text=${text}&url=${url}`,
    email: `mailto:?subject=Join My Team&body=${text}%0A%0A${url}`,
  }

  window.open(shareUrls[platform as keyof typeof shareUrls], '_blank', 'width=600,height=400')
}
</script>
