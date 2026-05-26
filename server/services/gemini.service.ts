import { GoogleGenerativeAI } from '@google/generative-ai'
import type {
  AIGenerationRequest,
  AIGenerationResponse,
  ContentType,
} from '../../app/types'
import { buildContentPrompt, VIRAL_SCORE_PROMPT } from '../../prompts/content'
import { SYSTEM_PROMPTS } from '../../prompts/system'

let geminiClient: GoogleGenerativeAI | null = null

/**
 * Sleep helper for retry logic
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Extract retry delay from error message
 */
function getRetryDelay(error: any): number | null {
  if (!error?.message) return null

  // Look for "retry in X.Xs" pattern
  const match = error.message.match(/retry in (\d+(?:\.\d+)?)s/)
  if (match) {
    return Math.ceil(parseFloat(match[1]) * 1000) // Convert to milliseconds
  }

  // Default retry delay for 429 errors
  if (error.message?.includes('429') || error.message?.includes('quota')) {
    return 30000 // 30 seconds default
  }

  return null
}

function getGeminiClient(): GoogleGenerativeAI {
  if (!geminiClient) {
    const config = useRuntimeConfig()

    if (!config.geminiApiKey || config.geminiApiKey === 'your_gemini_api_key') {
      throw new Error(
        'Gemini API key is not configured. Please add GEMINI_API_KEY to your .env file. ' +
        'Get your FREE API key from https://makersuite.google.com/app/apikey'
      )
    }

    geminiClient = new GoogleGenerativeAI(config.geminiApiKey)
  }
  return geminiClient
}

/**
 * Generate content using Google Gemini (FREE!)
 */
export async function generateContentWithGemini(
  request: AIGenerationRequest,
  retryCount = 0,
  maxRetries = 1
): Promise<AIGenerationResponse> {
  try {
    const genAI = getGeminiClient()
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })

    const systemPrompt = getSystemPrompt(request.type)
    const userPrompt = buildContentPrompt(request.type, request.platform, {
      niche: request.context,
      tone: request.tone,
      length: request.length,
      context: request.prompt,
      maxWords: request.maxWords,
    })

    console.log('🤖 Generating content with Google Gemini (gemini-3.5-flash)...')
    console.log('Type:', request.type, 'Platform:', request.platform)

    const result = await model.generateContent([
      `${systemPrompt}\n\n${userPrompt}`
    ])

    const response = await result.response
    const content = response.text()

    if (!content) {
      throw new Error('Gemini returned empty content')
    }

    console.log('✅ Content generated successfully with Gemini')

    // Calculate viral score
    const viralScore = await calculateViralScoreWithGemini(content)

    return {
      success: true,
      content,
      viralScore,
      suggestions: [],
    }
  } catch (error: any) {
    console.error('❌ Gemini Generation Error:', error.message)

    // Check if we should retry
    const retryDelay = getRetryDelay(error)
    if (retryDelay && retryCount < maxRetries) {
      console.log(`⏳ Rate limit hit. Waiting ${retryDelay / 1000}s before retry ${retryCount + 1}/${maxRetries}...`)
      await sleep(retryDelay)
      return generateContentWithGemini(request, retryCount + 1, maxRetries)
    }

    let errorMessage = error.message || 'Failed to generate content'

    if (error.message?.includes('API key')) {
      errorMessage = 'Invalid Gemini API key. Get a FREE key from https://makersuite.google.com/app/apikey'
    } else if (error.message?.includes('quota') || error.message?.includes('429')) {
      const waitTime = retryDelay ? Math.ceil(retryDelay / 1000) : 30
      errorMessage = `Gemini rate limit exceeded. Please wait ${waitTime} seconds and try again. Now using gemini-3.5-flash with free tier quota.`
    }

    return {
      success: false,
      content: '',
      viralScore: 0,
      error: errorMessage,
    }
  }
}

/**
 * Generate multiple variations with Gemini
 */
export async function generateVariationsWithGemini(
  request: AIGenerationRequest,
  count: number = 3
): Promise<AIGenerationResponse[]> {
  const promises = Array(count)
    .fill(null)
    .map(() => generateContentWithGemini(request))

  return Promise.all(promises)
}

/**
 * Rewrite content with Gemini
 */
export async function rewriteContentWithGemini(
  content: string,
  style: 'shorter' | 'longer' | 'more_engaging' | 'professional' | 'casual',
  retryCount = 0,
  maxRetries = 1
): Promise<AIGenerationResponse> {
  try {
    const genAI = getGeminiClient()
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })

    const stylePrompts = {
      shorter: 'Make this content more concise while keeping the key message and impact.',
      longer: 'Expand this content with more details, examples, and value while maintaining engagement.',
      more_engaging: 'Rewrite this to be more engaging, emotional, and viral-worthy.',
      professional: 'Rewrite this in a more professional and polished tone.',
      casual: 'Rewrite this in a more casual, conversational, and friendly tone.',
    }

    const prompt = `${SYSTEM_PROMPTS.CONTENT_GENERATOR}\n\n${stylePrompts[style]}\n\nOriginal content:\n${content}`

    console.log('🔄 Rewriting with Gemini (gemini-3.5-flash)...')

    const result = await model.generateContent(prompt)
    const response = await result.response
    const rewrittenContent = response.text()

    const viralScore = await calculateViralScoreWithGemini(rewrittenContent)

    console.log('✅ Rewrite successful with Gemini')

    return {
      success: true,
      content: rewrittenContent,
      viralScore,
    }
  } catch (error: any) {
    console.error('❌ Gemini Rewrite Error:', error.message)

    // Check if we should retry
    const retryDelay = getRetryDelay(error)
    if (retryDelay && retryCount < maxRetries) {
      console.log(`⏳ Rate limit hit. Waiting ${retryDelay / 1000}s before retry ${retryCount + 1}/${maxRetries}...`)
      await sleep(retryDelay)
      return rewriteContentWithGemini(content, style, retryCount + 1, maxRetries)
    }

    let errorMessage = error.message || 'Failed to rewrite content'

    if (error.message?.includes('quota') || error.message?.includes('429')) {
      const waitTime = retryDelay ? Math.ceil(retryDelay / 1000) : 30
      errorMessage = `Gemini rate limit exceeded. Please wait ${waitTime} seconds and try again.`
    }

    return {
      success: false,
      content: '',
      viralScore: 0,
      error: errorMessage,
    }
  }
}

/**
 * Calculate viral score using Gemini
 */
async function calculateViralScoreWithGemini(content: string): Promise<number> {
  try {
    const genAI = getGeminiClient()
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: {
        responseMimeType: 'application/json',
      },
    })

    const prompt = `You are an expert at analyzing content virality potential.\n\n${VIRAL_SCORE_PROMPT}\n\nContent to analyze:\n${content}\n\nReturn JSON: {"score": number}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    const data = JSON.parse(text)
    return data.score || 50
  } catch (error) {
    console.error('Error calculating viral score with Gemini:', error)
    return 50 // Default score
  }
}

/**
 * Chat with Gemini for closing/coaching
 */
export async function chatWithGemini(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  context: 'closing' | 'coaching' | 'general' = 'general'
): Promise<string> {
  try {
    const genAI = getGeminiClient()
    const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' })

    const systemPrompts = {
      closing: SYSTEM_PROMPTS.CLOSING_ASSISTANT,
      coaching: SYSTEM_PROMPTS.CONTENT_GENERATOR,
      general: SYSTEM_PROMPTS.CONTENT_GENERATOR,
    }

    // Build conversation history for Gemini
    const conversationHistory = messages
      .map((msg) => {
        if (msg.role === 'user') {
          return `User: ${msg.content}`
        } else if (msg.role === 'assistant') {
          return `Assistant: ${msg.content}`
        }
        return ''
      })
      .filter((line) => line.length > 0)
      .join('\n\n')

    const prompt = `${systemPrompts[context]}\n\nConversation:\n${conversationHistory}\n\nAssistant:`

    const result = await model.generateContent(prompt)
    const response = await result.response
    const text = response.text()

    return text || ''
  } catch (error) {
    console.error('Gemini chat error:', error)
    throw error
  }
}

/**
 * Get system prompt based on content type
 */
function getSystemPrompt(type: ContentType): string {
  const promptMap: Record<ContentType, string> = {
    caption: SYSTEM_PROMPTS.CONTENT_GENERATOR,
    hook: SYSTEM_PROMPTS.EMOTIONAL_HOOKS,
    script: SYSTEM_PROMPTS.TIKTOK_SPECIALIST,
    post: SYSTEM_PROMPTS.CONTENT_GENERATOR,
    cta: SYSTEM_PROMPTS.CONTENT_GENERATOR,
    hashtags: SYSTEM_PROMPTS.CONTENT_GENERATOR,
    story: SYSTEM_PROMPTS.STORYTELLING,
  }

  return promptMap[type] || SYSTEM_PROMPTS.CONTENT_GENERATOR
}
