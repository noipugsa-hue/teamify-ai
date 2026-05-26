import { chatWithAI } from '../../services/ai.service'
import { chatWithGemini } from '../../services/gemini.service'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody<{
      messages: Array<{ role: 'user' | 'assistant' | 'system'; content: string }>
      context?: 'closing' | 'coaching' | 'general'
    }>(event)

    if (!body.messages || body.messages.length === 0) {
      return {
        success: false,
        error: 'Messages array is required',
      }
    }

    // Choose AI provider
    const config = useRuntimeConfig()
    const aiProvider = config.aiProvider || 'gemini'

    let response

    if (aiProvider === 'gemini') {
      console.log('🌟 Chatting with Gemini (FREE)')
      response = await chatWithGemini(body.messages, body.context)
    } else {
      console.log('🤖 Chatting with OpenAI')
      response = await chatWithAI(body.messages, body.context)
    }

    return {
      success: true,
      data: {
        message: response,
      },
    }
  } catch (error: any) {
    console.error('❌ Chat Error:', error.message)
    return {
      success: false,
      error: error.message || 'Failed to generate chat response',
    }
  }
})
