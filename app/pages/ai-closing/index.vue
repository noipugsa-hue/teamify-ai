<template>
  <div class="space-y-8">
    <!-- Header -->
    <div>
      <h1 class="text-4xl font-bold gradient-text mb-2">AI Closing Assistant</h1>
      <p class="text-gray-400">Get instant help with objection handling and closing techniques</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Chat Interface -->
      <div class="lg:col-span-2 space-y-4">
        <div class="card-premium h-[600px] flex flex-col">
          <!-- Chat Messages -->
          <div
            ref="chatContainer"
            class="flex-1 overflow-y-auto space-y-4 p-4 scroll-smooth"
          >
            <div
              v-for="(message, index) in messages"
              :key="index"
              :class="[
                'flex',
                message.role === 'user' ? 'justify-end' : 'justify-start',
              ]"
            >
              <div
                :class="[
                  'max-w-[80%] rounded-2xl px-4 py-3',
                  message.role === 'user'
                    ? 'gradient-primary text-white'
                    : 'glass text-gray-200',
                ]"
              >
                <p class="text-sm leading-relaxed whitespace-pre-wrap">{{ message.content }}</p>
              </div>
            </div>

            <!-- Typing Indicator -->
            <div v-if="isTyping" class="flex justify-start">
              <div class="glass rounded-2xl px-4 py-3">
                <div class="flex gap-1">
                  <div class="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style="animation-delay: 0ms"></div>
                  <div class="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style="animation-delay: 150ms"></div>
                  <div class="w-2 h-2 rounded-full bg-purple-400 animate-bounce" style="animation-delay: 300ms"></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Input Area -->
          <div class="border-t border-white/10 p-4">
            <form @submit.prevent="sendMessage" class="flex gap-3">
              <textarea
                v-model="userInput"
                @keydown.enter.exact.prevent="sendMessage"
                rows="2"
                placeholder="Ask me about handling objections, closing techniques, or any sales questions..."
                class="flex-1 px-4 py-3 rounded-xl glass border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors resize-none"
                :disabled="isTyping"
              />
              <button
                type="submit"
                :disabled="!userInput.trim() || isTyping"
                class="px-6 py-3 rounded-xl gradient-primary text-white font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send :size="20" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="space-y-6">
        <!-- Quick Prompts -->
        <div class="card-premium">
          <h3 class="text-lg font-bold text-white mb-4">Quick Prompts</h3>

          <div class="space-y-2">
            <button
              v-for="prompt in quickPrompts"
              :key="prompt.title"
              @click="useQuickPrompt(prompt.text)"
              class="w-full p-3 rounded-xl glass hover:bg-white/10 transition-colors text-left"
            >
              <div class="flex items-start gap-2">
                <component :is="prompt.icon" :size="18" class="text-purple-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p class="text-sm font-medium text-white">{{ prompt.title }}</p>
                  <p class="text-xs text-gray-400 mt-0.5">{{ prompt.description }}</p>
                </div>
              </div>
            </button>
          </div>
        </div>

        <!-- Tips -->
        <div class="card-premium">
          <h3 class="text-lg font-bold text-white mb-4">💡 Pro Tips</h3>

          <ul class="space-y-3 text-sm text-gray-400">
            <li class="flex gap-2">
              <span class="text-purple-400">•</span>
              <span>Be specific about the objection you're facing</span>
            </li>
            <li class="flex gap-2">
              <span class="text-purple-400">•</span>
              <span>Ask for multiple response options</span>
            </li>
            <li class="flex gap-2">
              <span class="text-purple-400">•</span>
              <span>Share context about your product/service</span>
            </li>
            <li class="flex gap-2">
              <span class="text-purple-400">•</span>
              <span>Practice the responses before using them</span>
            </li>
          </ul>
        </div>

        <!-- Clear Chat -->
        <button
          @click="clearChat"
          class="w-full px-4 py-3 rounded-xl glass hover:bg-red-500/10 transition-colors text-red-400 flex items-center justify-center gap-2"
        >
          <Trash2 :size="18" />
          <span class="font-medium">Clear Chat</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, onMounted } from 'vue'
import { Send, Trash2, HelpCircle, Shield, Target, MessageCircle } from 'lucide-vue-next'

definePageMeta({
  middleware: 'auth',
})

interface Message {
  role: 'user' | 'assistant' | 'system'
  content: string
}

const messages = ref<Message[]>([
  {
    role: 'assistant',
    content: "Hi! I'm your AI Closing Assistant. I'm here to help you handle objections, craft compelling responses, and close more deals. What would you like help with today?",
  },
])

const userInput = ref('')
const isTyping = ref(false)
const chatContainer = ref<HTMLElement | null>(null)

const quickPrompts = [
  {
    icon: HelpCircle,
    title: 'Price Objection',
    description: 'Handle "it\'s too expensive"',
    text: 'How do I handle the objection "Your product is too expensive"?',
  },
  {
    icon: Shield,
    title: 'Trust Building',
    description: 'Build credibility fast',
    text: 'How can I build trust with a skeptical prospect quickly?',
  },
  {
    icon: Target,
    title: 'Closing Technique',
    description: 'Learn effective closes',
    text: 'What are the most effective closing techniques for network marketing?',
  },
  {
    icon: MessageCircle,
    title: 'Follow-up Script',
    description: 'Craft follow-up messages',
    text: 'Help me write a follow-up message for a prospect who said "I need to think about it"',
  },
]

async function sendMessage() {
  if (!userInput.value.trim() || isTyping.value) return

  const userMessage: Message = {
    role: 'user',
    content: userInput.value.trim(),
  }

  messages.value.push(userMessage)
  userInput.value = ''
  isTyping.value = true

  await scrollToBottom()

  try {
    const response = await $fetch('/api/ai/chat', {
      method: 'POST',
      body: {
        messages: messages.value,
        context: 'closing',
      },
    })

    if (response.success && response.data) {
      messages.value.push({
        role: 'assistant',
        content: response.data.message,
      })

      await scrollToBottom()
    }
  } catch (error: any) {
    console.error('Chat error:', error)
    messages.value.push({
      role: 'assistant',
      content: 'Sorry, I encountered an error. Please try again.',
    })
  } finally {
    isTyping.value = false
  }
}

function useQuickPrompt(text: string) {
  userInput.value = text
}

function clearChat() {
  messages.value = [
    {
      role: 'assistant',
      content: "Hi! I'm your AI Closing Assistant. I'm here to help you handle objections, craft compelling responses, and close more deals. What would you like help with today?",
    },
  ]
}

async function scrollToBottom() {
  await nextTick()
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
}

onMounted(() => {
  scrollToBottom()
})
</script>
