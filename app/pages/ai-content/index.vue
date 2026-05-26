<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-4xl font-bold gradient-text mb-2">AI Content Generator</h1>
      <p class="text-gray-400">Create viral social media content in seconds</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Generator Form -->
      <div class="lg:col-span-2 space-y-6">
        <div class="card-premium">
          <form @submit.prevent="handleGenerate" class="space-y-6">
            <!-- Content Type & Platform -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Content Type</label>
                <select
                  v-model="form.type"
                  class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="caption">Caption</option>
                  <option value="hook">Hook</option>
                  <option value="script">Script</option>
                  <option value="post">Post</option>
                  <option value="cta">Call to Action</option>
                  <option value="hashtags">Hashtags</option>
                  <option value="story">Story</option>
                </select>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-300 mb-2">Platform</label>
                <select
                  v-model="form.platform"
                  class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors"
                >
                  <option value="tiktok">TikTok</option>
                  <option value="instagram">Instagram</option>
                  <option value="facebook">Facebook</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="twitter">Twitter/X</option>
                  <option value="youtube">YouTube</option>
                </select>
              </div>
            </div>

            <!-- Prompt -->
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">
                What do you want to create?
              </label>
              <textarea
                v-model="form.prompt"
                rows="4"
                required
                placeholder="Example: Create a caption about the benefits of network marketing for stay-at-home moms..."
                class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
              />
            </div>

            <!-- Advanced Options -->
            <details class="group">
              <summary class="cursor-pointer text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Advanced Options
              </summary>

              <div class="mt-4 space-y-4">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Tone</label>
                    <select
                      v-model="form.tone"
                      class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="conversational">Conversational</option>
                      <option value="professional">Professional</option>
                      <option value="casual">Casual</option>
                      <option value="inspiring">Inspiring</option>
                      <option value="funny">Funny</option>
                    </select>
                  </div>

                  <div>
                    <label class="block text-sm font-medium text-gray-300 mb-2">Length</label>
                    <select
                      v-model="form.length"
                      class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white focus:outline-none focus:border-purple-500 transition-colors"
                    >
                      <option value="short">Short</option>
                      <option value="medium">Medium</option>
                      <option value="long">Long</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    จำนวนคำสูงสุด (optional)
                  </label>
                  <input
                    v-model.number="form.maxWords"
                    type="number"
                    min="10"
                    max="500"
                    placeholder="เช่น 50, 100, 200..."
                    class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                  <p class="text-xs text-gray-400 mt-1">
                    ระบุจำนวนคำสูงสุดที่ต้องการ (10-500 คำ) หรือเว้นว่างไว้เพื่อใช้ความยาวปกติ
                  </p>
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-300 mb-2">
                    Additional Context (optional)
                  </label>
                  <input
                    v-model="form.context"
                    type="text"
                    placeholder="Niche, target audience, keywords..."
                    class="w-full px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
                  />
                </div>
              </div>
            </details>

            <!-- Action Buttons -->
            <div class="flex gap-3">
              <UiGradientButton
                type="submit"
                variant="primary"
                class="flex-1"
                :loading="generating"
                loading-text="Generating..."
              >
                <Sparkles :size="20" class="inline mr-2" />
                Generate Content
              </UiGradientButton>

              <button
                type="button"
                @click="generateVariations"
                :disabled="generating"
                class="px-6 py-3 rounded-xl glass hover:bg-white/10 transition-colors text-white font-semibold disabled:opacity-50"
              >
                Generate 3 Variations
              </button>
            </div>
          </form>
        </div>

        <!-- Error Message -->
        <div v-if="errorMessage" class="card-premium bg-red-500/10 border border-red-500/30">
          <div class="flex items-start gap-3">
            <div class="text-red-400 text-xl">⚠️</div>
            <div>
              <h3 class="text-red-400 font-semibold mb-1">Error</h3>
              <p class="text-sm text-red-300">{{ errorMessage }}</p>
            </div>
          </div>
        </div>

        <!-- Generated Content -->
        <div v-if="generatedContent.length > 0" class="space-y-4">
          <!-- Header with Clear Button -->
          <div class="flex items-center justify-between">
            <h2 class="text-xl font-bold text-white">
              Generated Content ({{ generatedContent.length }})
            </h2>
            <button
              @click="clearAllContent"
              class="px-4 py-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-red-400 font-semibold transition-colors flex items-center gap-2"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
              Clear All
            </button>
          </div>

          <div
            v-for="(content, index) in generatedContent"
            :key="index"
            class="card-premium"
          >
            <div class="flex items-start justify-between mb-4">
              <div class="flex items-center gap-2 flex-wrap">
                <span class="px-3 py-1 rounded-lg bg-purple-500/20 text-purple-400 text-sm font-medium">
                  {{ content.platform }}
                </span>
                <span class="px-3 py-1 rounded-lg bg-blue-500/20 text-blue-400 text-sm font-medium">
                  {{ content.type }}
                </span>

                <!-- Word Count -->
                <span
                  v-if="content.metadata?.wordCount"
                  class="px-3 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm font-medium"
                >
                  📝 {{ content.metadata.wordCount }} คำ
                </span>

                <!-- Rewrite Style Badge -->
                <span
                  v-if="content.metadata?.rewriteStyle"
                  class="px-3 py-1 rounded-lg bg-orange-500/20 text-orange-400 text-sm font-medium"
                >
                  🔄 {{ getStyleLabel(content.metadata.rewriteStyle) }}
                </span>
              </div>

              <div class="flex items-center gap-2 relative">
                <!-- Viral Score -->
                <div class="flex items-center gap-1 px-3 py-1 rounded-lg bg-yellow-500/20 text-yellow-400">
                  <Zap :size="16" />
                  <span class="text-sm font-bold">{{ content.viralScore }}</span>
                </div>

                <!-- Actions -->
                <button
                  @click="copyToClipboard(content.content)"
                  class="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
                  title="Copy"
                >
                  <Copy :size="18" class="text-gray-400" />
                </button>

                <button
                  @click="openRewriteMenu(index)"
                  class="p-2 rounded-lg glass hover:bg-white/10 transition-colors"
                  title="Rewrite"
                >
                  <RefreshCw :size="18" class="text-gray-400" />
                </button>

                <!-- Rewrite Menu -->
                <div
                  v-if="showRewriteMenu === index"
                  class="absolute right-0 top-12 w-48 rounded-xl glass border border-white/10 shadow-xl z-10"
                  @click.stop
                >
                  <div class="p-2 space-y-1">
                    <button
                      @click="handleRewrite(content.id, 'shorter')"
                      class="w-full px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left text-sm text-white"
                    >
                      ✂️ Shorter
                    </button>
                    <button
                      @click="handleRewrite(content.id, 'longer')"
                      class="w-full px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left text-sm text-white"
                    >
                      📝 Longer
                    </button>
                    <button
                      @click="handleRewrite(content.id, 'more_engaging')"
                      class="w-full px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left text-sm text-white"
                    >
                      🔥 More Engaging
                    </button>
                    <button
                      @click="handleRewrite(content.id, 'professional')"
                      class="w-full px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left text-sm text-white"
                    >
                      👔 Professional
                    </button>
                    <button
                      @click="handleRewrite(content.id, 'casual')"
                      class="w-full px-3 py-2 rounded-lg hover:bg-white/10 transition-colors text-left text-sm text-white"
                    >
                      😊 Casual
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div class="prose prose-invert max-w-none">
              <pre class="whitespace-pre-wrap text-gray-200 text-sm leading-relaxed">{{ content.content }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Quick Stats -->
        <div class="card-premium">
          <h3 class="text-lg font-bold text-white mb-4">Your Stats</h3>

          <div class="space-y-4">
            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm text-gray-400">Content Generated</span>
                <span class="text-lg font-bold text-white">{{ generatedContent.length }}</span>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm text-gray-400">Avg Viral Score</span>
                <span class="text-lg font-bold gradient-text">{{ avgViralScore }}</span>
              </div>
            </div>

            <div>
              <div class="flex items-center justify-between mb-1">
                <span class="text-sm text-gray-400">Top Platform</span>
                <span class="text-lg font-bold text-purple-400">TikTok</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Tips -->
        <div class="card-premium">
          <h3 class="text-lg font-bold text-white mb-4">💡 Pro Tips</h3>

          <ul class="space-y-3 text-sm text-gray-400">
            <li class="flex gap-2">
              <span class="text-purple-400">•</span>
              <span>Be specific about your target audience</span>
            </li>
            <li class="flex gap-2">
              <span class="text-purple-400">•</span>
              <span>Include your niche or industry</span>
            </li>
            <li class="flex gap-2">
              <span class="text-purple-400">•</span>
              <span>Mention the emotion you want to evoke</span>
            </li>
            <li class="flex gap-2">
              <span class="text-purple-400">•</span>
              <span>Generate multiple versions and pick the best</span>
            </li>
          </ul>
        </div>

        <!-- Quick Actions -->
        <div class="card-premium">
          <h3 class="text-lg font-bold text-white mb-4">Quick Actions</h3>

          <div class="space-y-2">
            <button
              @click="generateHooks"
              class="w-full px-4 py-3 rounded-xl glass hover:bg-white/10 transition-colors text-left text-sm text-white"
            >
              🎯 Generate Viral Hooks
            </button>

            <button
              @click="() => router.push('/ai-closing')"
              class="w-full px-4 py-3 rounded-xl glass hover:bg-white/10 transition-colors text-left text-sm text-white"
            >
              💬 AI Closing Assistant
            </button>

            <button
              class="w-full px-4 py-3 rounded-xl glass hover:bg-white/10 transition-colors text-left text-sm text-white"
            >
              📊 View Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { Sparkles, Zap, Copy, RefreshCw } from 'lucide-vue-next'
import { useContentStore } from '~/stores/content'
import type { ContentType, Platform } from '~/types'

definePageMeta({
  middleware: 'auth',
})

const contentStore = useContentStore()
const router = useRouter()

const form = ref({
  type: 'caption' as ContentType,
  platform: 'tiktok' as Platform,
  prompt: '',
  tone: 'conversational',
  length: 'medium' as 'short' | 'medium' | 'long',
  context: '',
  maxWords: null as number | null,
})

const generating = ref(false)
const generatedContent = ref<any[]>([])
const errorMessage = ref<string | null>(null)
const showRewriteMenu = ref<number | null>(null)

// Close rewrite menu when clicking outside
function handleClickOutside(event: MouseEvent) {
  const target = event.target as HTMLElement
  if (!target.closest('.relative')) {
    showRewriteMenu.value = null
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)

  // Sync local content with store
  console.log('🔄 Syncing content with store on mount')
  console.log('Store contents:', contentStore.contents.length)

  // If store has content, use it
  if (contentStore.contents.length > 0) {
    generatedContent.value = [...contentStore.contents]
    console.log('✓ Loaded', generatedContent.value.length, 'items from store')
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const avgViralScore = computed(() => {
  if (generatedContent.value.length === 0) return 0
  const sum = generatedContent.value.reduce((acc: number, c: any) => acc + c.viralScore, 0)
  return Math.round(sum / generatedContent.value.length)
})

async function handleGenerate() {
  generating.value = true
  errorMessage.value = null

  console.log('🚀 Starting content generation...')
  console.log('Form data:', form.value)

  try {
    const content = await contentStore.generateContent({
      type: form.value.type,
      platform: form.value.platform,
      prompt: form.value.prompt,
      tone: form.value.tone,
      length: form.value.length,
      context: form.value.context,
      maxWords: form.value.maxWords,
    })

    console.log('✅ Content generated:', {
      id: content.id,
      type: content.type,
      hasContent: !!content.content,
      contentLength: content.content?.length,
    })

    // Add to local array
    generatedContent.value.unshift(content)

    // Verify it's in the store
    const inStore = contentStore.contents.find((c) => c.id === content.id)
    console.log('✓ Content in store:', !!inStore)

    if (!inStore) {
      console.warn('⚠️ Content not found in store after generation!')
    }
  } catch (error: any) {
    console.error('❌ Failed to generate content:', error)
    errorMessage.value = error.message || 'Failed to generate content. Please try again.'

    // Show more detailed error in development
    console.error('Full error:', error)
  } finally {
    generating.value = false
    console.log('✓ Generation complete')
  }
}

async function generateVariations() {
  generating.value = true
  errorMessage.value = null

  try {
    const variations = await contentStore.generateVariations(
      {
        type: form.value.type,
        platform: form.value.platform,
        prompt: form.value.prompt,
        tone: form.value.tone,
        length: form.value.length,
        context: form.value.context,
      },
      3
    )

    generatedContent.value.unshift(...variations)
  } catch (error: any) {
    console.error('Failed to generate variations:', error)
    errorMessage.value = error.message || 'Failed to generate variations. Please try again.'
  } finally {
    generating.value = false
  }
}

function openRewriteMenu(index: number) {
  if (showRewriteMenu.value === index) {
    showRewriteMenu.value = null
  } else {
    showRewriteMenu.value = index
  }
}

async function handleRewrite(contentId: string, style: 'shorter' | 'longer' | 'more_engaging' | 'professional' | 'casual') {
  showRewriteMenu.value = null
  generating.value = true
  errorMessage.value = null

  console.log('🔄 Rewriting content...', { contentId, style })

  // Verify content exists in local array
  const localContent = generatedContent.value.find((c) => c.id === contentId)
  console.log('Local content found:', !!localContent, {
    id: localContent?.id,
    hasContent: !!localContent?.content,
    contentLength: localContent?.content?.length,
  })

  // Verify content exists in store
  const storeContent = contentStore.contents.find((c) => c.id === contentId)
  console.log('Store content found:', !!storeContent, {
    storeContentCount: contentStore.contents.length,
  })

  if (!storeContent && localContent) {
    console.warn('⚠️ Content found in local array but not in store! Adding to store...')
    contentStore.contents.unshift(localContent)
  }

  try {
    const newContent = await contentStore.rewriteContent(contentId, style)
    generatedContent.value.unshift(newContent)
    console.log('✅ Content rewritten successfully:', {
      id: newContent.id,
      contentLength: newContent.content?.length,
    })
  } catch (error: any) {
    console.error('❌ Failed to rewrite content:', error)
    errorMessage.value = error.message || 'Failed to rewrite content. Please try again.'
  } finally {
    generating.value = false
  }
}

function copyToClipboard(text: string) {
  navigator.clipboard.writeText(text)
  // In production, show a toast notification
}

function generateHooks() {
  form.value.type = 'hook'
  handleGenerate()
}

async function clearAllContent() {
  // Confirm before clearing
  if (!confirm('⚠️ คุณแน่ใจหรือไม่ที่จะลบ content ทั้งหมด?\n\nการกระทำนี้ไม่สามารถย้อนกลับได้!')) {
    return
  }

  console.log('🗑️ Clearing all content...')
  console.log('Current content count:', generatedContent.value.length)

  try {
    const authStore = useAuthStore()
    if (!authStore.userProfile) {
      errorMessage.value = 'User not authenticated'
      return
    }

    // Delete all content from Firestore
    await contentStore.deleteAllUserContent(authStore.userProfile.id)

    // Clear local content
    generatedContent.value = []

    console.log('✅ All content cleared successfully')

    // Optional: Show success message
    alert('✅ ลบ content ทั้งหมดเรียบร้อยแล้ว')
  } catch (error: any) {
    console.error('❌ Failed to clear content:', error)
    errorMessage.value = error.message || 'Failed to clear content'
    alert('❌ เกิดข้อผิดพลาดในการลบ content: ' + error.message)
  }
}

function getStyleLabel(style: string): string {
  const labels: Record<string, string> = {
    shorter: 'สั้นลง',
    longer: 'ยาวขึ้น',
    more_engaging: 'น่าสนใจขึ้น',
    professional: 'เป็นทางการ',
    casual: 'สบายๆ',
  }
  return labels[style] || style
}
</script>
