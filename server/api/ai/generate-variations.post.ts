import type { AIGenerationRequest } from '../../../app/types'
import { generateVariations } from '../../services/ai.service'
import { generateVariationsWithGemini } from '../../services/gemini.service'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{ request: AIGenerationRequest; count: number }>(event)

    if (!body.request) {
      return {
        success: false,
        error: 'Missing request data',
      }
    }

    const count = body.count || 3

    // Choose AI provider
    const config = useRuntimeConfig()
    const aiProvider = config.aiProvider || 'gemini'

    let results

    if (aiProvider === 'gemini') {
      console.log('🌟 Generating variations with Gemini (FREE)')
      results = await generateVariationsWithGemini(body.request, count)
    } else {
      console.log('🤖 Generating variations with OpenAI')
      results = await generateVariations(body.request, count)
    }

    return {
      success: true,
      data: results,
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to generate variations',
    }
  }
})
