import { generateEmotionalHooks } from '../../services/ai.service'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{
      niche: string
      emotion: 'curiosity' | 'fomo' | 'transformation' | 'pain' | 'desire'
      count?: number
    }>(event)

    if (!body.niche || !body.emotion) {
      return {
        success: false,
        error: 'Missing required fields: niche, emotion',
      }
    }

    const hooks = await generateEmotionalHooks(body.niche, body.emotion, body.count || 5)

    return {
      success: true,
      data: {
        hooks,
      },
    }
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to generate hooks',
    }
  }
})
