import OpenAI from 'openai'
import type {
  AIGenerationRequest,
  AIGenerationResponse,
  ContentType,
  Platform,
} from '../../app/types'
import { buildContentPrompt, VIRAL_SCORE_PROMPT } from '../../prompts/content'
import { SYSTEM_PROMPTS } from '../../prompts/system'

let openaiClient: OpenAI | null = null

function getOpenAIClient(): OpenAI {
  if (!openaiClient) {
    const config = useRuntimeConfig()

    if (!config.openaiApiKey || config.openaiApiKey === 'your_openai_api_key') {
      throw new Error(
        'OpenAI API key is not configured. Please add OPENAI_API_KEY to your .env file. ' +
        'Get your API key from https://platform.openai.com/api-keys'
      )
    }

    openaiClient = new OpenAI({
      apiKey: config.openaiApiKey,
    })
  }
  return openaiClient
}

/**
 * Generate content using OpenAI
 */
export async function generateContent(
  request: AIGenerationRequest
): Promise<AIGenerationResponse> {
  try {
    const openai = getOpenAIClient()

    const systemPrompt = getSystemPrompt(request.type)
    const userPrompt = buildContentPrompt(request.type, request.platform, {
      niche: request.context,
      tone: request.tone,
      length: request.length,
      context: request.prompt,
      maxWords: request.maxWords,
    })

    console.log('🤖 Generating content with OpenAI...')
    console.log('Type:', request.type, 'Platform:', request.platform)

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.8,
      max_tokens: 1500,
    })

    const content = completion.choices[0]?.message?.content || ''

    if (!content) {
      throw new Error('OpenAI returned empty content')
    }

    console.log('✅ Content generated successfully')

    // Calculate viral score
    const viralScore = await calculateViralScore(content)

    return {
      success: true,
      content,
      viralScore,
      suggestions: [],
    }
  } catch (error: any) {
    console.error('❌ AI Generation Error:', error.message)

    // Provide more helpful error messages
    let errorMessage = error.message || 'Failed to generate content'

    if (error.code === 'invalid_api_key') {
      errorMessage = 'Invalid OpenAI API key. Please check your OPENAI_API_KEY in .env file.'
    } else if (error.code === 'insufficient_quota') {
      errorMessage = 'OpenAI API quota exceeded. Please check your billing at https://platform.openai.com/account/billing'
    } else if (error.code === 'rate_limit_exceeded') {
      errorMessage = 'Rate limit exceeded. Please try again in a few moments.'
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
 * Generate multiple content variations
 */
export async function generateVariations(
  request: AIGenerationRequest,
  count: number = 3
): Promise<AIGenerationResponse[]> {
  const promises = Array(count)
    .fill(null)
    .map(() => generateContent(request))

  return Promise.all(promises)
}

/**
 * Rewrite existing content
 */
export async function rewriteContent(
  content: string,
  style: 'shorter' | 'longer' | 'more_engaging' | 'professional' | 'casual'
): Promise<AIGenerationResponse> {
  try {
    const openai = getOpenAIClient()

    const stylePrompts = {
      shorter: 'Make this content more concise while keeping the key message and impact.',
      longer: 'Expand this content with more details, examples, and value while maintaining engagement.',
      more_engaging: 'Rewrite this to be more engaging, emotional, and viral-worthy.',
      professional: 'Rewrite this in a more professional and polished tone.',
      casual: 'Rewrite this in a more casual, conversational, and friendly tone.',
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPTS.CONTENT_GENERATOR,
        },
        {
          role: 'user',
          content: `${stylePrompts[style]}\n\nOriginal content:\n${content}`,
        },
      ],
      temperature: 0.7,
      max_tokens: 1500,
    })

    const rewrittenContent = completion.choices[0]?.message?.content || ''
    const viralScore = await calculateViralScore(rewrittenContent)

    return {
      success: true,
      content: rewrittenContent,
      viralScore,
    }
  } catch (error: any) {
    return {
      success: false,
      content: '',
      viralScore: 0,
      error: error.message,
    }
  }
}

/**
 * Generate emotional hooks
 */
export async function generateEmotionalHooks(
  niche: string,
  emotion: 'curiosity' | 'fomo' | 'transformation' | 'pain' | 'desire',
  count: number = 5
): Promise<string[]> {
  try {
    const openai = getOpenAIClient()

    const emotionPrompts = {
      curiosity: 'that trigger intense curiosity and the need to know more',
      fomo: 'that create fear of missing out and urgency',
      transformation: 'that promise transformation and better results',
      pain: 'that address pain points and struggles',
      desire: 'that tap into desires and aspirations',
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPTS.EMOTIONAL_HOOKS,
        },
        {
          role: 'user',
          content: `Generate ${count} powerful hooks for ${niche} ${emotionPrompts[emotion]}. Each hook should be 3-8 words and stop scrolling immediately.`,
        },
      ],
      temperature: 0.9,
      max_tokens: 500,
    })

    const response = completion.choices[0]?.message?.content || ''
    const hooks = response
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .map((line) => line.replace(/^\d+\.\s*/, '').replace(/^["']|["']$/g, '').trim())
      .filter((line) => line.length > 0)
      .slice(0, count)

    return hooks
  } catch (error) {
    console.error('Error generating hooks:', error)
    return []
  }
}

/**
 * Calculate viral score for content
 */
export async function calculateViralScore(content: string): Promise<number> {
  try {
    const openai = getOpenAIClient()

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: 'You are an expert at analyzing content virality potential.',
        },
        {
          role: 'user',
          content: `${VIRAL_SCORE_PROMPT}\n\nContent to analyze:\n${content}`,
        },
      ],
      temperature: 0.3,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    })

    const response = completion.choices[0]?.message?.content || '{}'
    const data = JSON.parse(response)

    return data.score || 0
  } catch (error) {
    console.error('Error calculating viral score:', error)
    return 50 // Default score
  }
}

/**
 * Chat with AI for closing/coaching
 */
export async function chatWithAI(
  messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>,
  context: 'closing' | 'coaching' | 'general' = 'general'
): Promise<string> {
  try {
    const openai = getOpenAIClient()

    const systemPrompts = {
      closing: SYSTEM_PROMPTS.CLOSING_ASSISTANT,
      coaching: SYSTEM_PROMPTS.CONTENT_GENERATOR,
      general: SYSTEM_PROMPTS.CONTENT_GENERATOR,
    }

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: systemPrompts[context],
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 1000,
    })

    return completion.choices[0]?.message?.content || ''
  } catch (error) {
    console.error('Chat error:', error)
    throw error
  }
}

/**
 * Generate landing page copy
 */
export async function generateLandingPageCopy(params: {
  product: string
  targetAudience: string
  benefits: string[]
  painPoints: string[]
}): Promise<{
  headline: string
  subheadline: string
  cta: string
  sections: Array<{ title: string; content: string }>
}> {
  try {
    const openai = getOpenAIClient()

    const prompt = `Generate compelling landing page copy for:
Product: ${params.product}
Target Audience: ${params.targetAudience}
Key Benefits: ${params.benefits.join(', ')}
Pain Points: ${params.painPoints.join(', ')}

Provide:
1. Powerful headline (8-12 words)
2. Supporting subheadline (15-20 words)
3. Primary CTA button text (2-4 words)
4. 4 section titles and copy (features, benefits, testimonials, final CTA)

Format as JSON.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPTS.LANDING_PAGE,
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.8,
      max_tokens: 2000,
      response_format: { type: 'json_object' },
    })

    const response = completion.choices[0]?.message?.content || '{}'
    return JSON.parse(response)
  } catch (error) {
    console.error('Error generating landing page:', error)
    throw error
  }
}

/**
 * Analyze trends and suggest content
 */
export async function analyzeTrendsAndSuggest(
  niche: string,
  trends: string[]
): Promise<string[]> {
  try {
    const openai = getOpenAIClient()

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: SYSTEM_PROMPTS.TIKTOK_SPECIALIST,
        },
        {
          role: 'user',
          content: `Analyze these trending topics: ${trends.join(', ')}

For the ${niche} niche, suggest 5 specific content ideas that adapt these trends. Each idea should be actionable and include a hook.`,
        },
      ],
      temperature: 0.8,
      max_tokens: 1000,
    })

    const response = completion.choices[0]?.message?.content || ''
    const suggestions = response
      .split('\n')
      .filter((line) => line.trim().length > 0)
      .slice(0, 5)

    return suggestions
  } catch (error) {
    console.error('Error analyzing trends:', error)
    return []
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
