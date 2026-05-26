import type { AIGenerationRequest } from '../../../app/types'
import { generateContent } from '../../services/ai.service'
import { generateContentWithGemini } from '../../services/gemini.service'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<AIGenerationRequest>(event)

    if (!body.type || !body.platform || !body.prompt) {
      return {
        success: false,
        error: 'Missing required fields: type, platform, prompt',
      }
    }

    // Choose AI provider based on environment variable
    const config = useRuntimeConfig()
    const aiProvider = config.aiProvider || 'openai' // default to openai

    let result

    if (aiProvider === 'gemini') {
      console.log('🌟 Using Google Gemini (FREE)')
      result = await generateContentWithGemini(body)
    } else {
      console.log('🤖 Using OpenAI')
      result = await generateContent(body)
    }

    return {
      success: true,
      data: result,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to generate content',
    }
  }
})
