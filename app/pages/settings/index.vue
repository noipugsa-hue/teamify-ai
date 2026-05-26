<template>
  <div class="space-y-8">
    <!-- Success Toast -->
    <div
      v-if="saveSuccess"
      class="fixed top-4 right-4 z-50 px-6 py-3 rounded-xl bg-emerald-500/20 border border-emerald-500/30 backdrop-blur-sm flex items-center gap-3 animate-slide-in"
    >
      <div class="w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="w-3 h-3 text-white" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
        </svg>
      </div>
      <p class="text-sm font-medium text-emerald-400">{{ t.settings.savedSuccessfully }}</p>
    </div>

    <!-- Header -->
    <div>
      <h1 class="text-4xl font-bold gradient-text mb-2">{{ t.settings.title }}</h1>
      <p class="text-gray-400">{{ t.settings.subtitle }}</p>
    </div>

    <!-- Settings Tabs -->
    <div class="flex gap-2 border-b border-white/10 overflow-x-auto">
      <button
        v-for="tab in tabs"
        :key="tab.id"
        @click="activeTab = tab.id"
        :class="[
          'px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap',
          activeTab === tab.id
            ? 'text-white border-b-2 border-purple-500'
            : 'text-gray-400 hover:text-white'
        ]"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- Profile Settings -->
    <div v-if="activeTab === 'profile'" class="space-y-6">
      <div class="card-premium">
        <h2 class="text-xl font-bold text-white mb-6">{{ t.settings.profileInformation }}</h2>

        <form @submit.prevent="saveProfile" class="space-y-6">
          <div class="flex items-center gap-6">
            <div class="relative group">
              <img
                v-if="profile.photoURL"
                :src="profile.photoURL"
                alt="Profile"
                class="w-24 h-24 rounded-full object-cover"
              />
              <div
                v-else
                class="w-24 h-24 rounded-full gradient-primary flex items-center justify-center"
              >
                <span class="text-3xl font-bold text-white">{{ userInitials }}</span>
              </div>
              <div
                v-if="uploadingPhoto"
                class="absolute inset-0 w-24 h-24 rounded-full bg-black/50 flex items-center justify-center"
              >
                <div class="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
            <div>
              <input
                ref="photoInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handlePhotoUpload"
              />
              <button
                type="button"
                @click="selectPhoto"
                :disabled="uploadingPhoto"
                class="px-4 py-2 rounded-xl glass hover:bg-white/10 transition-colors text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {{ uploadingPhoto ? 'Uploading...' : t.settings.changePhoto }}
              </button>
              <p class="text-xs text-gray-500 mt-2">{{ t.settings.photoRequirements }}</p>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">{{ t.settings.fullName }}</label>
              <input
                v-model="profile.displayName"
                type="text"
                class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">{{ t.settings.email }}</label>
              <input
                v-model="profile.email"
                type="email"
                class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">{{ t.settings.phone }}</label>
              <input
                v-model="profile.phone"
                type="tel"
                class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">{{ t.settings.location }}</label>
              <input
                v-model="profile.location"
                type="text"
                class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">{{ t.settings.bio }}</label>
            <textarea
              v-model="profile.bio"
              rows="4"
              class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500 resize-none"
            />
          </div>

          <div class="flex justify-end">
            <UiGradientButton type="submit" variant="primary">
              {{ t.settings.saveChanges }}
            </UiGradientButton>
          </div>
        </form>
      </div>
    </div>

    <!-- Account Settings -->
    <div v-if="activeTab === 'account'" class="space-y-6">
      <div class="card-premium">
        <h2 class="text-xl font-bold text-white mb-6">{{ t.settings.passwordSecurity }}</h2>

        <form @submit.prevent="updatePassword" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">{{ t.settings.currentPassword }}</label>
            <input
              v-model="passwordForm.current"
              type="password"
              class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">{{ t.settings.newPassword }}</label>
            <input
              v-model="passwordForm.new"
              type="password"
              class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">{{ t.settings.confirmNewPassword }}</label>
            <input
              v-model="passwordForm.confirm"
              type="password"
              class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div class="flex justify-end">
            <UiGradientButton type="submit" variant="primary">
              {{ t.settings.updatePassword }}
            </UiGradientButton>
          </div>
        </form>
      </div>

      <div class="card-premium">
        <h2 class="text-xl font-bold text-white mb-4">{{ t.settings.twoFactorAuth }}</h2>
        <p class="text-sm text-gray-400 mb-6">{{ t.settings.twoFactorDesc }}</p>

        <button class="px-6 py-3 rounded-xl glass hover:bg-white/10 transition-colors text-white font-semibold">
          {{ t.settings.enable2FA }}
        </button>
      </div>
    </div>

    <!-- Notifications -->
    <div v-if="activeTab === 'notifications'" class="space-y-6">
      <div class="card-premium">
        <h2 class="text-xl font-bold text-white mb-6">{{ t.settings.notificationPreferences }}</h2>

        <div class="space-y-6">
          <div
            v-for="category in notificationCategories"
            :key="category.id"
            class="pb-6 border-b border-white/10 last:border-0 last:pb-0"
          >
            <h3 class="text-lg font-semibold text-white mb-4">{{ category.name }}</h3>

            <div class="space-y-4">
              <div
                v-for="item in category.items"
                :key="item.id"
                class="flex items-center justify-between"
              >
                <div>
                  <p class="text-sm font-medium text-white">{{ item.label }}</p>
                  <p class="text-xs text-gray-400 mt-1">{{ item.description }}</p>
                </div>

                <label class="relative inline-block w-12 h-6 cursor-pointer">
                  <input
                    v-model="item.enabled"
                    type="checkbox"
                    class="sr-only peer"
                  />
                  <div class="w-12 h-6 rounded-full glass peer-checked:gradient-primary transition-all" />
                  <div class="absolute left-1 top-1 w-4 h-4 rounded-full bg-white transition-transform peer-checked:translate-x-6" />
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Billing -->
    <div v-if="activeTab === 'billing'" class="space-y-6">
      <div class="card-premium">
        <h2 class="text-xl font-bold text-white mb-6">{{ t.settings.currentPlan }}</h2>

        <div class="p-6 rounded-xl glass border border-purple-500/30 mb-6">
          <div class="flex items-center justify-between mb-4">
            <div>
              <h3 class="text-2xl font-bold gradient-text">Pro Plan</h3>
              <p class="text-sm text-gray-400 mt-1">{{ t.settings.billedMonthly }}</p>
            </div>
            <div class="text-right">
              <p class="text-3xl font-bold text-white">$49</p>
              <p class="text-sm text-gray-400">/month</p>
            </div>
          </div>

          <div class="flex gap-3">
            <button class="px-4 py-2 rounded-xl glass hover:bg-white/10 transition-colors text-white text-sm font-medium">
              {{ t.settings.upgradePlan }}
            </button>
            <button class="px-4 py-2 rounded-xl glass hover:bg-white/10 transition-colors text-red-400 text-sm font-medium">
              {{ t.settings.cancelSubscription }}
            </button>
          </div>
        </div>

        <div>
          <h3 class="text-lg font-semibold text-white mb-4">{{ t.settings.billingHistory }}</h3>
          <div class="space-y-3">
            <div
              v-for="invoice in billingHistory"
              :key="invoice.id"
              class="flex items-center justify-between p-4 rounded-xl glass"
            >
              <div>
                <p class="text-sm font-medium text-white">{{ invoice.description }}</p>
                <p class="text-xs text-gray-400 mt-1">{{ invoice.date }}</p>
              </div>
              <div class="flex items-center gap-4">
                <span class="text-lg font-bold text-white">${{ invoice.amount }}</span>
                <button class="text-sm text-purple-400 hover:text-purple-300 transition-colors">
                  {{ t.settings.download }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Preferences -->
    <div v-if="activeTab === 'preferences'" class="space-y-6">
      <div class="card-premium">
        <h2 class="text-xl font-bold text-white mb-6">{{ t.settings.generalPreferences }}</h2>

        <div class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">{{ t.settings.language }}</label>
            <select
              v-model="preferences.language"
              @change="handleLanguageChange"
              class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="en">English</option>
              <option value="th">ไทย (Thai)</option>
              <option value="es">Español</option>
              <option value="fr">Français</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">{{ t.settings.timezone }}</label>
            <select
              v-model="preferences.timezone"
              class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500"
            >
              <option value="UTC">UTC (GMT+0)</option>
              <option value="Asia/Bangkok">Bangkok (GMT+7)</option>
              <option value="America/New_York">New York (GMT-5)</option>
              <option value="Europe/London">London (GMT+0)</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">{{ t.settings.theme }}</label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                @click="handleThemeChange('dark')"
                :class="[
                  'p-4 rounded-xl border-2 transition-colors',
                  preferences.theme === 'dark'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/10 glass hover:border-white/20'
                ]"
              >
                <p class="text-sm font-medium text-white">{{ t.settings.dark }}</p>
              </button>
              <button
                type="button"
                @click="handleThemeChange('light')"
                :class="[
                  'p-4 rounded-xl border-2 transition-colors',
                  preferences.theme === 'light'
                    ? 'border-purple-500 bg-purple-500/10'
                    : 'border-white/10 glass hover:border-white/20'
                ]"
              >
                <p class="text-sm font-medium text-white">{{ t.settings.light }}</p>
              </button>
            </div>
          </div>

          <div class="flex justify-end pt-4">
            <UiGradientButton variant="primary" @click="savePreferences">
              {{ t.settings.savePreferences }}
            </UiGradientButton>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useTheme } from '~/composables/useTheme'
import { useLocale, type SupportedLocale } from '~/composables/useLocale'

definePageMeta({
  middleware: 'auth',
})

const authStore = useAuthStore()
const { theme, setTheme } = useTheme()
const { locale, setLocale, t } = useLocale()
const activeTab = ref('profile')
const saveSuccess = ref(false)

const tabs = computed(() => [
  { id: 'profile', label: t.value.settings.profile },
  { id: 'account', label: t.value.settings.account },
  { id: 'notifications', label: t.value.settings.notifications },
  { id: 'billing', label: t.value.settings.billing },
  { id: 'preferences', label: t.value.settings.preferences },
])

// Load user profile data
onMounted(() => {
  loadProfileData()
})

// Watch for userProfile changes and sync to form
watch(
  () => authStore.userProfile,
  () => {
    loadProfileData()
  },
  { deep: true }
)

function loadProfileData() {
  if (authStore.userProfile) {
    profile.value = {
      displayName: authStore.userProfile.displayName || '',
      email: authStore.userProfile.email || '',
      phone: authStore.userProfile.phone || '',
      location: authStore.userProfile.location || '',
      bio: authStore.userProfile.bio || '',
      photoURL: authStore.userProfile.photoURL || '',
    }

    // Load preferences - sync with composables
    if (authStore.userProfile.preferences) {
      const savedLocale = authStore.userProfile.preferences.language as SupportedLocale
      const savedTheme = authStore.userProfile.preferences.theme as 'dark' | 'light'

      preferences.value = {
        language: savedLocale || 'en',
        timezone: authStore.userProfile.preferences.timezone || 'Asia/Bangkok',
        theme: savedTheme || 'dark',
      }

      // Sync with composables
      if (savedLocale) setLocale(savedLocale)
      if (savedTheme) setTheme(savedTheme)
    }
  }
}

// Profile
const profile = ref({
  displayName: '',
  email: '',
  phone: '',
  location: '',
  bio: '',
  photoURL: '',
})

const photoInput = ref<HTMLInputElement | null>(null)
const uploadingPhoto = ref(false)

const userInitials = computed(() => {
  if (!profile.value.displayName) return '?'
  return profile.value.displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
})

// Password
const passwordForm = ref({
  current: '',
  new: '',
  confirm: '',
})

// Notifications
const notificationCategories = ref([
  {
    id: 'marketing',
    name: 'Marketing & Content',
    items: [
      { id: 'content_ready', label: 'Content Generated', description: 'Get notified when AI generates new content', enabled: true },
      { id: 'viral_score', label: 'High Viral Score', description: 'Alert when content scores above 90', enabled: true },
      { id: 'content_tips', label: 'Content Tips', description: 'Receive weekly content optimization tips', enabled: false },
    ],
  },
  {
    id: 'leads',
    name: 'Leads & CRM',
    items: [
      { id: 'new_lead', label: 'New Leads', description: 'Notify when a new lead is added', enabled: true },
      { id: 'lead_status', label: 'Lead Status Changes', description: 'Alert on lead status updates', enabled: true },
      { id: 'follow_up', label: 'Follow-up Reminders', description: 'Remind me about scheduled follow-ups', enabled: true },
    ],
  },
  {
    id: 'team',
    name: 'Team & Network',
    items: [
      { id: 'new_member', label: 'New Team Members', description: 'Notify when someone joins your team', enabled: true },
      { id: 'team_milestone', label: 'Team Milestones', description: 'Alert on team achievements', enabled: true },
      { id: 'team_activity', label: 'Team Activity', description: 'Daily summary of team activity', enabled: false },
    ],
  },
])

// Billing
const billingHistory = ref([
  { id: '1', description: 'Pro Plan - Monthly', date: 'May 1, 2024', amount: 49 },
  { id: '2', description: 'Pro Plan - Monthly', date: 'Apr 1, 2024', amount: 49 },
  { id: '3', description: 'Pro Plan - Monthly', date: 'Mar 1, 2024', amount: 49 },
])

// Preferences
const preferences = ref({
  language: 'en',
  timezone: 'Asia/Bangkok',
  theme: 'dark',
})

// Functions
async function saveProfile() {
  try {
    saveSuccess.value = false
    await authStore.updateProfile({
      displayName: profile.value.displayName,
      email: profile.value.email,
      phone: profile.value.phone,
      location: profile.value.location,
      bio: profile.value.bio,
    })

    // Show success notification
    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)

    console.log('Profile saved successfully')
  } catch (error) {
    console.error('Failed to save profile:', error)
    alert('Failed to save profile. Please try again.')
  }
}

async function updatePassword() {
  if (passwordForm.value.new !== passwordForm.value.confirm) {
    console.error('Passwords do not match')
    // TODO: Show error toast
    return
  }

  try {
    // TODO: Implement password update via Firebase Auth
    console.log('Update password')
    passwordForm.value = { current: '', new: '', confirm: '' }
    // TODO: Show success toast
  } catch (error) {
    console.error('Failed to update password:', error)
    // TODO: Show error toast
  }
}

// Handle theme change - apply immediately
function handleThemeChange(newTheme: 'dark' | 'light') {
  preferences.value.theme = newTheme
  setTheme(newTheme)
}

// Handle language change - apply immediately
function handleLanguageChange() {
  const newLocale = preferences.value.language as SupportedLocale
  setLocale(newLocale)
}

async function savePreferences() {
  try {
    saveSuccess.value = false
    await authStore.updateProfile({
      preferences: preferences.value,
    })

    // Show success notification
    saveSuccess.value = true
    setTimeout(() => {
      saveSuccess.value = false
    }, 3000)

    console.log('Preferences saved successfully')
  } catch (error) {
    console.error('Failed to save preferences:', error)
    alert('Failed to save preferences. Please try again.')
  }
}

// Photo upload functions
function selectPhoto() {
  photoInput.value?.click()
}

async function handlePhotoUpload(event: Event) {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // Validate file size (2MB max)
  if (file.size > 2 * 1024 * 1024) {
    alert('File size must be less than 2MB')
    return
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    alert('Please select an image file')
    return
  }

  // Check if user is authenticated
  if (!authStore.user?.uid) {
    alert('You must be logged in to upload a photo')
    return
  }

  try {
    uploadingPhoto.value = true

    // Upload to Firebase Storage
    const response = await $fetch('/api/upload/profile-photo', {
      method: 'POST',
      body: {
        file: await fileToBase64(file),
        fileName: file.name,
        contentType: file.type,
        userId: authStore.user.uid,
      },
    })

    if (response.success && response.data) {
      profile.value.photoURL = response.data.photoURL

      // Update profile in Firestore
      await authStore.updateProfile({
        photoURL: response.data.photoURL,
      })

      // Show success notification
      saveSuccess.value = true
      setTimeout(() => {
        saveSuccess.value = false
      }, 3000)
    } else {
      throw new Error(response.error || 'Upload failed')
    }
  } catch (error: any) {
    console.error('Failed to upload photo:', error)
    alert(error.message || 'Failed to upload photo. Please try again.')
  } finally {
    uploadingPhoto.value = false
    // Reset input
    if (target) target.value = ''
  }
}

// Helper function to convert file to base64
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}
</script>

<style scoped>
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

@keyframes slide-in {
  from {
    transform: translateX(100%);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

.animate-slide-in {
  animation: slide-in 0.3s ease-out;
}
</style>
