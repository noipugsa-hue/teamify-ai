<template>
  <div class="space-y-8">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-4xl font-bold gradient-text mb-2">Automation</h1>
        <p class="text-gray-400">Automate your workflows and save time</p>
      </div>
      <UiGradientButton
        variant="primary"
        @click="showCreateWorkflowModal = true"
      >
        <Plus :size="20" class="mr-2" />
        Create Workflow
      </UiGradientButton>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div class="card-premium">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">Active Workflows</span>
          <Zap :size="20" class="text-purple-400" />
        </div>
        <p class="text-3xl font-bold text-white">{{ activeWorkflows }}</p>
      </div>

      <div class="card-premium">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">Tasks Automated</span>
          <CheckCircle :size="20" class="text-emerald-400" />
        </div>
        <p class="text-3xl font-bold text-white">{{ tasksAutomated.toLocaleString() }}</p>
      </div>

      <div class="card-premium">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">Time Saved</span>
          <Clock :size="20" class="text-blue-400" />
        </div>
        <p class="text-3xl font-bold gradient-text">{{ timeSaved }}h</p>
      </div>

      <div class="card-premium">
        <div class="flex items-center justify-between mb-2">
          <span class="text-sm text-gray-400">Success Rate</span>
          <TrendingUp :size="20" class="text-yellow-400" />
        </div>
        <p class="text-3xl font-bold text-white">{{ successRate }}%</p>
      </div>
    </div>

    <!-- Workflow Templates -->
    <div class="card-premium">
      <h2 class="text-xl font-bold text-white mb-4">📋 Workflow Templates</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div
          v-for="template in templates"
          :key="template.id"
          class="p-4 rounded-xl glass hover:bg-white/5 transition-colors cursor-pointer group"
          @click="useTemplate(template)"
        >
          <div class="flex items-start justify-between mb-3">
            <div :class="[
              'w-12 h-12 rounded-xl flex items-center justify-center',
              template.color
            ]">
              <component :is="template.icon" :size="24" class="text-white" />
            </div>
            <span class="px-2 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-xs font-medium">
              {{ template.category }}
            </span>
          </div>

          <h3 class="text-lg font-semibold text-white mb-2 group-hover:text-purple-400 transition-colors">
            {{ template.name }}
          </h3>
          <p class="text-sm text-gray-400 mb-3">{{ template.description }}</p>

          <div class="flex items-center justify-between text-xs text-gray-500">
            <span>{{ template.tasks }} tasks</span>
            <span>{{ template.popularity }} users</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Workflows -->
    <div class="card-premium">
      <h2 class="text-xl font-bold text-white mb-6">⚡ Your Active Workflows</h2>

      <div class="space-y-4">
        <div
          v-for="workflow in workflows"
          :key="workflow.id"
          class="p-4 rounded-xl glass hover:bg-white/5 transition-colors"
        >
          <div class="flex items-start justify-between gap-4">
            <div class="flex-1">
              <div class="flex items-center gap-3 mb-2">
                <h3 class="text-lg font-semibold text-white">{{ workflow.name }}</h3>
                <span
                  :class="[
                    'px-2 py-1 rounded-lg text-xs font-medium',
                    workflow.status === 'active' ? 'bg-emerald-500/20 text-emerald-400' :
                    workflow.status === 'paused' ? 'bg-yellow-500/20 text-yellow-400' :
                    'bg-gray-500/20 text-gray-400'
                  ]"
                >
                  {{ workflow.status }}
                </span>
              </div>

              <p class="text-sm text-gray-400 mb-3">{{ workflow.description }}</p>

              <div class="flex items-center gap-6 text-sm">
                <div class="flex items-center gap-2 text-gray-400">
                  <Play :size="14" />
                  <span>{{ workflow.executions }} executions</span>
                </div>
                <div class="flex items-center gap-2 text-emerald-400">
                  <CheckCircle :size="14" />
                  <span>{{ workflow.successRate }}% success</span>
                </div>
                <div class="flex items-center gap-2 text-gray-400">
                  <Calendar :size="14" />
                  <span>Last run: {{ workflow.lastRun }}</span>
                </div>
              </div>
            </div>

            <div class="flex items-center gap-2">
              <button
                @click="editWorkflow(workflow)"
                class="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
                title="Edit"
              >
                <Edit :size="16" class="text-gray-400" />
              </button>
              <button
                @click="toggleWorkflow(workflow)"
                class="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
                :title="workflow.status === 'active' ? 'Pause' : 'Resume'"
              >
                <component :is="workflow.status === 'active' ? Pause : Play" :size="16" class="text-gray-400" />
              </button>
              <button
                class="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
                title="Delete"
              >
                <Trash2 :size="16" class="text-red-400" />
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="workflows.length === 0" class="text-center py-16">
        <Zap :size="64" class="mx-auto mb-4 text-gray-600" />
        <p class="text-gray-400 mb-2">No workflows yet</p>
        <p class="text-sm text-gray-500">Create your first workflow to automate your tasks!</p>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="card-premium">
      <h2 class="text-xl font-bold text-white mb-6">📊 Recent Activity</h2>
      <div class="space-y-3">
        <div
          v-for="activity in recentActivity"
          :key="activity.id"
          class="flex items-start gap-3 p-3 rounded-xl glass"
        >
          <div :class="[
            'w-10 h-10 rounded-full flex items-center justify-center',
            activity.type === 'success' ? 'bg-emerald-500/20' :
            activity.type === 'error' ? 'bg-red-500/20' :
            'bg-blue-500/20'
          ]">
            <component
              :is="activity.icon"
              :size="20"
              :class="[
                activity.type === 'success' ? 'text-emerald-400' :
                activity.type === 'error' ? 'text-red-400' :
                'text-blue-400'
              ]"
            />
          </div>

          <div class="flex-1">
            <p class="text-sm text-white mb-1">{{ activity.message }}</p>
            <div class="flex items-center gap-3 text-xs text-gray-500">
              <span>{{ activity.workflow }}</span>
              <span>•</span>
              <span>{{ activity.time }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Workflow Modal -->
    <UiModal v-model="showCreateWorkflowModal" title="Create Workflow">
      <div class="space-y-4">
        <p class="text-sm text-gray-400">
          Choose a template to get started quickly, or create a custom workflow from scratch.
        </p>

        <div class="grid grid-cols-2 gap-3">
          <button
            class="p-4 rounded-xl glass hover:bg-white/10 transition-colors text-left"
            @click="startFromTemplate"
          >
            <FileText :size="24" class="text-purple-400 mb-2" />
            <p class="text-sm font-semibold text-white">Use Template</p>
            <p class="text-xs text-gray-400 mt-1">Start with a pre-built workflow</p>
          </button>

          <button
            class="p-4 rounded-xl glass hover:bg-white/10 transition-colors text-left"
            @click="startFromScratch"
          >
            <Plus :size="24" class="text-blue-400 mb-2" />
            <p class="text-sm font-semibold text-white">From Scratch</p>
            <p class="text-xs text-gray-400 mt-1">Build a custom workflow</p>
          </button>
        </div>
      </div>
    </UiModal>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  Plus,
  Zap,
  CheckCircle,
  Clock,
  TrendingUp,
  Mail,
  MessageSquare,
  Bell,
  Edit,
  Play,
  Pause,
  Trash2,
  Calendar,
  FileText,
  AlertCircle,
  XCircle,
} from 'lucide-vue-next'
import { useAuthStore } from '~/stores/auth'
import { useAutomationStore } from '~/stores/automation'

definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()
const automationStore = useAutomationStore()
const showCreateWorkflowModal = ref(false)
const loading = ref(true)

// Load automation data on mount
onMounted(async () => {
  if (authStore.userProfile) {
    loading.value = true
    try {
      await Promise.all([
        automationStore.loadWorkflows(authStore.userProfile.id),
        automationStore.loadTemplates(),
        automationStore.loadExecutions(authStore.userProfile.id),
      ])
    } catch (error) {
      console.error('Error loading automation data:', error)
    } finally {
      loading.value = false
    }
  }
})

// Use store getters
const activeWorkflows = computed(() => automationStore.activeWorkflows.length)
const tasksAutomated = computed(() => automationStore.totalExecutions)
const timeSaved = computed(() => Math.round(automationStore.totalExecutions / 10)) // Estimate: 10 tasks = 1 hour saved
const successRate = computed(() => automationStore.successRate)

// Map templates from store with icons
const templates = computed(() => {
  const iconMap: Record<string, any> = {
    'Email': Mail,
    'Messaging': MessageSquare,
    'Notification': Bell,
    'CRM': FileText,
    'Social': Zap,
  }

  return automationStore.templates.map((template) => ({
    ...template,
    icon: iconMap[template.category] || Mail,
  }))
})

// Get workflows from store
const workflows = computed(() => automationStore.workflows.map((workflow) => ({
  ...workflow,
  successRate: workflow.executions > 0
    ? Math.round((workflow.successCount / workflow.executions) * 100)
    : 0,
  lastRun: formatDate(workflow.lastRun),
})))

// Recent activity from executions
const recentActivity = computed(() => {
  const iconMap: Record<string, any> = {
    'success': CheckCircle,
    'failed': XCircle,
    'running': AlertCircle,
  }

  return automationStore.recentExecutions.map((execution) => ({
    id: execution.id,
    type: execution.status,
    icon: iconMap[execution.status] || AlertCircle,
    message: execution.message,
    workflow: automationStore.workflows.find((w) => w.id === execution.workflowId)?.name || 'Unknown',
    time: formatDate(execution.startedAt),
  }))
})

function formatDate(timestamp: any) {
  if (!timestamp) return 'Never'
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 60) return `${minutes} minutes ago`
  if (hours < 24) return `${hours} hours ago`
  return `${days} days ago`
}

function useTemplate(template: any) {
  console.log('Use template:', template)
  // TODO: Implement template usage
}

function editWorkflow(workflow: any) {
  console.log('Edit workflow:', workflow)
  // TODO: Implement workflow editing
}

async function toggleWorkflow(workflow: any) {
  try {
    await automationStore.toggleWorkflowStatus(workflow.id)
  } catch (error) {
    console.error('Failed to toggle workflow:', error)
  }
}

function startFromTemplate() {
  showCreateWorkflowModal.value = false
  // TODO: Show template selection
}

function startFromScratch() {
  showCreateWorkflowModal.value = false
  // TODO: Show workflow builder
}
</script>
