<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold gradient-text mb-2">CRM & Leads</h1>
        <p class="text-gray-400">Manage your leads and track your sales pipeline</p>
      </div>
      <UiGradientButton
        variant="primary"
        @click="showAddLeadModal = true"
      >
        <Plus :size="20" class="mr-2" />
        Add Lead
      </UiGradientButton>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="card-premium">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">New Leads</span>
          <UserPlus :size="20" class="text-blue-400" />
        </div>
        <p class="text-3xl font-bold text-white">{{ crmStore.newLeads.length }}</p>
      </div>

      <div class="card-premium">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">Qualified</span>
          <CheckCircle :size="20" class="text-emerald-400" />
        </div>
        <p class="text-3xl font-bold text-white">{{ crmStore.qualifiedLeads.length }}</p>
      </div>

      <div class="card-premium">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">Hot Leads</span>
          <Flame :size="20" class="text-orange-400" />
        </div>
        <p class="text-3xl font-bold text-white">{{ crmStore.hotLeads.length }}</p>
      </div>

      <div class="card-premium">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">Total Leads</span>
          <Users :size="20" class="text-purple-400" />
        </div>
        <p class="text-3xl font-bold gradient-text">{{ crmStore.leads.length }}</p>
      </div>
    </div>

    <!-- Filters & Search -->
    <div class="card-premium">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <div class="relative">
            <Search :size="20" class="absolute left-3 top-3 text-gray-400" />
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search leads by name, email, or phone..."
              class="w-full pl-10 pr-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
        </div>

        <select
          v-model="statusFilter"
          class="px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors"
        >
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="qualified">Qualified</option>
          <option value="negotiating">Negotiating</option>
          <option value="won">Won</option>
          <option value="lost">Lost</option>
          <option value="nurturing">Nurturing</option>
        </select>
      </div>
    </div>

    <!-- Leads Table -->
    <div class="card-premium overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead>
            <tr class="border-b border-white/10">
              <th class="text-left p-4 text-sm font-medium text-gray-400">Name</th>
              <th class="text-left p-4 text-sm font-medium text-gray-400">Contact</th>
              <th class="text-left p-4 text-sm font-medium text-gray-400">Platform</th>
              <th class="text-left p-4 text-sm font-medium text-gray-400">Status</th>
              <th class="text-left p-4 text-sm font-medium text-gray-400">Score</th>
              <th class="text-left p-4 text-sm font-medium text-gray-400">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="lead in filteredLeads"
              :key="lead.id"
              class="border-b border-white/5 hover:bg-white/5 transition-colors"
            >
              <td class="p-4">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full gradient-primary flex items-center justify-center">
                    <span class="text-sm font-bold text-white">{{ getInitials(lead.name) }}</span>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-white">{{ lead.name }}</p>
                    <p class="text-xs text-gray-400">{{ lead.source }}</p>
                  </div>
                </div>
              </td>
              <td class="p-4">
                <p class="text-sm text-gray-300">{{ lead.email || '-' }}</p>
                <p class="text-xs text-gray-400">{{ lead.phone || '-' }}</p>
              </td>
              <td class="p-4">
                <span class="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-medium">
                  {{ lead.platform }}
                </span>
              </td>
              <td class="p-4">
                <select
                  :value="lead.status"
                  @change="updateLeadStatus(lead.id, ($event.target as HTMLSelectElement).value as LeadStatus)"
                  class="px-3 py-1 rounded-lg glass border border-white/10 text-white text-xs focus:outline-none focus:border-purple-500"
                >
                  <option value="new">New</option>
                  <option value="contacted">Contacted</option>
                  <option value="qualified">Qualified</option>
                  <option value="negotiating">Negotiating</option>
                  <option value="won">Won</option>
                  <option value="lost">Lost</option>
                  <option value="nurturing">Nurturing</option>
                </select>
              </td>
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <div class="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                      :style="{ width: `${lead.score}%` }"
                      :class="[
                        'h-full transition-all',
                        lead.score >= 70 ? 'bg-emerald-500' : lead.score >= 40 ? 'bg-yellow-500' : 'bg-red-500'
                      ]"
                    />
                  </div>
                  <span class="text-sm font-medium text-white w-8">{{ lead.score }}</span>
                </div>
              </td>
              <td class="p-4">
                <div class="flex items-center gap-2">
                  <button
                    @click="viewLead(lead)"
                    class="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
                    title="View Details"
                  >
                    <Eye :size="16" class="text-gray-400" />
                  </button>
                  <button
                    @click="addNoteToLead(lead)"
                    class="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
                    title="Add Note"
                  >
                    <FileText :size="16" class="text-gray-400" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Empty State -->
        <div v-if="filteredLeads.length === 0" class="text-center py-16">
          <Users :size="64" class="mx-auto mb-4 text-gray-600" />
          <p class="text-gray-400 mb-2">No leads found</p>
          <p class="text-sm text-gray-500">Add your first lead to get started!</p>
        </div>
      </div>
    </div>

    <!-- Add Lead Modal -->
    <UiModal v-model="showAddLeadModal" title="Add New Lead">
      <form @submit.prevent="handleAddLead" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Name *</label>
          <input
            v-model="newLead.name"
            type="text"
            required
            class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input
              v-model="newLead.email"
              type="email"
              class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Phone</label>
            <input
              v-model="newLead.phone"
              type="tel"
              class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Platform</label>
            <select
              v-model="newLead.platform"
              class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="tiktok">TikTok</option>
              <option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option>
              <option value="linkedin">LinkedIn</option>
              <option value="twitter">Twitter/X</option>
              <option value="youtube">YouTube</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">Source</label>
            <input
              v-model="newLead.source"
              type="text"
              placeholder="e.g., Instagram DM, Website"
              class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-300 mb-2">Tags (comma separated)</label>
          <input
            v-model="newLead.tagsInput"
            type="text"
            placeholder="hot-lead, interested, follow-up"
            class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500"
          />
        </div>

        <div class="flex gap-3 pt-4">
          <UiGradientButton
            type="submit"
            variant="primary"
            class="flex-1"
            :loading="adding"
          >
            Add Lead
          </UiGradientButton>
          <button
            type="button"
            @click="showAddLeadModal = false"
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
  Users,
  Plus,
  UserPlus,
  CheckCircle,
  Flame,
  Search,
  Eye,
  FileText,
} from 'lucide-vue-next'
import { useCRMStore } from '~/stores/crm'
import { useAuthStore } from '~/stores/auth'
import type { Lead, LeadStatus, Platform } from '~/types'

definePageMeta({
  middleware: 'auth',
})

const crmStore = useCRMStore()
const authStore = useAuthStore()

const searchQuery = ref('')
const statusFilter = ref('all')
const showAddLeadModal = ref(false)
const adding = ref(false)

const newLead = ref({
  name: '',
  email: '',
  phone: '',
  platform: 'instagram' as Platform,
  source: '',
  tagsInput: '',
})

const filteredLeads = computed(() => {
  let leads = crmStore.leads

  // Status filter
  if (statusFilter.value !== 'all') {
    leads = leads.filter((lead: Lead) => lead.status === statusFilter.value)
  }

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    leads = leads.filter(
      (lead: Lead) =>
        lead.name.toLowerCase().includes(query) ||
        lead.email?.toLowerCase().includes(query) ||
        lead.phone?.toLowerCase().includes(query)
    )
  }

  return leads
})

onMounted(async () => {
  if (authStore.userProfile) {
    await crmStore.loadLeads(authStore.userProfile.id)
  }
})

async function handleAddLead() {
  if (!authStore.userProfile) return

  adding.value = true

  try {
    const tags = newLead.value.tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t)

    await crmStore.addLead({
      userId: authStore.userProfile.id,
      name: newLead.value.name,
      email: newLead.value.email || undefined,
      phone: newLead.value.phone || undefined,
      platform: newLead.value.platform,
      source: newLead.value.source || 'Direct',
      status: 'new',
      score: 50,
      tags,
      notes: [],
      interactions: [],
    })

    showAddLeadModal.value = false
    newLead.value = {
      name: '',
      email: '',
      phone: '',
      platform: 'instagram',
      source: '',
      tagsInput: '',
    }
  } catch (error) {
    console.error('Failed to add lead:', error)
  } finally {
    adding.value = false
  }
}

async function updateLeadStatus(leadId: string, status: LeadStatus) {
  try {
    await crmStore.updateLeadStatus(leadId, status)
  } catch (error) {
    console.error('Failed to update lead status:', error)
  }
}

function viewLead(lead: Lead) {
  // TODO: Implement lead detail view
  console.log('View lead:', lead)
}

function addNoteToLead(lead: Lead) {
  // TODO: Implement add note modal
  console.log('Add note to lead:', lead)
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
</script>
