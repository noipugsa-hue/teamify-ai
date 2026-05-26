import { rewriteContent } from '../../services/ai.service'
import { rewriteContentWithGemini } from '../../services/gemini.service'

export default defineEventHandler(async (event) => {
  try {
    console.log('🔍 Rewrite API called')
    console.log('Request method:', event.method)
    console.log('Request headers:', event.headers)

    const body = await readBody<{
      content: string
      style: 'shorter' | 'longer' | 'more_engaging' | 'professional' | 'casual'
    }>(event)

    console.log('📥 Rewrite API received body:', {
      bodyType: typeof body,
      bodyKeys: body ? Object.keys(body) : [],
      hasContent: !!body?.content,
      contentLength: body?.content?.length || 0,
      contentType: typeof body?.content,
      hasStyle: !!body?.style,
      style: body?.style,
      styleType: typeof body?.style,
      fullBody: body,
    })

    if (!body.content || !body.style) {
      console.error('❌ Missing required fields:', { hasContent: !!body.content, hasStyle: !!body.style })
      return {
        success: false,
        error: 'Missing required fields: content, style',
      }
    }

    // Choose AI provider
    const config = useRuntimeConfig()
    const aiProvider = config.aiProvider || 'gemini'

    let result

    if (aiProvider === 'gemini') {
      console.log('🌟 Rewriting with Gemini (FREE)')
      result = await rewriteContentWithGemini(body.content, body.style)
    } else {
      console.log('🤖 Rewriting with OpenAI')
      result = await rewriteContent(body.content, body.style)
    }

    console.log('✅ Rewrite result:', { success: result.success })

    return {
      success: true,
      data: result,
    }
  } catch (error: any) {
    console.error('❌ Rewrite API Error:', error.message)
    return {
      success: false,
      error: error.message || 'Failed to rewrite content',
    }
  }
})
