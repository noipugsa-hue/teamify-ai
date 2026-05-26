import { defineStore } from 'pinia'
import { collection, addDoc, query, where, getDocs, orderBy, limit, Timestamp, deleteDoc, doc, writeBatch } from 'firebase/firestore'
import type { GeneratedContent, AIGenerationRequest, ContentType, Platform } from '~/types'
import { COLLECTIONS } from '../../firebase/collections'

/**
 * Count words in text (handles Thai and English)
 */
function countWords(text: string): number {
  if (!text) return 0

  // Remove hashtags and emojis
  let cleanText = text.replace(/#\S+/g, '').replace(/[\u{1F300}-\u{1F9FF}]/gu, '')

  // Split by spaces and count non-empty segments
  // This works for both English (space-separated) and Thai (some spaces)
  const segments = cleanText.split(/\s+/).filter((s) => s.trim().length > 0)

  // For Thai text without spaces, approximate by character count / 5
  // (average Thai word length is about 5 characters)
  let totalWords = 0
  for (const segment of segments) {
    // Check if segment contains Thai characters
    const hasThaiChars = /[\u0E00-\u0E7F]/.test(segment)
    if (hasThaiChars && segment.length > 10) {
      // Long Thai segment without spaces - estimate word count
      totalWords += Math.ceil(segment.length / 5)
    } else {
      totalWords += 1
    }
  }

  return totalWords
}

export const useContentStore = defineStore('content', {
  state: () => ({
    contents: [] as GeneratedContent[],
    savedContents: [] as GeneratedContent[],
    loading: false,
    generating: false,
    error: null as string | null,
  }),

  getters: {
    contentByPlatform: (state) => (platform: Platform) => {
      return state.contents.filter((c) => c.metadata.platform === platform)
    },

    contentByType: (state) => (type: ContentType) => {
      return state.contents.filter((c) => c.type === type)
    },

    topPerformingContent: (state) => {
      return [...state.contents].sort((a, b) => b.viralScore - a.viralScore).slice(0, 10)
    },
  },

  actions: {
    /**
     * Generate new content using AI
     */
    async generateContent(request: AIGenerationRequest) {
      this.generating = true
      this.error = null

      try {
        console.log('📡 Calling API to generate content...')

        const response = await $fetch<any>('/api/ai/generate', {
          method: 'POST',
          body: request,
        })

        console.log('📥 API Response:', response)

        if (!response.success) {
          throw new Error(response.error || 'Failed to generate content')
        }

        if (!response.data) {
          throw new Error('No data returned from API')
        }

        const authStore = useAuthStore()
        if (!authStore.userProfile) throw new Error('User not authenticated')

        // Save to Firestore
        const { db } = useFirebase()

        // Count words in the generated content
        const wordCount = countWords(response.data.content)

        const contentData: Omit<GeneratedContent, 'id'> = {
          userId: authStore.userProfile.id,
          type: request.type,
          platform: request.platform,
          content: response.data.content,
          metadata: {
            niche: request.context,
            tone: request.tone,
            wordCount,
          },
          viralScore: response.data.viralScore,
          saved: false,
          used: false,
          createdAt: Timestamp.now(),
        }

        console.log('💾 Saving to Firestore...')
        const docRef = await addDoc(collection(db, COLLECTIONS.GENERATED_CONTENT), contentData)

        const newContent: GeneratedContent = {
          id: docRef.id,
          ...contentData,
        }

        this.contents.unshift(newContent)

        console.log('✅ Content saved successfully')
        return newContent
      } catch (error: any) {
        console.error('❌ Error in generateContent store:', error)
        this.error = error.message
        throw error
      } finally {
        this.generating = false
      }
    },

    /**
     * Load user's generated content
     */
    async loadUserContent(userId: string, limitCount: number = 50) {
      this.loading = true
      this.error = null

      try {
        const { db } = useFirebase()
        const q = query(
          collection(db, COLLECTIONS.GENERATED_CONTENT),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
          limit(limitCount)
        )

        const snapshot = await getDocs(q)
        this.contents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as GeneratedContent[]
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Load saved content
     */
    async loadSavedContent(userId: string) {
      this.loading = true
      this.error = null

      try {
        const { db } = useFirebase()
        const q = query(
          collection(db, COLLECTIONS.GENERATED_CONTENT),
          where('userId', '==', userId),
          where('saved', '==', true),
          orderBy('createdAt', 'desc')
        )

        const snapshot = await getDocs(q)
        this.savedContents = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as GeneratedContent[]
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },

    /**
     * Generate multiple variations
     */
    async generateVariations(request: AIGenerationRequest, count: number = 3) {
      this.generating = true
      this.error = null

      try {
        const response = await $fetch('/api/ai/generate-variations', {
          method: 'POST',
          body: { request, count },
        })

        if (response.success && response.data) {
          const authStore = useAuthStore()
          if (!authStore.userProfile) throw new Error('User not authenticated')

          const { db } = useFirebase()
          const newContents: GeneratedContent[] = []

          for (const item of response.data) {
            const wordCount = countWords(item.content)

            const contentData: Omit<GeneratedContent, 'id'> = {
              userId: authStore.userProfile.id,
              type: request.type,
              platform: request.platform,
              content: item.content,
              metadata: {
                niche: request.context,
                tone: request.tone,
                wordCount,
              },
              viralScore: item.viralScore,
              saved: false,
              used: false,
              createdAt: Timestamp.now(),
            }

            const docRef = await addDoc(collection(db, COLLECTIONS.GENERATED_CONTENT), contentData)

            newContents.push({
              id: docRef.id,
              ...contentData,
            })
          }

          this.contents.unshift(...newContents)

          return newContents
        }

        throw new Error(response.error || 'Failed to generate variations')
      } catch (error: any) {
        this.error = error.message
        throw error
      } finally {
        this.generating = false
      }
    },

    /**
     * Rewrite content with different style
     */
    async rewriteContent(
      contentId: string,
      style: 'shorter' | 'longer' | 'more_engaging' | 'professional' | 'casual'
    ) {
      this.generating = true
      this.error = null

      try {
        console.log('🔍 Looking for content with ID:', contentId)
        console.log('📋 Available content IDs:', this.contents.map(c => c.id))

        const content = this.contents.find((c) => c.id === contentId)
        if (!content) {
          console.error('❌ Content not found for id:', contentId)
          console.error('Available contents:', this.contents.length)
          throw new Error('Content not found')
        }

        console.log('✓ Found content:', {
          id: content.id,
          type: content.type,
          platform: content.platform,
          contentLength: content.content?.length,
          hasContent: !!content.content,
        })

        const requestBody = {
          content: content.content,
          style,
        }

        console.log('📡 Calling rewrite API with:', {
          contentLength: content.content?.length || 0,
          style,
          hasContent: !!requestBody.content,
          hasStyle: !!requestBody.style,
          bodyPreview: requestBody.content?.substring(0, 50) + '...',
        })

        const response = await $fetch<any>('/api/ai/rewrite', {
          method: 'POST',
          body: requestBody,
        })

        console.log('📥 Rewrite API Response:', response)

        if (!response.success) {
          throw new Error(response.error || 'Failed to rewrite content')
        }

        if (!response.data) {
          throw new Error('No data returned from API')
        }

        const authStore = useAuthStore()
        if (!authStore.userProfile) throw new Error('User not authenticated')

        const { db } = useFirebase()

        // Count words in the rewritten content
        const wordCount = countWords(response.data.content)

        const rewrittenData: Omit<GeneratedContent, 'id'> = {
          ...content,
          content: response.data.content,
          viralScore: response.data.viralScore || content.viralScore,
          metadata: {
            ...content.metadata,
            wordCount,
            rewriteStyle: style,
            originalContentId: contentId,
          },
          createdAt: Timestamp.now(),
        }

        console.log('💾 Saving rewritten content to Firestore...')
        const docRef = await addDoc(collection(db, COLLECTIONS.GENERATED_CONTENT), rewrittenData)

        const newContent: GeneratedContent = {
          id: docRef.id,
          ...rewrittenData,
        }

        this.contents.unshift(newContent)

        console.log('✅ Content rewritten successfully')
        return newContent
      } catch (error: any) {
        console.error('❌ Error in rewriteContent store:', error)
        this.error = error.message
        throw error
      } finally {
        this.generating = false
      }
    },

    /**
     * Clear all content (from memory only)
     */
    clearContent() {
      this.contents = []
      this.savedContents = []
    },

    /**
     * Delete all user content from Firestore
     */
    async deleteAllUserContent(userId: string) {
      this.loading = true
      this.error = null

      try {
        const { db } = useFirebase()

        console.log('🗑️ Fetching all user content from Firestore...')

        // Get all user's content
        const q = query(
          collection(db, COLLECTIONS.GENERATED_CONTENT),
          where('userId', '==', userId)
        )

        const snapshot = await getDocs(q)
        console.log(`Found ${snapshot.size} documents to delete`)

        if (snapshot.empty) {
          console.log('No content to delete')
          this.contents = []
          this.savedContents = []
          return
        }

        // Use batch delete for better performance
        const batch = writeBatch(db)

        snapshot.docs.forEach((document) => {
          batch.delete(doc(db, COLLECTIONS.GENERATED_CONTENT, document.id))
        })

        console.log('🔥 Deleting all content from Firestore...')
        await batch.commit()

        // Clear local state
        this.contents = []
        this.savedContents = []

        console.log('✅ All content deleted successfully')
      } catch (error: any) {
        console.error('❌ Error deleting content:', error)
        this.error = error.message
        throw error
      } finally {
        this.loading = false
      }
    },
  },
})
