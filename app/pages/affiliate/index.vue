<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold gradient-text mb-2">Affiliate Dashboard</h1>
        <p class="text-gray-400">Track your affiliate links and commissions</p>
      </div>
      <UiGradientButton
        variant="primary"
        @click="showCreateLinkModal = true"
      >
        <Plus :size="20" class="mr-2" />
        Create Link
      </UiGradientButton>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card-premium">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">Total Clicks</span>
          <MousePointerClick :size="20" class="text-blue-400" />
        </div>
        <p class="text-3xl font-bold text-white">{{ totalClicks.toLocaleString() }}</p>
        <p class="text-xs text-emerald-400 mt-1">+12.5% vs last month</p>
      </div>

      <div class="card-premium">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">Conversions</span>
          <CheckCircle :size="20" class="text-emerald-400" />
        </div>
        <p class="text-3xl font-bold text-white">{{ totalConversions }}</p>
        <p class="text-xs text-gray-400 mt-1">{{ conversionRate }}% conversion rate</p>
      </div>

      <div class="card-premium">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">Revenue</span>
          <DollarSign :size="20" class="text-yellow-400" />
        </div>
        <p class="text-3xl font-bold gradient-text">${{ totalRevenue.toLocaleString() }}</p>
        <p class="text-xs text-emerald-400 mt-1">+$1,240 this month</p>
      </div>

      <div class="card-premium">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">Pending</span>
          <Clock :size="20" class="text-orange-400" />
        </div>
        <p class="text-3xl font-bold text-white">${{ pendingCommissions.toLocaleString() }}</p>
        <p class="text-xs text-gray-400 mt-1">Awaiting approval</p>
      </div>
    </div>

    <!-- Referral Code -->
    <div class="card-premium">
      <h2 class="text-xl font-bold text-white mb-4">Your Referral Code</h2>
      <div class="flex items-center gap-4">
        <div class="flex-1 p-4 rounded-xl glass border border-purple-500/30">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm text-gray-400 mb-1">Referral Code</p>
              <p class="text-2xl font-bold gradient-text">{{ referralCode }}</p>
            </div>
            <button
              @click="copyReferralCode"
              class="px-4 py-2 rounded-lg gradient-primary text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
            >
              <Copy :size="16" />
              Copy
            </button>
          </div>
        </div>

        <div class="p-4 rounded-xl glass text-center">
          <p class="text-sm text-gray-400 mb-1">Total Referrals</p>
          <p class="text-3xl font-bold text-white">{{ totalReferrals }}</p>
        </div>
      </div>
    </div>

    <!-- Affiliate Links -->
    <div class="card-premium">
      <h2 class="text-xl font-bold text-white mb-6">Your Affiliate Links</h2>

      <div class="space-y-3">
        <div
          v-for="link in affiliateStore.links"
          :key="link.id"
          class="p-4 rounded-xl glass hover:bg-white/5 transition-colors"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold text-white">{{ link.name }}</h3>
                <span
                  :class="[
                    'px-2 py-1 rounded-lg text-xs font-medium',
                    link.active ? 'bg-emerald-500/20 text-emerald-400' : 'bg-gray-500/20 text-gray-400'
                  ]"
                >
                  {{ link.active ? 'Active' : 'Inactive' }}
                </span>
              </div>

              <div class="flex items-center gap-2 mb-3">
                <Link2 :size="14" class="text-gray-500" />
                <p class="text-sm text-gray-400 truncate">{{ link.url }}</p>
                <button
                  @click="copyLink(link.url)"
                  class="p-1 rounded hover:bg-white/10 transition-colors"
                  title="Copy Link"
                >
                  <Copy :size="14" class="text-gray-400" />
                </button>
              </div>

              <div class="flex items-center gap-6 text-sm">
                <div class="flex items-center gap-2 text-gray-400">
                  <MousePointerClick :size="14" />
                  <span>{{ link.clicks }} clicks</span>
                </div>
                <div class="flex items-center gap-2 text-emerald-400">
                  <CheckCircle :size="14" />
                  <span>{{ link.conversions }} conversions</span>
                </div>
                <div class="flex items-center gap-2 text-yellow-400">
                  <DollarSign :size="14" />
                  <span>${{ link.revenue.toLocaleString() }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="editLink(link)"
                class="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
                title="Edit"
              >
                <Edit :size="16" class="text-gray-400" />
              </button>
              <button
                @click="toggleLinkStatus(link)"
                class="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
                :title="link.active ? 'Deactivate' : 'Activate'"
              >
                <component :is="link.active ? EyeOff : Eye" :size="16" class="text-gray-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="affiliateStore.links.length === 0" class="text-center py-16">
        <Link2 :size="64" class="mx-auto mb-4 text-gray-600" />
        <p class="text-gray-400 mb-2">No affiliate links yet</p>
        <p class="text-sm text-gray-500">Create your first link to start earning!</p>
      </div>
    </div>

    <!-- Commission History -->
    <div class="card-premium">
      <h2 class="text-xl font-bold text-white mb-6">Commission History</h2>

      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/10">
              <th class="text-left p-3 text-sm font-medium text-gray-400">Date</th>
              <th class="text-left p-3 text-sm font-medium text-gray-400">Description</th>
              <th class="text-left p-3 text-sm font-medium text-gray-400">Amount</th>
              <th class="text-left p-3 text-sm font-medium text-gray-400">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="commission in commissionHistory"
              :key="commission.id"
              class="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td class="p-3 text-sm text-gray-300">{{ commission.date }}</td>
              <td class="p-3 text-sm text-white">{{ commission.description }}</td>
              <td class="p-3 text-sm font-semibold text-emerald-400">${{ commission.amount }}</td>
              <td class="p-3">
                <span
                  :class="[
                    'px-3 py-1 rounded-lg text-xs font-medium',
                    commission.status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' :
                    commission.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-red-500/20 text-red-400'
                  ]"
                >
                  {{ commission.status }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Create Link Modal -->
    <UiModal v-model="showCreateLinkModal" title="Create Affiliate Link">
      <form @submit.prevent="handleCreateLink" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Link Name *</label>
          <input
            v-model="newLink.name"
            type="text"
            required
            placeholder="e.g., Instagram Bio Link"
            class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Campaign/Source</label>
          <input
            v-model="newLink.campaign"
            type="text"
            placeholder="e.g., Instagram, TikTok, Email"
            class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div class="flex gap-3 pt-4">
          <UiGradientButton
            type="submit"
            variant="primary"
            class="flex-1"
            :loading="creating"
          >
            Create Link
          </UiGradientButton>
          <button
            type="button"
            @click="showCreateLinkModal = false"
            class="flex-1 px-6 py-3 rounded-xl glass hover:bg-white/10 transition-colors text-white font-semibold"
          >
            Cancel
          </button>
        </div>
      </form>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Plus,
  MousePointerClick,
  CheckCircle,
  DollarSign,
  Clock,
  Copy,
  Link2,
  Edit,
  Eye,
  EyeOff,
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useAffiliateStore } from '~/stores/affiliate'

definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()
const affiliateStore = useAffiliateStore()
const loading = ref(true)

// Load affiliate data on mount
onMounted(async () => {
  if (authStore.userProfile) {
    loading.value = true
    try {
      await Promise.all([
        affiliateStore.loadAffiliateLinks(authStore.userProfile.id),
        affiliateStore.loadCommissions(authStore.userProfile.id),
      ])
    } catch (error) {
      console.error('Error loading affiliate data:', error)
    } finally {
      loading.value = false
    }
  }
})

// Get data from store
const referralCode = computed(() => authStore.userProfile?.referralCode || '')
const totalReferrals = computed(() => {
  // Count total referrals from commissions
  return affiliateStore.commissions.length
})

const showCreateLinkModal = ref(false)
const creating = ref(false)
const newLink = ref({
  name: '',
  campaign: '',
})

// Use store getters
const totalClicks = computed(() => affiliateStore.totalClicks)
const totalConversions = computed(() => affiliateStore.totalConversions)
const totalRevenue = computed(() => affiliateStore.totalRevenue)
const conversionRate = computed(() => affiliateStore.conversionRate)
const pendingCommissions = computed(() => affiliateStore.pendingCommissions)

// Format commissions for display
const commissionHistory = computed(() => {
  return affiliateStore.commissions.slice(0, 10).map((commission) => ({
    id: commission.id,
    date: formatDate(commission.date),
    description: commission.description,
    amount: commission.amount,
    status: commission.status,
  }))
})

function formatDate(timestamp: any) {
  if (!timestamp) return ''
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })
}

function copyReferralCode() {
  navigator.clipboard.writeText(referralCode.value)
  // TODO: Show toast notification
  console.log('Referral code copied!')
}

function copyLink(url: string) {
  navigator.clipboard.writeText(url)
  // TODO: Show toast notification
  console.log('Link copied!')
}

function editLink(link: any) {
  // TODO: Implement edit modal
  console.log('Edit link:', link)
}

async function toggleLinkStatus(link: any) {
  try {
    await affiliateStore.toggleLinkStatus(link.id)
  } catch (error) {
    console.error('Failed to toggle link status:', error)
  }
}

async function handleCreateLink() {
  if (!authStore.userProfile) return

  creating.value = true

  try {
    await affiliateStore.createAffiliateLink(
      authStore.userProfile.id,
      newLink.value.name,
      newLink.value.campaign
    )

    showCreateLinkModal.value = false
    newLink.value = { name: '', campaign: '' }
  } catch (error) {
    console.error('Failed to create link:', error)
  } finally {
    creating.value = false
  }
}
</script>
